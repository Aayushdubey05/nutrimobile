package com.nutrivision.backend.meal.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateMealItemRequest(

        Long foodId,

        Long customFoodId,

        @NotNull(message = "Quantity is required")
        @DecimalMin(value = "0.01", message = "Quantity must be greater than 0")
        BigDecimal quantity,

        @NotNull(message = "Weight is required")
        @DecimalMin(value = "0.01", message = "Weight must be greater than 0")
        BigDecimal weightG

) {
}