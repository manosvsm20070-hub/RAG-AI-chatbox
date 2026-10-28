import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { currentUserMock, hrUserMock, HR_CREDENTIALS } from '../api/mockData';
import { api } from '../api/client';

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
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateLanguage: (lang: User['preferredLanguage']) => void;
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

  const login = async (
    email: string,
    password?: string,
    role: UserRole = 'lead'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Check if trying to sign in as HR Lohan K J
      if (normalizedEmail === HR_CREDENTIALS.email.toLowerCase()) {
        const inputClean = (password || '').trim().toLowerCase().replace(/\s+/g, ' ');
        const targetClean = HR_CREDENTIALS.password.toLowerCase().replace(/\s+/g, ' ');
        const inputNoSpace = (password || '').replace(/\s+/g, '').toLowerCase();
        const targetNoSpace = HR_CREDENTIALS.password.replace(/\s+/g, '').toLowerCase();

        const isPasswordValid = 
          !password || 
          inputClean === targetClean || 
          inputNoSpace === targetNoSpace ||
          password.trim() === 'Lohan K J';

        if (!isPasswordValid) {
          return {
            success: false,
            error: 'Invalid password. Please check your credentials.',
          };
        }
        setUser(hrUserMock);
        localStorage.setItem('nexus_user', JSON.stringify(hrUserMock));
        return { success: true };
      }

      // Standard user flow
      const res = await api.login(email);
      const updatedUser: User = {
        ...res.user,
        email,
        role: role === 'hr' ? 'hr' : role,
      };
      setUser(updatedUser);
      localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    api.setToken(null);
  };

  const updateLanguage = (lang: User['preferredLanguage']) => {
    if (!user) return;
    const updated = { ...user, preferredLanguage: lang };
    setUser(updated);
    localStorage.setItem('nexus_user', JSON.stringify(updated));
  };

  const isHR =
    !!user &&
    (user.role === 'hr' || user.email.toLowerCase() === 'lohankanagaraj@gmail.com');

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
        login,
        logout,
        updateLanguage,
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
