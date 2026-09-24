package com.nutrivision.backend.analysis.dto.gemini;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiAnalysisResult {

    private List<GeminiDetectedFood> foods;
    private GeminiModelInfo modelInfo;
}