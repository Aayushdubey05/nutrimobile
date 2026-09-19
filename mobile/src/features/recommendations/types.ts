export type RecommendationCategory =
  | "CALORIES"
  | "PROTEIN"
  | "CARBOHYDRATES"
  | "FAT"
  | "MEAL_TIMING"
  | "FOOD_CHOICE"
  | "HYDRATION"
  | "GENERAL_HEALTH"
  | "FITNESS";

export type RecommendationStatus = "ACTIVE" | "EXPIRED";

export type RecommendationFeedbackType = "LIKE" | "DISLIKE";

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  reason: string;
  category: RecommendationCategory;
  status: RecommendationStatus;
  generatedAt: string;
  expiresAt: string | null;
  feedback: RecommendationFeedbackType | null;
}

export interface RecommendationFeedbackResponse {
  id: number;
  recommendationId: number;
  feedback: RecommendationFeedbackType;
  createdAt: string;
}
