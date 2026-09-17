package com.nutrivision.backend.analysis.controller;

import com.nutrivision.backend.analysis.dto.request.CreateAnalysisRequest;
import com.nutrivision.backend.analysis.dto.request.UpdateAnalysisItemRequest;
import com.nutrivision.backend.analysis.dto.response.FoodAnalysisResponse;
import com.nutrivision.backend.analysis.service.FoodAnalysisService;
import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analysis")
@RequiredArgsConstructor
public class FoodAnalysisController {

    private final FoodAnalysisService foodAnalysisService;

    @PostMapping
    public ResponseEntity<ApiResponse<FoodAnalysisResponse>> createAnalysis(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateAnalysisRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Food analysis completed successfully",
                        foodAnalysisService.createAnalysis(
                                userDetails.getId(),
                                request
                        )
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodAnalysisResponse>>> getAnalyses(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Food analyses retrieved successfully",
                        foodAnalysisService.getAnalyses(
                                userDetails.getId()
                        )
                )
        );
    }

    @GetMapping("/{analysisId}")
    public ResponseEntity<ApiResponse<FoodAnalysisResponse>> getAnalysis(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long analysisId
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Food analysis retrieved successfully",
                        foodAnalysisService.getAnalysis(
                                userDetails.getId(),
                                analysisId
                        )
                )
        );
    }

    @PutMapping("/{analysisId}/items/{itemId}")
    public ResponseEntity<ApiResponse<FoodAnalysisResponse>> updateAnalysisItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long analysisId,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateAnalysisItemRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Analysis item updated successfully",
                        foodAnalysisService.updateAnalysisItem(
                                userDetails.getId(),
                                analysisId,
                                itemId,
                                request
                        )
                )
        );
    }
}