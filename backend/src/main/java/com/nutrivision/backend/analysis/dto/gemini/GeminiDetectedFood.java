package com.nutrivision.backend.analysis.dto.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiDetectedFood {

    private String name;
    private Double confidence;

    // Gemini returns snake_case keys; the shared ObjectMapper uses the default
    // (camelCase) naming strategy, so these have to be mapped explicitly.
    @JsonProperty("estimated_weight_g")
    private Integer estimatedWeightG;

    @JsonProperty("bounding_box")
    private BoundingBox boundingBox;

    @JsonProperty("nutrition_per_100g")
    private NutritionPer100g nutritionPer100g;
}
