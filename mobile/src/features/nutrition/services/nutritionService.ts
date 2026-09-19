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

export interface DailyNutritionValues {
  caloriesKcal: number;
  proteinG: number;
  carbohydratesG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  saturatedFatG: number;
  sodiumMg: number;
  cholesterolMg: number;
}

export interface DailyNutritionResponse {
  date: string;
  target: DailyNutritionValues;
  consumed: DailyNutritionValues;
  remaining: DailyNutritionValues;
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

  async getDailyNutrition(date: string): Promise<DailyNutritionResponse> {
    const response = await apiClient.get<ApiResponse<DailyNutritionResponse>>(
      ENDPOINTS.NUTRITION.DAILY(date),
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to get daily nutrition");
    }

    return response.data.data;
  },
};
