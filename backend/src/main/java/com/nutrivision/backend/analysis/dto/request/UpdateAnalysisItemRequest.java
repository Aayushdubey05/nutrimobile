package com.nutrivision.backend.analysis.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UpdateAnalysisItemRequest(

        @NotNull(message = "Final food ID is required")
        Long finalFoodId,

        @NotNull(message = "Final weight is required")
        @DecimalMin(value = "0.01", message = "Final weight must be greater than 0")
        BigDecimal finalWeightG

) {
}