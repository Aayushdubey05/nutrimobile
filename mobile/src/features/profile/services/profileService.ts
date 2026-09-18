import { apiClient } from "@/api/apiClient";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/types";

import type {
  DietaryRestriction,
  HealthCondition,
  UpdateUserProfileRequest,
  UserProfileResponse,
} from "../types";

export const profileService = {
  async getProfile(): Promise<UserProfileResponse> {
    const response = await apiClient.get<ApiResponse<UserProfileResponse>>(
      ENDPOINTS.USER.PROFILE,
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to get profile");
    }

    return response.data.data;
  },

  async updateProfile(
    request: UpdateUserProfileRequest,
  ): Promise<UserProfileResponse> {
    const response = await apiClient.put<ApiResponse<UserProfileResponse>>(
      ENDPOINTS.USER.PROFILE,
      request,
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to update profile");
    }

    return response.data.data;
  },

  async getDietaryRestrictions(): Promise<DietaryRestriction[]> {
    const response = await apiClient.get<ApiResponse<DietaryRestriction[]>>(
      ENDPOINTS.DIETARY_RESTRICTIONS,
    );

    if (!response.data.data) {
      throw new Error(
        response.data.message || "Failed to get dietary restrictions",
      );
    }

    return response.data.data;
  },

  async getHealthConditions(): Promise<HealthCondition[]> {
    const response = await apiClient.get<ApiResponse<HealthCondition[]>>(
      ENDPOINTS.HEALTH_CONDITIONS,
    );

    if (!response.data.data) {
      throw new Error(
        response.data.message || "Failed to get health conditions",
      );
    }

    return response.data.data;
  },
};
