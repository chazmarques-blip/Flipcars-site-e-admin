export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];  // Backend returns array of role strings
  language?: string;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  // Helper property for backwards compatibility
  role?: UserRole;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  AGENT = 'agent',
  CUSTOMER = 'customer',
  READ_ONLY = 'read_only',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
