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
