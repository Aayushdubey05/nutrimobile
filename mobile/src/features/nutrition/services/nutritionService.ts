import { apiClient } from "@/api/apiClient";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/types";

export interface NutritionTargetResponse {
  id: number;
  calorieTargetKcal: number;
  proteinTargetG: number;
  carbohydrateTargetG: number;
  fatTargetG: number;
  calculationMethod: string;
  customized: boolean;
  effectiveFrom: string;
}

export const nutritionService = {
  async calculateTarget(): Promise<NutritionTargetResponse> {
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

  async getCurrentTarget(): Promise<NutritionTargetResponse> {
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
};
