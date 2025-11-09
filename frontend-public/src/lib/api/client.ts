import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://upbeat-dedication-production.up.railway.app/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    console.log('[ApiClient] 🚀 Initializing with API_URL:', API_URL);
    console.log('[ApiClient] 🌍 Environment:', process.env.NODE_ENV);
    
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Ensure credentials are included for CORS
      withCredentials: false, // Set to false for public endpoints
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log('[ApiClient] 📤 Outgoing Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          headers: config.headers,
        });
        return config;
      },
      (error) => {
        console.error('[ApiClient] ❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log('[ApiClient] ✅ Response Received:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers,
        });
        return response;
      },
      (error: AxiosError) => {
        console.error('[ApiClient] ❌ Response Error:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
          },
        });
        
        // Check for CORS errors
        if (!error.response && error.message.includes('Network Error')) {
          console.error('[ApiClient] ❌ POSSIBLE CORS ERROR: Network request failed');
        }
        
        return Promise.reject(error);
      }
    );
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient.getClient();
