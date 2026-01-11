import { endpoint } from "../../../core/http/endpoint";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresAtUtc: string;
}

export const AuthApi = {
  login: endpoint<AuthResponse, LoginRequest>('POST', '/api/Auth/login'),
};
