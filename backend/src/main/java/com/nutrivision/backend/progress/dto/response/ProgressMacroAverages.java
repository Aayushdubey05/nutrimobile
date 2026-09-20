package com.nutrivision.backend.progress.dto.response;

import java.math.BigDecimal;

public record ProgressMacroAverages(
        BigDecimal proteinG,
        BigDecimal targetProteinG,

        BigDecimal carbohydratesG,
        BigDecimal targetCarbohydratesG,

        BigDecimal fatG,
        BigDecimal targetFatG
) {
}