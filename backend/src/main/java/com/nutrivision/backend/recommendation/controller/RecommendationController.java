package com.nutrivision.backend.recommendation.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.recommendation.dto.request.RecommendationFeedbackRequest;
import com.nutrivision.backend.recommendation.dto.response.RecommendationFeedbackResponse;
import com.nutrivision.backend.recommendation.dto.response.RecommendationResponse;
import com.nutrivision.backend.recommendation.service.RecommendationService;
import com.nutrivision.backend.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>>
    generateRecommendations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recommendations generated successfully",
                        recommendationService.generateRecommendations(
                                userDetails.getId()
                        )
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>>
    getRecommendations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recommendations retrieved successfully",
                        recommendationService.getRecommendations(
                                userDetails.getId()
                        )
                )
        );
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<RecommendationResponse>>>
    getActiveRecommendations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Active recommendations retrieved successfully",
                        recommendationService.getActiveRecommendations(
                                userDetails.getId()
                        )
                )
        );
    }

    @PostMapping("/{recommendationId}/feedback")
    public ResponseEntity<ApiResponse<RecommendationFeedbackResponse>>
    addFeedback(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recommendationId,
            @Valid @RequestBody RecommendationFeedbackRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recommendation feedback saved successfully",
                        recommendationService.addFeedback(
                                userDetails.getId(),
                                recommendationId,
                                request
                        )
                )
        );
    }
}