package com.nutrivision.backend.nutrition.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record NutritionTargetResponse(
        Long id,
        BigDecimal calorieTargetKcal,
        BigDecimal proteinTargetG,
        BigDecimal carbohydrateTargetG,
        BigDecimal fatTargetG,
        String calculationMethod,
        boolean customized,
        OffsetDateTime effectiveFrom
) {
}