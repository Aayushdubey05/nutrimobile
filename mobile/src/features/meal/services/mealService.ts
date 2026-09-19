import { apiClient } from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";
import { ApiResponse } from "../../../api/types";
import { CreateMealRequest } from "../types";

export const mealService = {
  async createMeal(request: CreateMealRequest) {
    const response = await apiClient.post<ApiResponse<unknown>>(
      ENDPOINTS.MEALS.CREATE,
      request,
    );

    return response.data.data;
  },
};
