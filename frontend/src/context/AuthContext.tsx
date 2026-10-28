import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { currentUserMock, hrUserMock, HR_CREDENTIALS } from '../api/mockData';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHR: boolean;
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
  const [user, setUser] = useState<User | null>(hrUserMock);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check local storage for persistent mock session
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(hrUserMock);
      }
    } else {
      // Default to HR user session
      setUser(hrUserMock);
      localStorage.setItem('nexus_user', JSON.stringify(hrUserMock));
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
        if (password && password.trim() !== HR_CREDENTIALS.password) {
          return {
            success: false,
            error: 'Invalid password. For HR account (lohankanagaraj@gmail.com), use password: Lohan K J',
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
