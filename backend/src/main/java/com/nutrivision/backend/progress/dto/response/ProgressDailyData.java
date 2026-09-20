package com.nutrivision.backend.progress.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProgressDailyData(
        LocalDate date,

        BigDecimal calories,
        BigDecimal targetCalories,

        BigDecimal proteinG,
        BigDecimal targetProteinG,

        BigDecimal carbohydratesG,
        BigDecimal targetCarbohydratesG,

        BigDecimal fatG,
        BigDecimal targetFatG
) {
}