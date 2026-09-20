import { apiClient } from "@/api/apiClient";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/types";

import type {
  DietaryRestriction,
  HealthCondition,
  NutritionTargetResponse,
  UpdateUserProfileRequest,
  UpdateUserRequest,
  UpdateUserSettingsRequest,
  UserProfileResponse,
  UserSettingsResponse,
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

  async updateUser(request: UpdateUserRequest) {
    const response = await apiClient.put<ApiResponse<any>>(
      ENDPOINTS.USER.ME,
      request,
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to update user");
    }

    return response.data.data;
  },

  async getSettings(): Promise<UserSettingsResponse> {
    const response = await apiClient.get<ApiResponse<UserSettingsResponse>>(
      ENDPOINTS.USER.SETTINGS,
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to get settings");
    }

    return response.data.data;
  },

  async updateSettings(
    request: UpdateUserSettingsRequest,
  ): Promise<UserSettingsResponse> {
    const response = await apiClient.put<ApiResponse<UserSettingsResponse>>(
      ENDPOINTS.USER.SETTINGS,
      request,
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to update settings");
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

  async getNutritionTarget(): Promise<NutritionTargetResponse> {
    const response = await apiClient.get<ApiResponse<NutritionTargetResponse>>(
      ENDPOINTS.NUTRITION.TARGET,
    );

    if (!response.data.data) {
      throw new Error(
        response.data.message || "Failed to get nutrition target",
      );
    }

    return response.data.data;
  },

  async calculateNutritionTarget(): Promise<NutritionTargetResponse> {
    const response = await apiClient.post<ApiResponse<NutritionTargetResponse>>(
      ENDPOINTS.NUTRITION.CALCULATE_TARGET,
    );

    if (!response.data.data) {
      throw new Error(
        response.data.message || "Failed to calculate nutrition target",
      );
    }

    return response.data.data;
  },

  async updateNutritionTarget(request: {
    calorieTargetKcal: number;
    proteinTargetG: number;
    carbohydrateTargetG: number;
    fatTargetG: number;
  }): Promise<NutritionTargetResponse> {
    const response = await apiClient.put<ApiResponse<NutritionTargetResponse>>(
      ENDPOINTS.NUTRITION.TARGET,
      request,
    );

    if (!response.data.data) {
      throw new Error(
        response.data.message || "Failed to update nutrition target",
      );
    }

    return response.data.data;
  },
};
