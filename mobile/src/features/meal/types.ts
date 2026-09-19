export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "OTHER";

export interface CreateMealItemRequest {
  foodId: number;
  customFoodId: null;
  quantity: number;
  weightG: number;
}

export interface CreateMealRequest {
  mealType: MealType;
  mealDate: string;
  mealTime: string;
  items: CreateMealItemRequest[];
}

export interface MealItemResponse {
  id: number;
  foodId: number | null;
  customFoodId: number | null;
  foodName: string;
  imageUrl: string | null;
  quantity: number;
  weightG: number;
  caloriesKcal: number;
  proteinG: number;
  carbohydratesG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  saturatedFatG: number;
  sodiumMg: number;
  cholesterolMg: number;
}

export interface MealNutritionResponse {
  caloriesKcal: number;
  proteinG: number;
  carbohydratesG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  saturatedFatG: number;
  sodiumMg: number;
  cholesterolMg: number;
}

export interface MealResponse {
  id: number;
  mealType: MealType;
  mealDate: string;
  mealTime: string;
  items: MealItemResponse[];
  nutrition: MealNutritionResponse;
  createdAt: string;
  updatedAt: string;
}
