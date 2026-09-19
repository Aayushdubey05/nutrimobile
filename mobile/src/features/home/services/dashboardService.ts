import { apiClient } from "@/api/apiClient";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/types";

import type { DashboardMeal, DailyNutritionResponse } from "../types";

export const dashboardService = {
  async getDailyNutrition(date: string): Promise<DailyNutritionResponse> {
    const response = await apiClient.get<ApiResponse<DailyNutritionResponse>>(
      ENDPOINTS.NUTRITION.DAILY(date),
    );

    if (!response.data.data) {
      throw new Error(
        response.data.message || "Failed to load daily nutrition",
      );
    }

    return response.data.data;
  },

  async getMealsByDate(date: string): Promise<DashboardMeal[]> {
    const response = await apiClient.get<ApiResponse<DashboardMeal[]>>(
      ENDPOINTS.MEALS.BY_DATE(date),
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to load today's meals");
    }

    return response.data.data;
  },
};
