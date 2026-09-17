package com.nutrivision.backend.nutrition.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailyNutritionResponse(

        LocalDate date,

        NutritionValues target,

        NutritionValues consumed,

        NutritionValues remaining

) {

    public record NutritionValues(

            BigDecimal caloriesKcal,
            BigDecimal proteinG,
            BigDecimal carbohydratesG,
            BigDecimal fatG,
            BigDecimal fiberG,
            BigDecimal sugarG,
            BigDecimal saturatedFatG,
            BigDecimal sodiumMg,
            BigDecimal cholesterolMg

    ) {
    }
}