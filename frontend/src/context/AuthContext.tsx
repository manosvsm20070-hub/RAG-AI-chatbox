import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { currentUserMock } from '../api/mockData';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: 'admin' | 'lead' | 'member') => Promise<void>;
  logout: () => void;
  updateLanguage: (lang: User['preferredLanguage']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(currentUserMock);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check local storage for persistent mock session
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(currentUserMock);
      }
    }
  }, []);

  const login = async (email: string, role: 'admin' | 'lead' | 'member' = 'lead') => {
    setIsLoading(true);
    try {
      const res = await api.login(email);
      const updatedUser: User = { ...res.user, email, role };
      setUser(updatedUser);
      localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
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
