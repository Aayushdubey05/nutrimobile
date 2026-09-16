package com.nutrivision.backend.food.dto.custom;

import com.nutrivision.backend.food.entity.CustomFoodStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record CustomFoodResponse(
        Long id,
        String name,
        String imageUrl,
        BigDecimal caloriesKcal,
        BigDecimal proteinG,
        BigDecimal carbohydratesG,
        BigDecimal fatG,
        BigDecimal fiberG,
        BigDecimal sugarG,
        BigDecimal saturatedFatG,
        BigDecimal sodiumMg,
        BigDecimal cholesterolMg,
        BigDecimal servingSizeG,
        CustomFoodStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}