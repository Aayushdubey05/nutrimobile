import { apiClient } from "@/api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse } from "../../../api/types";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserInfo,
} from "../types";

export const authService = {
  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      request,
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Login failed");
    }

    return response.data.data;
  },

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.AUTH.REGISTER,
      request,
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Registration failed");
    }

    return response.data.data;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Token refresh failed");
    }

    return response.data.data;
  },

  async getCurrentUser(): Promise<UserInfo> {
    const response = await apiClient.get<ApiResponse<UserInfo>>(
      ENDPOINTS.USER.ME,
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to get current user");
    }

    return response.data.data;
  },
};
