package com.nutrivision.backend.user.dto;

import com.nutrivision.backend.user.entity.ActivityLevelType;
import com.nutrivision.backend.user.entity.FitnessGoalType;
import com.nutrivision.backend.user.entity.GenderType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.Set;

public record UpdateUserProfileRequest(

        @NotNull(message = "Age is required")
        @Positive(message = "Age must be positive")
        @Min(1)
        @Max(150)
        Short age,

        @NotNull(message = "Gender is required")
        GenderType gender,

        @NotNull(message = "Height is required")
        @DecimalMin(value = "50.00", message = "Height must be at least 50 cm")
        @DecimalMax(value = "300.00", message = "Height must not exceed 300 cm")
        BigDecimal heightCm,

        @NotNull(message = "Current weight is required")
        @DecimalMin(value = "1.00", message = "Current weight must be at least 1 kg")
        @DecimalMax(value = "500.00", message = "Current weight must not exceed 500 kg")
        BigDecimal currentWeightKg,

        @DecimalMin(value = "1.00", message = "Target weight must be at least 1 kg")
        @DecimalMax(value = "500.00", message = "Target weight must not exceed 500 kg")
        BigDecimal targetWeightKg,

        @NotNull(message = "Fitness goal is required")
        FitnessGoalType fitnessGoal,

        @NotNull(message = "Activity level is required")
        ActivityLevelType activityLevel,

        @NotNull
        @Size(max = 20)
        Set<Long> dietaryRestrictionIds,

        @NotNull
        @Size(max = 20)
        Set<Long> healthConditionIds

) {
}