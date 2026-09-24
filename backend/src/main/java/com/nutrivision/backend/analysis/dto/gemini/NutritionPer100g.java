package com.nutrivision.backend.analysis.dto.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutritionPer100g {

    @JsonProperty("calories_kcal")
    private BigDecimal caloriesKcal;

    @JsonProperty("protein_g")
    private BigDecimal proteinG;

    @JsonProperty("carbohydrates_g")
    private BigDecimal carbohydratesG;

    @JsonProperty("fat_g")
    private BigDecimal fatG;

    @JsonProperty("fiber_g")
    private BigDecimal fiberG;

    @JsonProperty("sugar_g")
    private BigDecimal sugarG;

    @JsonProperty("saturated_fat_g")
    private BigDecimal saturatedFatG;

    @JsonProperty("sodium_mg")
    private BigDecimal sodiumMg;

    @JsonProperty("cholesterol_mg")
    private BigDecimal cholesterolMg;
}
