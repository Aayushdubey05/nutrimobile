import { apiClient } from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse } from "../../../api/types";
import type { CreateMealRequest, MealResponse } from "../types";

export const mealService = {
  async createMeal(request: CreateMealRequest) {
    const response = await apiClient.post<ApiResponse<MealResponse>>(
      ENDPOINTS.MEALS.CREATE,
      request,
    );

    return response.data.data;
  },

  async getMeals(): Promise<MealResponse[]> {
    const response = await apiClient.get<ApiResponse<MealResponse[]>>(
      ENDPOINTS.MEALS.LIST,
    );

    return response.data.data ?? [];
  },

  async getMealsByDate(date: string): Promise<MealResponse[]> {
    const response = await apiClient.get<ApiResponse<MealResponse[]>>(
      ENDPOINTS.MEALS.BY_DATE(date),
    );

    return response.data.data ?? [];
  },

  async deleteMeal(mealId: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.MEALS.BY_ID(mealId));
  },
};
