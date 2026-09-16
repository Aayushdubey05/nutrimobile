package com.nutrivision.backend.food.dto.custom;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateCustomFoodRequest(

        @NotBlank(message = "Food name is required")
        @Size(max = 150, message = "Food name must not exceed 150 characters")
        String name,

        String imageUrl,

        @NotNull(message = "Calories are required")
        @DecimalMin(value = "0.0", message = "Calories cannot be negative")
        BigDecimal caloriesKcal,

        @NotNull(message = "Protein is required")
        @DecimalMin(value = "0.0", message = "Protein cannot be negative")
        BigDecimal proteinG,

        @NotNull(message = "Carbohydrates are required")
        @DecimalMin(value = "0.0", message = "Carbohydrates cannot be negative")
        BigDecimal carbohydratesG,

        @NotNull(message = "Fat is required")
        @DecimalMin(value = "0.0", message = "Fat cannot be negative")
        BigDecimal fatG,

        @NotNull(message = "Fiber is required")
        @DecimalMin(value = "0.0", message = "Fiber cannot be negative")
        BigDecimal fiberG,

        @NotNull(message = "Sugar is required")
        @DecimalMin(value = "0.0", message = "Sugar cannot be negative")
        BigDecimal sugarG,

        @NotNull(message = "Saturated fat is required")
        @DecimalMin(value = "0.0", message = "Saturated fat cannot be negative")
        BigDecimal saturatedFatG,

        @NotNull(message = "Sodium is required")
        @DecimalMin(value = "0.0", message = "Sodium cannot be negative")
        BigDecimal sodiumMg,

        @NotNull(message = "Cholesterol is required")
        @DecimalMin(value = "0.0", message = "Cholesterol cannot be negative")
        BigDecimal cholesterolMg,

        @NotNull(message = "Serving size is required")
        @DecimalMin(value = "0.01", message = "Serving size must be greater than 0")
        BigDecimal servingSizeG
) {
}