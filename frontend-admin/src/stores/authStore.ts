import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { authService } from '@/lib/api';
import { apiClientInstance } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        console.log('[AuthStore] Login attempt:', credentials.email);
        set({ isLoading: true, error: null });
        
        try {
          // Mock authentication for development
          const mockUsers = {
            'admin@flipcars.com': {
              id: '1',
              name: 'Admin User',
              email: 'admin@flipcars.com',
              role: 'super_admin',
              password: 'admin123',
            },
            'sarah@flipcars.us': {
              id: '1',
              name: 'Sarah Johnson',
              email: 'sarah@flipcars.us',
              role: 'super_admin',
              password: 'Admin123!',
            },
            'manager@flipcars.com': {
              id: '2',
              name: 'Manager User',
              email: 'manager@flipcars.com',
              role: 'admin',
              password: 'manager123',
            },
            'agent@flipcars.com': {
              id: '3',
              name: 'Agent User',
              email: 'agent@flipcars.com',
              role: 'agent',
              password: 'agent123',
            },
          };

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          const mockUser = mockUsers[credentials.email as keyof typeof mockUsers];
          
          if (!mockUser || mockUser.password !== credentials.password) {
            throw new Error('Invalid credentials');
          }

          // Create mock user without password
          const { password: _password, ...user } = mockUser;
          
          // Mock tokens
          apiClientInstance.setTokens('mock-access-token', 'mock-refresh-token');
          
          console.log('[AuthStore] Setting authenticated user:', user);
          set({
            user: user as User,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          console.log('[AuthStore] Login complete, state updated');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.register(data);
          
          // Store tokens in API client
          apiClientInstance.setTokens(response.accessToken, response.refreshToken);
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed. Please try again.';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear tokens from API client
          apiClientInstance.clearTokens();
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      loadUser: async () => {
        // Load tokens from storage
        apiClientInstance.loadTokensFromStorage();
        
        if (!apiClientInstance.hasToken()) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        // Mock mode: user is already in state (persisted)
        // No need to fetch from API in mock mode
        set({ isLoading: false });
      },

      clearError: () => set({ error: null }),
      
      setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
