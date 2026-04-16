export interface AuthResponse {
  token: string;
  userId: number;
  role: 'ROLE_ADMIN' | 'ROLE_RESPONDER' | 'ROLE_CITIZEN';
  location?: string;
}

export interface UserRegistration {
  name: string;
  email: string;
  password?: string;
  role: string;
  phoneNumber: string;
  location: string;
}

// might delete it later
export interface User {
  token: string;
  userId: number;
  role: string;
  email: string;
  location?: string;
}