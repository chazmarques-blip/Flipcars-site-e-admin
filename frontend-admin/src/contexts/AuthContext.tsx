'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, apiClientInstance } from '@/lib/api';
import { User, LoginRequest } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userStr = localStorage.getItem('flipcars-user');
        const authStr = localStorage.getItem('flipcars-auth');
        
        if (userStr && authStr) {
          const savedUser = JSON.parse(userStr);
          const savedAuth = JSON.parse(authStr);
          
          if (savedUser && savedAuth) {
            setUser(savedUser);
            setIsAuthenticated(true);
            console.log('[AuthContext] User loaded from localStorage:', savedUser.email);
          }
        }
      } catch (error) {
        console.error('[AuthContext] Error loading user:', error);
        localStorage.removeItem('flipcars-user');
        localStorage.removeItem('flipcars-auth');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    console.log('[AuthContext] Login attempt:', credentials.email);
    setIsLoading(true);
    
    try {
      const response = await authService.login(credentials);
      console.log('[AuthContext] API response received:', response.user);
      
      // Store tokens
      apiClientInstance.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      
      // Save user
      localStorage.setItem('flipcars-user', JSON.stringify(response.user));
      localStorage.setItem('flipcars-auth', JSON.stringify(true));
      
      setUser(response.user);
      setIsAuthenticated(true);
      console.log('[AuthContext] Login complete');
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
    } finally {
      apiClientInstance.clearTokens();
      localStorage.removeItem('flipcars-user');
      localStorage.removeItem('flipcars-auth');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
