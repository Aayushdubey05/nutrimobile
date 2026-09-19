package com.nutrivision.backend.meal.dto.response;

import java.math.BigDecimal;

public record MealItemResponse(
        Long id,
        Long foodId,
        Long customFoodId,
        String foodName,
        String imageUrl,
        BigDecimal quantity,
        BigDecimal weightG,
        BigDecimal caloriesKcal,
        BigDecimal proteinG,
        BigDecimal carbohydratesG,
        BigDecimal fatG,
        BigDecimal fiberG,
        BigDecimal sugarG,
        BigDecimal saturatedFatG,
        BigDecimal sodiumMg,
        BigDecimal cholesterolMg
) {
}