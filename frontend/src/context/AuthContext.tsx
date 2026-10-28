import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ManagedUser, UserRole } from '../types';
import { currentUserMock, hrUserMock, HR_CREDENTIALS, initialManagedUsersMock } from '../api/mockData';
import { api } from '../api/client';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
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
          return parsed;
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
        setUser(JSON.parse(savedUser));
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

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
    ];

    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const newUser: ManagedUser = {
      id: cleanId,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password.trim(),
      role: userData.role || 'member',
      avatar: randomAvatar,
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
    const updated = managedUsers.map((u) => {
      if (u.id === userId) {
        return { ...u, password: newPassword.trim() };
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
        const inputClean = cleanPassword.toLowerCase().replace(/\s+/g, ' ');
        const targetClean = HR_CREDENTIALS.password.toLowerCase().replace(/\s+/g, ' ');
        const inputNoSpace = cleanPassword.replace(/\s+/g, '').toLowerCase();
        const targetNoSpace = HR_CREDENTIALS.password.replace(/\s+/g, '').toLowerCase();

        const isPasswordValid = 
          !password || 
          inputClean === targetClean || 
          inputNoSpace === targetNoSpace ||
          cleanPassword === 'Lohan K J';

        if (!isPasswordValid) {
          return {
            success: false,
            error: 'Invalid password. Please check your credentials.',
          };
        }
        setUser(hrUserMock);
        localStorage.setItem('nexus_user', JSON.stringify(hrUserMock));
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

        const safeUser: User = {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          avatar: matchedUser.avatar,
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
