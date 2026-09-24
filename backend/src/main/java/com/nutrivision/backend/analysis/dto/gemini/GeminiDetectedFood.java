package com.nutrivision.backend.analysis.dto.gemini;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiDetectedFood {

    private String name;
    private Double confidence;
    private Integer estimatedWeightG;
    private BoundingBox boundingBox;
    private NutritionPer100g nutritionPer100g;
}