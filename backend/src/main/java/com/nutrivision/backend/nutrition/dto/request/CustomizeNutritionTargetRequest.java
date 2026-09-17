package com.nutrivision.backend.nutrition.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CustomizeNutritionTargetRequest(

        @NotNull(message = "Calorie target is required")
        @DecimalMin(
                value = "500.00",
                message = "Calorie target must be at least 500 kcal"
        )
        BigDecimal calorieTargetKcal,

        @NotNull(message = "Protein target is required")
        @DecimalMin(
                value = "0.00",
                message = "Protein target cannot be negative"
        )
        BigDecimal proteinTargetG,

        @NotNull(message = "Carbohydrate target is required")
        @DecimalMin(
                value = "0.00",
                message = "Carbohydrate target cannot be negative"
        )
        BigDecimal carbohydrateTargetG,

        @NotNull(message = "Fat target is required")
        @DecimalMin(
                value = "0.00",
                message = "Fat target cannot be negative"
        )
        BigDecimal fatTargetG

) {
}