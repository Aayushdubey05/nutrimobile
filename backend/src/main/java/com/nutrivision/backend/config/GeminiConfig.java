package com.nutrivision.backend.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.util.concurrent.TimeUnit;

@Configuration
public class GeminiConfig {

    @Bean
    public RestClient geminiRestClient(GeminiProperties props) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout((int) TimeUnit.SECONDS.toMillis(props.getTimeoutSeconds()));
        requestFactory.setReadTimeout((int) TimeUnit.SECONDS.toMillis(props.getTimeoutSeconds()));

        return RestClient.builder()
                .baseUrl(props.getApiUrl())
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("x-goog-api-key", props.getApiKey())
                .requestFactory(requestFactory)
                .build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }
}