package com.nutrivision.backend.food.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.food.dto.food.FoodResponse;
import com.nutrivision.backend.food.service.FoodService;
import com.nutrivision.backend.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/foods")
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodResponse>>> getAllFoods() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Foods retrieved successfully",
                        foodService.getAllFoods()
                )
        );
    }

    @GetMapping("/{foodId}")
    public ResponseEntity<ApiResponse<FoodResponse>> getFood(@PathVariable Long foodId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Food retrieved successfully",
                        foodService.getFood(foodId)
                )
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<FoodResponse>>> searchFoods(@RequestParam String name) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Foods searched successfully",
                        foodService.searchFoods(name)
                )
        );
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<FoodResponse>>> getFoodsByCategory(
            @PathVariable Long categoryId
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Foods retrieved successfully",
                        foodService.getFoodsByCategory(categoryId)
                )
        );
    }

    @PostMapping("/{foodId}/search")
    public ResponseEntity<ApiResponse<Void>> recordSearch(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long foodId
    ) {

        foodService.recordSearch(
                userDetails.getId(),
                foodId
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Food search recorded successfully",
                        null
                )
        );
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<FoodResponse>>> getRecentFoods(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recent foods retrieved successfully",
                        foodService.getRecentFoods(
                                userDetails.getId()
                        )
                )
        );
    }
}
