package com.nutrivision.backend.food.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.food.dto.custom.CustomFoodResponse;
import com.nutrivision.backend.food.dto.custom.CustomFoodReviewResponse;
import com.nutrivision.backend.food.dto.custom.ReviewCustomFoodRequest;
import com.nutrivision.backend.food.entity.CustomFoodStatus;
import com.nutrivision.backend.food.service.CustomFoodService;
import com.nutrivision.backend.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/custom-foods")
public class AdminCustomFoodController {

    private final CustomFoodService customFoodService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomFoodResponse>>> getCustomFoods(
            @RequestParam CustomFoodStatus status
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Custom foods retrieved successfully",
                        customFoodService.getCustomFoodsByStatus(status)
                )
        );
    }

    @GetMapping("/{customFoodId}")
    public ResponseEntity<ApiResponse<CustomFoodResponse>> getCustomFood(
            @PathVariable Long customFoodId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Custom food retrieved successfully",
                        customFoodService.getAdminCustomFood(customFoodId)
                )
        );
    }

    @PostMapping("/{customFoodId}/review")
    public ResponseEntity<ApiResponse<CustomFoodReviewResponse>> reviewCustomFood(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long customFoodId,
            @Valid @RequestBody ReviewCustomFoodRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Custom food reviewed successfully",
                        customFoodService.reviewCustomFood(
                                userDetails.getId(),
                                customFoodId,
                                request
                        )
                )
        );
    }

    @GetMapping("/{customFoodId}/reviews")
    public ResponseEntity<ApiResponse<List<CustomFoodReviewResponse>>> getReviews(
            @PathVariable Long customFoodId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Custom food reviews retrieved successfully",
                        customFoodService.getReviews(customFoodId)
                )
        );
    }
}