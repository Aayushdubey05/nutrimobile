export type AnalysisStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface AiModelResultResponse {
  id: number;
  modelName: string;
  modelVersion: string;
  confidence: number;
  processingTimeMs: number;
}

export interface ExplainabilityResultResponse {
  id: number;
  heatmapUrl: string | null;
  caption: string | null;
}

export interface FoodAnalysisItemResponse {
  id: number;
  foodId: number;
  detectedName: string;
  confidence: number;
  estimatedWeightG: number;
  finalWeightG: number;
  finalFoodId: number | null;
  finalFoodName: string | null;
  aiModelResults: AiModelResultResponse[];
  explainability: ExplainabilityResultResponse | null;
}

export interface FoodAnalysisResponse {
  id: number;
  imageUrl: string;
  status: AnalysisStatus;
  createdAt: string;
  completedAt: string | null;
  items: FoodAnalysisItemResponse[];
}

export interface CreateAnalysisRequest {
  imageUrl: string;
}

export interface UpdateAnalysisItemRequest {
  finalFoodId: number;
  finalWeightG: number;
}
