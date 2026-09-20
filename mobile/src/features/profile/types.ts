import type { UserInfo } from "@/features/auth/types";

export type GenderType = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export type FitnessGoalType =
  | "WEIGHT_LOSS"
  | "MUSCLE_GAIN"
  | "MAINTAIN_WEIGHT"
  | "BODY_RECOMPOSITION"
  | "HEALTHY_WEIGHT_GAIN"
  | "GENERAL_HEALTH"
  | "ATHLETIC_PERFORMANCE";

export type ActivityLevelType =
  | "SEDENTARY"
  | "LIGHTLY_ACTIVE"
  | "MODERATELY_ACTIVE"
  | "VERY_ACTIVE"
  | "EXTRA_ACTIVE";

export interface DietaryRestriction {
  id: number;
  name: string;
}

export interface HealthCondition {
  id: number;
  name: string;
}

export interface UserProfileResponse {
  id: number;
  age: number;
  gender: GenderType;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number | null;
  fitnessGoal: FitnessGoalType;
  activityLevel: ActivityLevelType;
  dietaryRestrictions: DietaryRestriction[];
  healthConditions: HealthCondition[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  age: number;
  gender: GenderType;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg?: number | null;
  fitnessGoal: FitnessGoalType;
  activityLevel: ActivityLevelType;
  dietaryRestrictionIds: number[];
  healthConditionIds: number[];
}

export interface UpdateUserRequest {
  name: string;
}

export interface UserSettingsResponse {
  id: number;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserSettingsRequest {
  notificationsEnabled: boolean;
}

export interface NutritionTargetResponse {
  id: number;
  calorieTargetKcal: number;
  proteinTargetG: number;
  carbohydrateTargetG: number;
  fatTargetG: number;
  calculationMethod: string;
  customized: boolean;
  effectiveFrom: string;
}

export type ProfileUserResponse = UserInfo;
