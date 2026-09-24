package com.nutrivision.backend.analysis.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nutrivision.backend.analysis.dto.gemini.BoundingBox;
import com.nutrivision.backend.analysis.dto.gemini.GeminiAnalysisResult;
import com.nutrivision.backend.analysis.dto.gemini.GeminiCandidate;
import com.nutrivision.backend.analysis.dto.gemini.GeminiPart;
import com.nutrivision.backend.analysis.dto.gemini.GeminiDetectedFood;
import com.nutrivision.backend.analysis.dto.gemini.GeminiGenerateContentRequest;
import com.nutrivision.backend.analysis.dto.gemini.GeminiGenerateContentResponse;
import com.nutrivision.backend.analysis.dto.gemini.GeminiModelInfo;
import com.nutrivision.backend.analysis.dto.gemini.NutritionPer100g;
import com.nutrivision.backend.config.GeminiProperties;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GeminiService {

    private final RestClient restClient;
    private final GeminiProperties props;
    private final GeminiPromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Autowired
    public GeminiService(RestClient restClient, GeminiProperties props, GeminiPromptBuilder promptBuilder, ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.props = props;
        this.promptBuilder = promptBuilder;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(props.getTimeoutSeconds()))
                .build();
    }

    public GeminiAnalysisResult analyzeFoodImage(String imageUrl) {
        byte[] imageBytes = downloadImage(imageUrl);
        return analyzeFoodImageBytes(imageBytes, detectMimeType(imageBytes, imageUrl));
    }

    /**
     * Analyzes image bytes directly, for photos uploaded from the device that the
     * server cannot fetch by URL.
     */
    public GeminiAnalysisResult analyzeFoodImageBytes(byte[] imageBytes, String mimeType) {
        long start = System.currentTimeMillis();

        try {
            // 1. Convert to base64
            if (mimeType == null || mimeType.isBlank()) {
                mimeType = detectMimeType(imageBytes, "");
            }
            String base64 = Base64.encodeBase64String(imageBytes);

            // 2. Build request
            GeminiGenerateContentRequest request = promptBuilder.buildRequest(base64, mimeType);

            // 3. Call Gemini API
            String endpoint = "/" + props.getModel() + ":generateContent";
            GeminiGenerateContentResponse response = restClient.post()
                    .uri(endpoint)
                    .body(request)
                    .retrieve()
                    .body(GeminiGenerateContentResponse.class);

            // 4. Extract JSON from response
            String jsonText = extractJsonFromResponse(response);
            GeminiAnalysisResult result = parseJson(jsonText);

            // 5. Add processing time
            long processingTimeMs = System.currentTimeMillis() - start;
            return new GeminiAnalysisResult(
                    result.getFoods(),
                    new GeminiModelInfo(props.getModel(), processingTimeMs)
            );

        } catch (Exception e) {
            throw new AnalysisException("Gemini analysis failed: " + e.getMessage(), e);
        }
    }

    private byte[] downloadImage(String imageUrl) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(imageUrl))
                    .timeout(Duration.ofSeconds(props.getTimeoutSeconds()))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() != 200) {
                throw new AnalysisException("Failed to download image: HTTP " + response.statusCode());
            }

            // Limit image size to 10MB
            if (response.body().length > 10 * 1024 * 1024) {
                throw new AnalysisException("Image too large: " + response.body().length + " bytes (max 10MB)");
            }

            return response.body();
        } catch (IOException | InterruptedException e) {
            throw new AnalysisException("Failed to download image from " + imageUrl, e);
        }
    }

    private String detectMimeType(byte[] bytes, String url) {
        if (bytes.length >= 4) {
            // Check magic bytes
            if (bytes[0] == (byte) 0xFF && bytes[1] == (byte) 0xD8) return "image/jpeg";
            if (bytes[0] == (byte) 0x89 && bytes[1] == (byte) 0x50 && bytes[2] == (byte) 0x4E && bytes[3] == (byte) 0x47) return "image/png";
            if (bytes[0] == (byte) 0x52 && bytes[1] == (byte) 0x49 && bytes[2] == (byte) 0x46 && bytes[3] == (byte) 0x46) return "image/webp";
            if (bytes[0] == (byte) 0x48 && bytes[1] == (byte) 0x45 && bytes[2] == (byte) 0x49 && bytes[3] == (byte) 0x43) return "image/heic";
        }
        // Fallback to URL extension
        if (url.toLowerCase().contains(".png")) return "image/png";
        if (url.toLowerCase().contains(".webp")) return "image/webp";
        if (url.toLowerCase().contains(".heic") || url.toLowerCase().contains(".heif")) return "image/heic";
        return "image/jpeg";
    }

    private String extractJsonFromResponse(GeminiGenerateContentResponse response) {
        if (response == null || response.getCandidates() == null || response.getCandidates().isEmpty()) {
            throw new AnalysisException("Empty response from Gemini");
        }

        GeminiCandidate candidate = response.getCandidates().get(0);
        if (candidate.getContent() == null || candidate.getContent().getParts() == null || candidate.getContent().getParts().isEmpty()) {
            throw new AnalysisException(
                    "No content in Gemini response (finishReason=" + candidate.getFinishReason() + ")");
        }

        // Thinking models can emit reasoning parts before the answer, so take the
        // first part that actually carries text rather than assuming index 0.
        String text = candidate.getContent().getParts().stream()
                .map(GeminiPart::getText)
                .filter(part -> part != null && !part.trim().isEmpty())
                .findFirst()
                .orElse(null);

        if (text == null) {
            throw new AnalysisException(
                    "Empty text in Gemini response (finishReason=" + candidate.getFinishReason() + ")");
        }

        // Strip markdown code fences if present
        return stripMarkdownFences(text);
    }

    private String stripMarkdownFences(String text) {
        // Remove ```json ... ``` or ``` ... ```
        Pattern pattern = Pattern.compile("^```(?:json)?\\s*([\\s\\S]*?)\\s*```$", Pattern.MULTILINE);
        Matcher matcher = pattern.matcher(text.trim());
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return text.trim();
    }

    private GeminiAnalysisResult parseJson(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode foodsNode = root.get("foods");
            if (foodsNode == null || !foodsNode.isArray()) {
                return new GeminiAnalysisResult(List.of(), null);
            }

            List<GeminiDetectedFood> foods = objectMapper.convertValue(foodsNode, objectMapper.getTypeFactory().constructCollectionType(List.class, GeminiDetectedFood.class));

            // Filter out low confidence detections
            foods = foods.stream()
                    .filter(f -> f.getConfidence() != null && f.getConfidence() >= 0.5)
                    .filter(f -> f.getEstimatedWeightG() != null && f.getEstimatedWeightG() > 0)
                    .toList();

            JsonNode modelInfoNode = root.get("model_info");
            GeminiModelInfo modelInfo = null;
            if (modelInfoNode != null) {
                modelInfo = objectMapper.convertValue(modelInfoNode, GeminiModelInfo.class);
            }

            return new GeminiAnalysisResult(foods, modelInfo);

        } catch (JsonProcessingException e) {
            throw new AnalysisException("Failed to parse Gemini JSON response: " + e.getMessage(), e);
        }
    }
}