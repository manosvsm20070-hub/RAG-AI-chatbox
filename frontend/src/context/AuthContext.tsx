import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ManagedUser, UserRole, Team, TeamTask, NewTeamData } from '../types';
import { currentUserMock, hrUserMock, HR_CREDENTIALS, initialManagedUsersMock, teamsMock } from '../api/mockData';
import { api } from '../api/client';
import { DEFAULT_AVATAR, getEffectiveAvatar, isDefaultOrLegacyAvatar } from '../constants/avatar';
import { supabaseService } from '../services/supabaseService';

export interface NewUserData {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  title: string;
}

export interface UserLockStatus {
  locked: boolean;
  team?: Team;
  task?: TeamTask;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHR: boolean;
  isDatabaseConnected: boolean;
  canViewDocuments: boolean;
  canManageDocuments: boolean;
  canAllocateTeam: boolean;
  canCreateTasks: boolean;
  canAccessHRWorkspace: boolean;
  managedUsers: ManagedUser[];
  createUser: (userData: NewUserData) => { success: boolean; error?: string; user?: ManagedUser };
  deleteUser: (userId: string) => { success: boolean; error?: string };
  resetUserPassword: (userId: string, newPassword: string) => { success: boolean; error?: string };
  teams: Team[];
  createTeam: (teamData: NewTeamData) => { success: boolean; error?: string; team?: Team };
  completeTeamTask: (teamId: string) => { success: boolean; error?: string };
  deleteTeam: (teamId: string) => { success: boolean };
  getUserLockStatus: (userId: string) => UserLockStatus;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateLanguage: (lang: User['preferredLanguage']) => void;
  updateAvatar: (avatarUrl: string) => void;
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getPersistedAvatar = (identifier?: string): string | null => {
  if (!identifier) return null;
  try {
    const raw = localStorage.getItem('nexus_user_avatars');
    if (raw) {
      const map = JSON.parse(raw);
      const val = map[identifier.toLowerCase()];
      if (val && !isDefaultOrLegacyAvatar(val)) {
        return val;
      }
    }
  } catch (e) {}
  return null;
};

const setPersistedAvatar = (identifiers: (string | undefined)[], avatarUrl: string) => {
  try {
    const raw = localStorage.getItem('nexus_user_avatars');
    const map = raw ? JSON.parse(raw) : {};
    identifiers.forEach((id) => {
      if (id) {
        map[id.toLowerCase()] = avatarUrl;
      }
    });
    localStorage.setItem('nexus_user_avatars', JSON.stringify(map));
  } catch (e) {
    console.error('Failed to persist avatar map', e);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const customAvatar = getPersistedAvatar(parsed.email) || getPersistedAvatar(parsed.id);
        const effectiveAvatar = customAvatar || getEffectiveAvatar(parsed.avatar);
        const cleanUser = { ...parsed, avatar: effectiveAvatar };
        try {
          localStorage.setItem('nexus_user', JSON.stringify(cleanUser));
        } catch (e) {}
        return cleanUser;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(() => {
    const saved = localStorage.getItem('nexus_managed_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.map((u: ManagedUser) => ({
            ...u,
            avatar: getEffectiveAvatar(u.avatar),
          }));
          return cleaned;
        }
      } catch (e) {
        // fallback
      }
    }
    return initialManagedUsersMock;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState<boolean>(() =>
    supabaseService.isConfigured()
  );

  useEffect(() => {
    // Check local storage for persistent session
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const customAvatar = getPersistedAvatar(parsed.email) || getPersistedAvatar(parsed.id);
        const effectiveAvatar = customAvatar || getEffectiveAvatar(parsed.avatar);
        const cleanUser = { ...parsed, avatar: effectiveAvatar };
        setUser(cleanUser);
        try {
          localStorage.setItem('nexus_user', JSON.stringify(cleanUser));
        } catch (e) {}
      } catch (e) {
        setUser(null);
      }
    }

    // Sync from Supabase database if configured
    const isConfigured = supabaseService.isConfigured();
    setIsDatabaseConnected(isConfigured);

    if (isConfigured) {
      supabaseService.fetchUsers().then((dbUsers) => {
        if (dbUsers && dbUsers.length > 0) {
          setManagedUsers(dbUsers);
          try {
            localStorage.setItem('nexus_managed_users', JSON.stringify(dbUsers));
          } catch (e) {}
        }
      });

      supabaseService.fetchTeams().then((dbTeams) => {
        if (dbTeams && dbTeams.length > 0) {
          setTeams(dbTeams);
          try {
            localStorage.setItem('nexus_teams', JSON.stringify(dbTeams));
          } catch (e) {}
        }
      });
    }
  }, []);

  const saveManagedUsers = (users: ManagedUser[]) => {
    setManagedUsers(users);
    try {
      localStorage.setItem('nexus_managed_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to persist managed users', e);
    }
  };

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('nexus_teams');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return teamsMock;
  });

  const saveTeams = (newTeams: Team[]) => {
    setTeams(newTeams);
    try {
      localStorage.setItem('nexus_teams', JSON.stringify(newTeams));
    } catch (e) {
      console.error('Failed to persist teams', e);
    }
  };

  const isHR =
    !!user &&
    (user.role === 'hr' || user.email.toLowerCase() === HR_CREDENTIALS.email.toLowerCase());

  const createUser = (userData: NewUserData): { success: boolean; error?: string; user?: ManagedUser } => {
    if (!isHR) {
      return { success: false, error: 'Access Denied: Only HR can create user accounts.' };
    }

    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanId = (userData.id && userData.id.trim()) 
      ? userData.id.trim().toUpperCase() 
      : `USR-${Math.floor(100 + Math.random() * 900)}`;

    // Check if ID or email collides with HR or existing users
    if (
      cleanEmail === HR_CREDENTIALS.email.toLowerCase() ||
      cleanId === HR_CREDENTIALS.id.toUpperCase()
    ) {
      return { success: false, error: 'User ID or Email is reserved for HR Master account.' };
    }

    const exists = managedUsers.some(
      (u) => u.email.toLowerCase() === cleanEmail || u.id.toUpperCase() === cleanId
    );

    if (exists) {
      return { success: false, error: 'A user with this User ID or Email already exists.' };
    }

    const newUser: ManagedUser = {
      id: cleanId,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password.trim(),
      role: userData.role || 'member',
      avatar: DEFAULT_AVATAR,
      department: userData.department.trim() || 'General Engineering',
      title: userData.title.trim() || 'Team Member',
      preferredLanguage: 'auto',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: `${user?.name || 'HR'} (${user?.email || HR_CREDENTIALS.email})`
    };

    const updated = [newUser, ...managedUsers];
    saveManagedUsers(updated);

    if (supabaseService.isConfigured()) {
      supabaseService.insertUser(newUser).catch((err) => {
        console.error('[Supabase] Failed to persist new user:', err);
      });
    }

    return { success: true, user: newUser };
  };

  const deleteUser = (userId: string): { success: boolean; error?: string } => {
    if (!isHR) {
      return { success: false, error: 'Access Denied: Only HR can remove user accounts.' };
    }
    const updated = managedUsers.filter((u) => u.id !== userId);
    saveManagedUsers(updated);

    if (supabaseService.isConfigured()) {
      supabaseService.deleteUser(userId).catch((err) => {
        console.error('[Supabase] Failed to delete user from DB:', err);
      });
    }

    return { success: true };
  };

  const resetUserPassword = (userId: string, newPassword: string): { success: boolean; error?: string } => {
    if (!isHR) {
      return { success: false, error: 'Access Denied: Only HR can reset user passwords.' };
    }
    const cleanPwd = newPassword.trim();
    if (!cleanPwd || cleanPwd.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    const updated = managedUsers.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          password: cleanPwd,
          passwordUpdated: true,
          passwordUpdatedAt: new Date().toISOString()
        };
      }
      return u;
    });
    saveManagedUsers(updated);

    if (supabaseService.isConfigured()) {
      supabaseService.updateUserPassword(userId, cleanPwd).catch((err) => {
        console.error('[Supabase] Failed to reset password in DB:', err);
      });
    }

    return { success: true };
  };

  const getUserLockStatus = (userId: string): UserLockStatus => {
    if (!userId) return { locked: false };
    const cleanId = userId.trim().toLowerCase();
    for (const team of teams) {
      const isMember =
        (team.memberIds || []).some((m) => m.trim().toLowerCase() === cleanId) ||
        (team.leadId && team.leadId.trim().toLowerCase() === cleanId);
      if (isMember) {
        if (team.currentTask && team.currentTask.status !== 'completed') {
          return { locked: true, team, task: team.currentTask };
        }
      }
    }
    return { locked: false };
  };

  const createTeam = (teamData: NewTeamData): { success: boolean; error?: string; team?: Team } => {
    if (!isHR) {
      return { success: false, error: 'Access Denied: Only HR can create squads and allocate teams.' };
    }

    if (!teamData.name.trim()) {
      return { success: false, error: 'Team / Squad name is required.' };
    }

    if (!teamData.memberIds || teamData.memberIds.length === 0) {
      return { success: false, error: 'Please select at least one team member.' };
    }

    if (!teamData.leadId) {
      return { success: false, error: 'Please select a Team Leader from the chosen members.' };
    }

    if (!teamData.memberIds.includes(teamData.leadId)) {
      return { success: false, error: 'The Team Leader must be one of the selected team members.' };
    }

    if (!teamData.taskTitle.trim()) {
      return { success: false, error: 'An initial team task is required when creating a squad.' };
    }

    // Business Rule: Check if any of the selected users is already in an active team with an incomplete task
    for (const memberId of teamData.memberIds) {
      const lockStatus = getUserLockStatus(memberId);
      if (lockStatus.locked) {
        const memberObj = managedUsers.find((u) => u.id === memberId);
        const name = memberObj ? memberObj.name : memberId;
        return {
          success: false,
          error: `Cannot assign ${name}: already active in squad "${lockStatus.team?.name}" with ongoing task "${lockStatus.task?.title}". Complete that task before reassigning.`
        };
      }
    }

    const leadUser = managedUsers.find((u) => u.id === teamData.leadId);
    const leadName = leadUser ? leadUser.name : 'Squad Lead';

    const newTeamTask: TeamTask = {
      id: `task-${Date.now()}`,
      title: teamData.taskTitle.trim(),
      description: teamData.taskDescription?.trim(),
      priority: teamData.taskPriority || 'medium',
      dueDate: teamData.taskDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      dueDateLabel: teamData.taskDueDate ? teamData.taskDueDate.slice(5) : 'Next Week',
      status: 'in_progress',
    };

    const newTeam: Team = {
      id: `tm-${Date.now()}`,
      name: teamData.name.trim(),
      department: teamData.department || 'Engineering',
      leadId: teamData.leadId,
      leadName,
      memberIds: teamData.memberIds,
      membersCount: teamData.memberIds.length,
      activeProjectsCount: 1,
      currentTask: newTeamTask,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: `${user?.name || 'HR'} (${user?.email || HR_CREDENTIALS.email})`,
    };

    const updatedTeams = [newTeam, ...teams];
    saveTeams(updatedTeams);

    if (supabaseService.isConfigured()) {
      supabaseService.insertTeam(newTeam).catch((err) => {
        console.error('[Supabase] Failed to sync team to DB:', err);
      });
    }

    return { success: true, team: newTeam };
  };

  const completeTeamTask = (teamId: string): { success: boolean; error?: string } => {
    if (!isHR) {
      return { success: false, error: 'Access Denied: Only HR can mark team tasks as completed.' };
    }

    let found = false;
    let updatedTaskObj: any = undefined;
    const updated = teams.map((t) => {
      if (t.id === teamId) {
        found = true;
        updatedTaskObj = t.currentTask
          ? {
              ...t.currentTask,
              status: 'completed' as const,
              completedAt: new Date().toISOString().split('T')[0],
              completedBy: `${user?.name || 'HR'}`,
            }
          : undefined;
        return {
          ...t,
          currentTask: updatedTaskObj,
        };
      }
      return t;
    });

    if (!found) {
      return { success: false, error: 'Team not found.' };
    }

    saveTeams(updated);

    if (supabaseService.isConfigured()) {
      supabaseService.updateTeamTask(teamId, updatedTaskObj).catch((err) => {
        console.error('[Supabase] Failed to update team task in DB:', err);
      });
    }

    return { success: true };
  };

  const deleteTeam = (teamId: string): { success: boolean } => {
    if (!isHR) return { success: false };
    const updated = teams.filter((t) => t.id !== teamId);
    saveTeams(updated);

    if (supabaseService.isConfigured()) {
      supabaseService.deleteTeam(teamId).catch((err) => {
        console.error('[Supabase] Failed to delete team from DB:', err);
      });
    }

    return { success: true };
  };

  const login = async (
    identifier: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const cleanIdentifier = identifier.trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      // 1. Check HR Login (by email or user ID)
      const isHREmail = cleanIdentifier === HR_CREDENTIALS.email.toLowerCase();
      const isHRId = 
        cleanIdentifier === HR_CREDENTIALS.id.toLowerCase() ||
        cleanIdentifier === 'hr' ||
        cleanIdentifier === 'lohan' ||
        cleanIdentifier === 'hr-001';

      if (isHREmail || isHRId) {
        let effectiveHRPassword =
          localStorage.getItem('nexus_hr_password') || HR_CREDENTIALS.password;

        if (supabaseService.isConfigured()) {
          const dbHR = await supabaseService.findUserByIdentifier('usr-lohan-hr');
          if (dbHR && dbHR.password) {
            effectiveHRPassword = dbHR.password;
          }
        }

        const inputClean = cleanPassword.toLowerCase().replace(/\s+/g, ' ');
        const targetClean = effectiveHRPassword.toLowerCase().replace(/\s+/g, ' ');
        const inputNoSpace = cleanPassword.replace(/\s+/g, '').toLowerCase();
        const targetNoSpace = effectiveHRPassword.replace(/\s+/g, '').toLowerCase();

        const isPasswordValid = 
          cleanPassword === effectiveHRPassword ||
          inputClean === targetClean || 
          inputNoSpace === targetNoSpace;

        if (!isPasswordValid) {
          return {
            success: false,
            error: 'Invalid password. Please check your credentials.',
          };
        }
        const customHRAvatar =
          getPersistedAvatar(HR_CREDENTIALS.email) ||
          getPersistedAvatar(HR_CREDENTIALS.id) ||
          getPersistedAvatar('usr-lohan-hr');

        const authenticatedHR: User = {
          ...hrUserMock,
          avatar: customHRAvatar ? getEffectiveAvatar(customHRAvatar) : DEFAULT_AVATAR,
        };

        setUser(authenticatedHR);
        localStorage.setItem('nexus_user', JSON.stringify(authenticatedHR));
        api.setToken('mock-jwt-hr-session-active');
        return { success: true };
      }

      // 2. Check Managed Users (created by HR) by User ID or Email
      let matchedUser = managedUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanIdentifier ||
          u.id.toLowerCase() === cleanIdentifier
      );

      // If user not in local cache, query Supabase database directly
      if (!matchedUser && supabaseService.isConfigured()) {
        const dbUser = await supabaseService.findUserByIdentifier(cleanIdentifier);
        if (dbUser) {
          matchedUser = dbUser;
          setManagedUsers((prev) => [dbUser, ...prev.filter((u) => u.id !== dbUser.id)]);
        }
      }

      if (matchedUser) {
        // Verify password
        const isPasswordValid = matchedUser.password === cleanPassword;
        if (!isPasswordValid) {
          return {
            success: false,
            error: 'Invalid password. Please check your credentials.',
          };
        }

        const customUserAvatar =
          getPersistedAvatar(matchedUser.email) ||
          getPersistedAvatar(matchedUser.id) ||
          matchedUser.avatar;

        const safeUser: User = {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          avatar: getEffectiveAvatar(customUserAvatar),
          department: matchedUser.department,
          title: matchedUser.title,
          preferredLanguage: matchedUser.preferredLanguage,
        };

        setUser(safeUser);
        localStorage.setItem('nexus_user', JSON.stringify(safeUser));
        api.setToken(`mock-jwt-${matchedUser.id}-session-active`);
        return { success: true };
      }

      // 3. User does not exist
      return {
        success: false,
        error: 'No account found with this User ID or Email. Only HR can create user accounts.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    sessionStorage.clear();
    api.setToken(null);
  };

  const updateLanguage = (lang: User['preferredLanguage']) => {
    if (!user) return;
    const updated = { ...user, preferredLanguage: lang };
    setUser(updated);
    localStorage.setItem('nexus_user', JSON.stringify(updated));
  };

  const updateAvatar = (avatarUrl: string) => {
    if (!user) return;
    const updated = { ...user, avatar: avatarUrl };
    setUser(updated);

    try {
      localStorage.setItem('nexus_user', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save updated avatar', e);
    }

    // Persist permanently in the avatar store
    setPersistedAvatar([user.email, user.id], avatarUrl);

    setManagedUsers((prev) => {
      const exists = prev.some(
        (u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
      );
      if (exists) {
        const next = prev.map((u) =>
          u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
            ? { ...u, avatar: avatarUrl }
            : u
        );
        try {
          localStorage.setItem('nexus_managed_users', JSON.stringify(next));
        } catch (e) {}
        return next;
      }
      return prev;
    });

    if (supabaseService.isConfigured() && user) {
      supabaseService.updateUserAvatar(user.id, avatarUrl).catch((err) => {
        console.error('[Supabase] Failed to update avatar in DB:', err);
      });
    }
  };

  const changePassword = (
    oldPassword: string,
    newPassword: string
  ): { success: boolean; error?: string } => {
    if (!user) {
      return { success: false, error: 'You must be logged in to change your password.' };
    }

    const cleanOld = oldPassword.trim();
    const cleanNew = newPassword.trim();

    if (!cleanOld || !cleanNew) {
      return { success: false, error: 'Current password and new password are required.' };
    }

    if (cleanNew.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    if (cleanOld === cleanNew) {
      return { success: false, error: 'New password cannot be the same as your current password.' };
    }

    // HR User Password Change
    if (isHR || user.email.toLowerCase() === HR_CREDENTIALS.email.toLowerCase()) {
      const currentHRPassword =
        localStorage.getItem('nexus_hr_password') || HR_CREDENTIALS.password;

      const inputClean = cleanOld.toLowerCase().replace(/\s+/g, ' ');
      const targetClean = currentHRPassword.toLowerCase().replace(/\s+/g, ' ');
      const inputNoSpace = cleanOld.replace(/\s+/g, '').toLowerCase();
      const targetNoSpace = currentHRPassword.replace(/\s+/g, '').toLowerCase();

      const isOldValid =
        cleanOld === currentHRPassword ||
        inputClean === targetClean ||
        inputNoSpace === targetNoSpace;

      if (!isOldValid) {
        return {
          success: false,
          error: 'Current password does not match. Please verify your old password.',
        };
      }

      try {
        localStorage.setItem('nexus_hr_password', cleanNew);
      } catch (e) {
        console.error('Failed to save HR password', e);
      }

      if (supabaseService.isConfigured()) {
        supabaseService.updateUserPassword('usr-lohan-hr', cleanNew).catch((err) => {
          console.error('[Supabase] Failed to update HR password in DB:', err);
        });
      }

      return { success: true };
    }

    // Managed User Password Change
    const targetUserIndex = managedUsers.findIndex(
      (u) =>
        u.id.toLowerCase() === user.id.toLowerCase() ||
        u.email.toLowerCase() === user.email.toLowerCase()
    );

    if (targetUserIndex !== -1) {
      const currentStored = managedUsers[targetUserIndex].password;
      if (currentStored !== cleanOld) {
        return {
          success: false,
          error: 'Current password does not match. Please verify your old password.',
        };
      }

      const updatedUsers = [...managedUsers];
      updatedUsers[targetUserIndex] = {
        ...updatedUsers[targetUserIndex],
        password: cleanNew,
        passwordUpdated: true,
        passwordUpdatedAt: new Date().toISOString()
      };

      saveManagedUsers(updatedUsers);

      if (supabaseService.isConfigured()) {
        supabaseService.updateUserPassword(user.id, cleanNew).catch((err) => {
          console.error('[Supabase] Failed to update user password in DB:', err);
        });
      }

      return { success: true };
    }

    // Fallback for user
    const fallbackCurrent = localStorage.getItem('nexus_user_pwd_' + user.id) || 'password123';
    if (cleanOld !== fallbackCurrent) {
      return {
        success: false,
        error: 'Current password does not match. Please verify your old password.',
      };
    }
    localStorage.setItem('nexus_user_pwd_' + user.id, cleanNew);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isHR,
        isDatabaseConnected,
        canViewDocuments: isHR,
        canManageDocuments: isHR,
        canAllocateTeam: isHR,
        canCreateTasks: isHR,
        canAccessHRWorkspace: isHR,
        managedUsers,
        createUser,
        deleteUser,
        resetUserPassword,
        teams,
        createTeam,
        completeTeamTask,
        deleteTeam,
        getUserLockStatus,
        login,
        logout,
        updateLanguage,
        updateAvatar,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
