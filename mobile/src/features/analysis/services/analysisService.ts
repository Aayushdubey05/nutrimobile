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

  /**
   * Uploads a photo captured with the camera or picked from the library. The file
   * is sent as multipart form-data because the server cannot fetch a local file:// URI.
   */
  async analyzeImage(
    uri: string,
    mimeType = "image/jpeg",
    fileName = "meal.jpg",
  ): Promise<FoodAnalysisResponse> {
    const form = new FormData();

    // React Native's FormData takes this {uri, name, type} shape for file parts.
    form.append("image", {
      uri,
      name: fileName,
      type: mimeType,
    } as any);

    const response = await apiClient.post<ApiResponse<FoodAnalysisResponse>>(
      ENDPOINTS.ANALYSIS.UPLOAD,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 90000,
      },
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to analyze image");
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
