package com.nutrivision.backend.meal.dto.response;

import java.math.BigDecimal;

public record MealNutritionResponse(
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