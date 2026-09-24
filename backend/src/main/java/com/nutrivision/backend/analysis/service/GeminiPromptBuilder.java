package com.nutrivision.backend.analysis.service;

import com.nutrivision.backend.analysis.dto.gemini.GeminiGenerateContentRequest;
import com.nutrivision.backend.analysis.dto.gemini.GeminiPart;
import com.nutrivision.backend.analysis.dto.gemini.GeminiContent;
import com.nutrivision.backend.analysis.dto.gemini.GeminiInlineData;
import com.nutrivision.backend.analysis.dto.gemini.GeminiGenerationConfig;
import com.nutrivision.backend.analysis.dto.gemini.GeminiSafetySetting;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GeminiPromptBuilder {

    private static final String SYSTEM_PROMPT = """
        You are a world-class food detection and nutrition estimation AI.
        Analyze the provided food image and return ONLY valid JSON matching the schema below.
        Do not include any explanatory text, markdown, or code fences.

        JSON Schema:
        {
          "foods": [
            {
              "name": "string",
              "confidence": "number",
              "estimated_weight_g": "integer",
              "bounding_box": [x, y, w, h],
              "nutrition_per_100g": {
                "calories_kcal": "number",
                "protein_g": "number",
                "carbohydrates_g": "number",
                "fat_g": "number",
                "fiber_g": "number",
                "sugar_g": "number",
                "saturated_fat_g": "number",
                "sodium_mg": "number",
                "cholesterol_mg": "number"
              }
            }
          ],
          "model_info": {
            "model": "string",
            "processing_time_ms": "integer"
          }
        }

        Rules:
        - Detect ALL distinct food items visible
        - Estimate weight per item using visual cues (plate size, utensils, hand reference if present)
        - Use standard USDA nutrition values per 100g
        - Confidence < 0.5 -> omit the item
        - Return empty "foods" array if no food detected
        - bounding_box: [left, top, width, height] in pixels relative to image dimensions
        - All numeric values must be numbers, not strings
        """;

    public GeminiGenerateContentRequest buildRequest(String imageBase64, String mimeType) {
        return new GeminiGenerateContentRequest(
                List.of(
                        new GeminiContent("user", List.of(
                                new GeminiPart(SYSTEM_PROMPT),
                                new GeminiPart(new GeminiInlineData(mimeType, imageBase64))
                        ))
                ),
                new GeminiGenerationConfig(0.1, 8192),
                List.of()
        );
    }
}