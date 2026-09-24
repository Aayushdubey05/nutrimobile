package com.nutrivision.backend.analysis.dto.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiGenerateContentResponse {

    private List<GeminiCandidate> candidates;
    @JsonProperty("usageMetadata")
    private GeminiUsageMetadata usageMetadata;
}