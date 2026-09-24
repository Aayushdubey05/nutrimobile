package com.nutrivision.backend.analysis.dto.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiUsageMetadata {

    @JsonProperty("promptTokenCount")
    private Integer promptTokenCount;

    @JsonProperty("candidatesTokenCount")
    private Integer candidatesTokenCount;

    @JsonProperty("totalTokenCount")
    private Integer totalTokenCount;
}