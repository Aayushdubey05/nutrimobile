import { apiClient } from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";
import type { ApiResponse } from "../../../api/types";

import type {
  CreateAnalysisRequest,
  FoodAnalysisResponse,
  UpdateAnalysisItemRequest,
} from "../types";

export const analysisService = {
  async createAnalysis(
    request: CreateAnalysisRequest,
  ): Promise<FoodAnalysisResponse> {
    const response = await apiClient.post<ApiResponse<FoodAnalysisResponse>>(
      ENDPOINTS.ANALYSIS.CREATE,
      request,
    );

    if (!response.data.data) {
      throw new Error(
        response.data.message || "Failed to create food analysis",
      );
    }

    return response.data.data;
  },

  async getAnalysis(analysisId: number): Promise<FoodAnalysisResponse> {
    const response = await apiClient.get<ApiResponse<FoodAnalysisResponse>>(
      ENDPOINTS.ANALYSIS.BY_ID(analysisId),
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to get food analysis");
    }

    return response.data.data;
  },

  async getAnalyses(): Promise<FoodAnalysisResponse[]> {
    const response = await apiClient.get<ApiResponse<FoodAnalysisResponse[]>>(
      ENDPOINTS.ANALYSIS.LIST,
    );

    return response.data.data ?? [];
  },

  async updateAnalysisItem(
    analysisId: number,
    itemId: number,
    request: UpdateAnalysisItemRequest,
  ): Promise<FoodAnalysisResponse> {
    const response = await apiClient.put<ApiResponse<FoodAnalysisResponse>>(
      ENDPOINTS.ANALYSIS.UPDATE_ITEM(analysisId, itemId),
      request,
    );

    if (!response.data.data) {
      throw new Error(
        response.data.message || "Failed to update analysis item",
      );
    }

    return response.data.data;
  },
};
