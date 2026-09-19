export interface FoodNutrition {
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

export interface FoodCategory {
  id: number;
  name: string;
}

export interface FoodServing {
  id: number;
  servingName: string;
  weightG: number;
}

export interface Food {
  id: number;
  name: string;
  description: string | null;
  category: FoodCategory;
  imageUrl: string | null;
  verified: boolean;
  nutrition: FoodNutrition | null;
  servings: FoodServing[];
}
