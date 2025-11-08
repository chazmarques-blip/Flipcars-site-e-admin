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
          // Call real API
          const response = await authService.login(credentials);
          console.log('[AuthStore] API response received:', response.user);
          
          // Store tokens in API client
          apiClientInstance.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
          
          console.log('[AuthStore] Setting authenticated user:', response.user);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          console.log('[AuthStore] Login complete, state updated');
        } catch (error) {
          console.error('[AuthStore] Login error:', error);
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed. Please try again.';
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
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        set({ isLoading: true });
        
        try {
          // Fetch user profile from API
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('[AuthStore] Load user error:', error);
          // If profile fetch fails, clear auth state
          apiClientInstance.clearTokens();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
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
