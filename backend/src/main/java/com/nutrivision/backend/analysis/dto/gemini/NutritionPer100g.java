package com.nutrivision.backend.analysis.dto.gemini;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutritionPer100g {

    private BigDecimal caloriesKcal;
    private BigDecimal proteinG;
    private BigDecimal carbohydratesG;
    private BigDecimal fatG;
    private BigDecimal fiberG;
    private BigDecimal sugarG;
    private BigDecimal saturatedFatG;
    private BigDecimal sodiumMg;
    private BigDecimal cholesterolMg;
}