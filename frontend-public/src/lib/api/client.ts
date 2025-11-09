import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://upbeat-dedication-production.up.railway.app/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    console.log('[ApiClient] Initializing with API_URL:', API_URL);
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient.getClient();
