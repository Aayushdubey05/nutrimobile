package com.nutrivision.backend.food.dto.food;

import com.nutrivision.backend.food.dto.category.FoodCategoryResponse;
import com.nutrivision.backend.food.dto.nutrition.FoodNutritionResponse;
import com.nutrivision.backend.food.dto.serving.FoodServingResponse;

import java.util.List;

public record FoodResponse(
        Long id,
        String name,
        String description,
        FoodCategoryResponse category,
        String imageUrl,
        boolean verified,
        FoodNutritionResponse nutrition,
        List<FoodServingResponse> servings
) {
}