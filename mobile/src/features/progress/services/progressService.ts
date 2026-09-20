import { apiClient } from "@/api/apiClient";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/types";

import type { ProgressPeriod, ProgressResponse } from "../types";

export const progressService = {
  async getProgress(period: ProgressPeriod): Promise<ProgressResponse> {
    const response = await apiClient.get<ApiResponse<ProgressResponse>>(
      ENDPOINTS.PROGRESS.SUMMARY(period),
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to get progress");
    }

    return response.data.data;
  },
};
