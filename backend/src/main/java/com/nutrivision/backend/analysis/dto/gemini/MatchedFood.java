package com.nutrivision.backend.analysis.dto.gemini;

import com.nutrivision.backend.food.entity.Food;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchedFood {

    private Food food;
    private GeminiDetectedFood detected;
    private boolean isNew;
}