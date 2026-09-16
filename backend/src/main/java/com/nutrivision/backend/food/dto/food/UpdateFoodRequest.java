package com.nutrivision.backend.food.dto.food;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateFoodRequest(

        @NotBlank(message = "Food name is required")
        @Size(max = 150, message = "Food name must not exceed 150 characters")
        String name,

        String description,

        @NotNull(message = "Category ID is required")
        Long categoryId,

        String imageUrl
) {
}