import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ManagedUser, UserRole } from '../types';
import { currentUserMock, hrUserMock, HR_CREDENTIALS, initialManagedUsersMock } from '../api/mockData';
import { api } from '../api/client';
import { DEFAULT_AVATAR, getEffectiveAvatar, isDefaultOrLegacyAvatar } from '../constants/avatar';

export interface NewUserData {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  title: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHR: boolean;
  canViewDocuments: boolean;
  canManageDocuments: boolean;
  canAllocateTeam: boolean;
  canCreateTasks: boolean;
  canAccessHRWorkspace: boolean;
  managedUsers: ManagedUser[];
  createUser: (userData: NewUserData) => { success: boolean; error?: string; user?: ManagedUser };
  deleteUser: (userId: string) => { success: boolean; error?: string };
  resetUserPassword: (userId: string, newPassword: string) => { success: boolean; error?: string };
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
  }, []);

  const saveManagedUsers = (users: ManagedUser[]) => {
    setManagedUsers(users);
    try {
      localStorage.setItem('nexus_managed_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to persist managed users', e);
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
    return { success: true, user: newUser };
  };

  const deleteUser = (userId: string): { success: boolean; error?: string } => {
    if (!isHR) {
      return { success: false, error: 'Access Denied: Only HR can remove user accounts.' };
    }
    const updated = managedUsers.filter((u) => u.id !== userId);
    saveManagedUsers(updated);
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
        const effectiveHRPassword =
          localStorage.getItem('nexus_hr_password') || HR_CREDENTIALS.password;

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
      const matchedUser = managedUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanIdentifier ||
          u.id.toLowerCase() === cleanIdentifier
      );

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
        canViewDocuments: isHR,
        canManageDocuments: isHR,
        canAllocateTeam: isHR,
        canCreateTasks: isHR,
        canAccessHRWorkspace: isHR,
        managedUsers,
        createUser,
        deleteUser,
        resetUserPassword,
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
