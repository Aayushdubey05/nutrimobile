import { apiClient } from "@/api/apiClient";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/types";

import type {
  Recommendation,
  RecommendationFeedbackResponse,
  RecommendationFeedbackType,
} from "../types";

export const recommendationService = {
  async generateRecommendations(): Promise<Recommendation[]> {
    const response = await apiClient.post<ApiResponse<Recommendation[]>>(
      ENDPOINTS.RECOMMENDATIONS.GENERATE,
    );

    if (!response.data.data) {
      throw new Error(
        response.data.message || "Failed to generate recommendations",
      );
    }

    return response.data.data;
  },

  async getActiveRecommendations(): Promise<Recommendation[]> {
    const response = await apiClient.get<ApiResponse<Recommendation[]>>(
      ENDPOINTS.RECOMMENDATIONS.ACTIVE,
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to get recommendations");
    }

    return response.data.data;
  },

  async addFeedback(
    recommendationId: number,
    feedback: RecommendationFeedbackType,
  ): Promise<RecommendationFeedbackResponse> {
    const response = await apiClient.post<
      ApiResponse<RecommendationFeedbackResponse>
    >(ENDPOINTS.RECOMMENDATIONS.FEEDBACK(recommendationId), {
      feedback,
    });

    if (!response.data.data) {
      throw new Error(
        response.data.message || "Failed to save recommendation feedback",
      );
    }

    return response.data.data;
  },
};
