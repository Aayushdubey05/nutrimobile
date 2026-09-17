package com.nutrivision.backend.meal.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.meal.dto.request.CreateMealRequest;
import com.nutrivision.backend.meal.dto.request.UpdateMealRequest;
import com.nutrivision.backend.meal.dto.response.MealResponse;
import com.nutrivision.backend.meal.service.MealService;
import com.nutrivision.backend.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;

    @PostMapping
    public ResponseEntity<ApiResponse<MealResponse>> createMeal(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateMealRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Meal created successfully",
                        mealService.createMeal(
                                userDetails.getId(),
                                request
                        )
                )
        );
    }

    @GetMapping("/{mealId}")
    public ResponseEntity<ApiResponse<MealResponse>> getMeal(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long mealId
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Meal retrieved successfully",
                        mealService.getMeal(
                                userDetails.getId(),
                                mealId
                        )
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MealResponse>>> getMeals(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Meals retrieved successfully",
                        mealService.getMeals(
                                userDetails.getId()
                        )
                )
        );
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<MealResponse>>> getMealsByDate(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Meals retrieved successfully",
                        mealService.getMealsByDate(
                                userDetails.getId(),
                                date
                        )
                )
        );
    }

    @PutMapping("/{mealId}")
    public ResponseEntity<ApiResponse<MealResponse>> updateMeal(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long mealId,
            @Valid @RequestBody UpdateMealRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Meal updated successfully",
                        mealService.updateMeal(
                                userDetails.getId(),
                                mealId,
                                request
                        )
                )
        );
    }

    @DeleteMapping("/{mealId}")
    public ResponseEntity<ApiResponse<Void>> deleteMeal(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long mealId
    ) {

        mealService.deleteMeal(
                userDetails.getId(),
                mealId
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Meal deleted successfully",
                        null
                )
        );
    }
}