export interface DailyNutritionValues {
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

export interface DailyNutritionResponse {
  date: string;
  target: DailyNutritionValues;
  consumed: DailyNutritionValues;
  remaining: DailyNutritionValues;
}

export interface DashboardMealItem {
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
}

export interface DashboardMeal {
  id: number;
  mealType: string;
  mealDate: string;
  mealTime: string;
  items: DashboardMealItem[];
  nutrition: DailyNutritionValues;
}

export interface DashboardData {
  nutrition: DailyNutritionResponse;
  meals: DashboardMeal[];
}
