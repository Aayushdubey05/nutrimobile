package com.nutrivision.backend.analysis.dto.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiInlineData {

    private String mimeType;
    @JsonProperty("data")
    private String base64Data;
}