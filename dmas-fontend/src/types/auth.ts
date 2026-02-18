export interface AuthResponse {
  token: string;
  userId: number;
  role: 'ADMIN' | 'RESPONDER' | 'CITIZEN';
}

export interface UserRegistration {
  name: string;
  email: string;
  password?: string;
  role: string;
  phoneNumber: string;
  location: string;
}