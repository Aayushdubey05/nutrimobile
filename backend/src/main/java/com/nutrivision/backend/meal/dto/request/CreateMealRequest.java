package com.nutrivision.backend.meal.dto.request;

import com.nutrivision.backend.meal.entity.MealType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record CreateMealRequest(

        @NotNull(message = "Meal type is required")
        MealType mealType,

        @NotNull(message = "Meal date is required")
        LocalDate mealDate,

        @NotNull(message = "Meal time is required")
        LocalTime mealTime,

        @NotEmpty(message = "Meal must contain at least one item")
        @Valid
        List<CreateMealItemRequest> items

) {
}