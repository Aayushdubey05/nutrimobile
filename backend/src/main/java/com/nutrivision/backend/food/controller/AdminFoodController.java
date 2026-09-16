package com.nutrivision.backend.food.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.food.dto.food.CreateFoodRequest;
import com.nutrivision.backend.food.dto.food.FoodResponse;
import com.nutrivision.backend.food.dto.food.UpdateFoodRequest;
import com.nutrivision.backend.food.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/foods")
public class AdminFoodController {

    private final FoodService foodService;

    @PostMapping
    public ResponseEntity<ApiResponse<FoodResponse>> createFood(
            @Valid @RequestBody CreateFoodRequest request
    ) {

        return ResponseEntity.ok(ApiResponse.success(
                        "Food created successfully",
                        foodService.createFood(request)
                )
        );
    }

    @PutMapping("/{foodId}")
    public ResponseEntity<ApiResponse<FoodResponse>> updateFood(
            @PathVariable Long foodId,
            @Valid @RequestBody UpdateFoodRequest request
    ) {

        return ResponseEntity.ok(ApiResponse.success(
                        "Food updated successfully",
                        foodService.updateFood(
                                foodId,
                                request
                        )
                )
        );
    }

    @DeleteMapping("/{foodId}")
    public ResponseEntity<ApiResponse<Void>> deleteFood(@PathVariable Long foodId) {

        foodService.deleteFood(foodId);

        return ResponseEntity.ok(ApiResponse.success(
                        "Food deleted successfully",
                        null
                )
        );
    }
}