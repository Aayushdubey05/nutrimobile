package com.nutrivision.backend.food.dto.nutrition;

import java.math.BigDecimal;

public record FoodNutritionResponse(
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