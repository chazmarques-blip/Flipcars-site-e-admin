import { create } from 'zustand';
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
  hydrateAuth: () => void;
}

// Helper to save auth state to localStorage manually (simpler, no Zustand persist)
function saveAuthToStorage(user: User | null, isAuthenticated: boolean) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('flipcars-user', JSON.stringify(user));
      localStorage.setItem('flipcars-auth', JSON.stringify(isAuthenticated));
    } catch (error) {
      console.error('[AuthStore] Error saving to localStorage:', error);
    }
  }
}

// Helper to load auth state from localStorage manually
function loadAuthFromStorage(): { user: User | null; isAuthenticated: boolean } {
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('flipcars-user');
      const authStr = localStorage.getItem('flipcars-auth');
      
      const user = userStr ? JSON.parse(userStr) : null;
      const isAuthenticated = authStr ? JSON.parse(authStr) : false;
      
      return { user, isAuthenticated };
    } catch (error) {
      console.error('[AuthStore] Error loading from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('flipcars-user');
      localStorage.removeItem('flipcars-auth');
    }
  }
  return { user: null, isAuthenticated: false };
}

// Create store WITHOUT persist middleware to avoid hydration errors
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Hydrate auth state from localStorage on mount
  hydrateAuth: () => {
    const { user, isAuthenticated } = loadAuthFromStorage();
    if (user && isAuthenticated) {
      set({ user, isAuthenticated });
      console.log('[AuthStore] Hydrated from localStorage:', user.email);
    }
  },

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
      const newState = {
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
      // Save to localStorage manually
      saveAuthToStorage(response.user, true);
      
      set(newState);
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
      saveAuthToStorage(null, false);
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.register(data);
      
      // Store tokens in API client
      apiClientInstance.setTokens(response.accessToken, response.refreshToken);
      
      const newState = {
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
      saveAuthToStorage(response.user, true);
      set(newState);
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed. Please try again.';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      saveAuthToStorage(null, false);
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
      
      // Clear localStorage manually
      saveAuthToStorage(null, false);
      
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
      saveAuthToStorage(null, false);
      return;
    }

    set({ isLoading: true });
    
    try {
      // Fetch user profile from API
      const user = await authService.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
      saveAuthToStorage(user, true);
    } catch (error) {
      console.error('[AuthStore] Load user error:', error);
      // If profile fetch fails, clear auth state
      apiClientInstance.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
      saveAuthToStorage(null, false);
    }
  },

  clearError: () => set({ error: null }),
  
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
    saveAuthToStorage(user, !!user);
  },
}));
