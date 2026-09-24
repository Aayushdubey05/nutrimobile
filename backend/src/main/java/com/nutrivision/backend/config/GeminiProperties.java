package com.nutrivision.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "gemini")
@Data
public class GeminiProperties {

    private String apiKey;
    private String model = "gemini-3.8-flash";
    private Double temperature = 0.1;
    private Integer maxTokens = 8192;
    private Integer timeoutSeconds = 60;
    private String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models";
}