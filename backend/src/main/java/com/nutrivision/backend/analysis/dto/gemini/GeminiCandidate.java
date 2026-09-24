package com.nutrivision.backend.analysis.dto.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiCandidate {

    private GeminiContent content;
    private String finishReason;
    @JsonProperty("index")
    private Integer index;
    @JsonProperty("safetyRatings")
    private List<GeminiSafetyRating> safetyRatings;
}