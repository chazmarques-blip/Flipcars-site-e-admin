import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor() {
    console.log('[ApiClient] Initializing with API_URL:', API_URL);
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add access token to headers
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const fullUrl = config.baseURL + config.url;
        console.log('[ApiClient] ========== REQUEST ==========');
        console.log('[ApiClient] Method:', config.method?.toUpperCase());
        console.log('[ApiClient] URL:', config.url);
        console.log('[ApiClient] Full URL:', fullUrl);
        console.log('[ApiClient] BaseURL:', config.baseURL);
        console.log('[ApiClient] Has token:', !!this.accessToken);
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
          console.log('[ApiClient] ✅ Token added to headers');
        } else {
          console.warn('[ApiClient] ⚠️ No token available!');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Wait for the refresh to complete
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            this.processQueue(null, newAccessToken);
            
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError as Error, null);
            this.clearTokens();
            
            // Redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: Error | null, token: string | null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken: this.refreshToken,
    });

    const { accessToken, refreshToken } = response.data;
    this.setTokens(accessToken, refreshToken);
    
    return accessToken;
  }

  public setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  public clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  public loadTokensFromStorage() {
    console.log('[ApiClient] loadTokensFromStorage called');
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      console.log('[ApiClient] Found in localStorage - Access token:', !!accessToken, 'Refresh token:', !!refreshToken);

      if (accessToken && refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        console.log('[ApiClient] ✅ Tokens loaded into memory');
      } else {
        console.warn('[ApiClient] ⚠️ No tokens in localStorage!');
      }
    }
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public hasToken(): boolean {
    return !!this.accessToken;
  }
}

// Export singleton instance
export const apiClientInstance = new ApiClient();
export const apiClient = apiClientInstance.getClient();
export default apiClient;
