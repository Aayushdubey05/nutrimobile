package com.nutrivision.backend.analysis.dto.gemini;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiModelInfo {

    private String model;
    private Long processingTimeMs;
}