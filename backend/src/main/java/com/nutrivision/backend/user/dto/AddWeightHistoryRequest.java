package com.nutrivision.backend.user.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record AddWeightHistoryRequest(

        @NotNull(message = "Weight is required")
        @DecimalMin(value = "1.00", message = "Weight must be at least 1 kg")
        @DecimalMax(value = "500.00", message = "Weight must not exceed 500 kg")
        BigDecimal weightKg

) {
}