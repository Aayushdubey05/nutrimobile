package com.nutrivision.backend.meal.dto.response;

import com.nutrivision.backend.meal.entity.MealType;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;

public record MealResponse(
        Long id,
        MealType mealType,
        LocalDate mealDate,
        LocalTime mealTime,
        List<MealItemResponse> items,
        MealNutritionResponse nutrition,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}