package com.nutrivision.backend.food.dto.custom;

import com.nutrivision.backend.food.entity.CustomFoodStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewCustomFoodRequest(

        @NotNull(message = "Review status is required")
        CustomFoodStatus status,

        @Size(max = 1000, message = "Comment must not exceed 1000 characters")
        String comment
) {
}