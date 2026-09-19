import { apiClient } from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";
import { ApiResponse } from "../../../api/types";
import { Food } from "../types";

export const foodService = {
  async searchFoods(name: string): Promise<Food[]> {
    const response = await apiClient.get<ApiResponse<Food[]>>(
      ENDPOINTS.FOODS.SEARCH(name),
    );

    return response.data.data ?? [];
  },

  async getFood(foodId: number): Promise<Food> {
    const response = await apiClient.get<ApiResponse<Food>>(
      ENDPOINTS.FOODS.BY_ID(foodId),
    );

    if (!response.data.data) {
      throw new Error("Food not found");
    }

    return response.data.data;
  },

  async getRecentFoods(): Promise<Food[]> {
    const response = await apiClient.get<ApiResponse<Food[]>>(
      ENDPOINTS.FOODS.RECENT,
    );

    return response.data.data ?? [];
  },

  async recordSearch(foodId: number): Promise<void> {
    await apiClient.post(ENDPOINTS.FOODS.RECORD_SEARCH(foodId));
  },
};
