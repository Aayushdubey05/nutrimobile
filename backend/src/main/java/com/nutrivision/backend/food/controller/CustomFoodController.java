package com.nutrivision.backend.food.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.food.dto.custom.CreateCustomFoodRequest;
import com.nutrivision.backend.food.dto.custom.CustomFoodResponse;
import com.nutrivision.backend.food.dto.custom.UpdateCustomFoodRequest;
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
@RequestMapping("/api/v1/users/me/custom-foods")
public class CustomFoodController {

    private final CustomFoodService customFoodService;

    @PostMapping
    public ResponseEntity<ApiResponse<CustomFoodResponse>> createCustomFood(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateCustomFoodRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Custom food created successfully",
                        customFoodService.createCustomFood(
                                userDetails.getId(),
                                request
                        )
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomFoodResponse>>> getMyCustomFoods(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Custom foods retrieved successfully",
                        customFoodService.getMyCustomFoods(
                                userDetails.getId()
                        )
                )
        );
    }

    @GetMapping("/{customFoodId}")
    public ResponseEntity<ApiResponse<CustomFoodResponse>> getMyCustomFood(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long customFoodId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Custom food retrieved successfully",
                        customFoodService.getMyCustomFood(
                                userDetails.getId(),
                                customFoodId
                        )
                )
        );
    }

    @PutMapping("/{customFoodId}")
    public ResponseEntity<ApiResponse<CustomFoodResponse>> updateCustomFood(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long customFoodId,
            @Valid @RequestBody UpdateCustomFoodRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Custom food updated successfully",
                        customFoodService.updateCustomFood(
                                userDetails.getId(),
                                customFoodId,
                                request
                        )
                )
        );
    }

    @DeleteMapping("/{customFoodId}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomFood(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long customFoodId
    ) {
        customFoodService.deleteCustomFood(
                userDetails.getId(),
                customFoodId
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Custom food deleted successfully",
                        null
                )
        );
    }
}