package com.nutrivision.backend.nutrition.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.nutrition.dto.request.CustomizeNutritionTargetRequest;
import com.nutrivision.backend.nutrition.dto.response.DailyNutritionResponse;
import com.nutrivision.backend.nutrition.dto.response.NutritionTargetResponse;
import com.nutrivision.backend.nutrition.service.NutritionService;
import com.nutrivision.backend.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/nutrition")
@RequiredArgsConstructor
public class NutritionController {

    private final NutritionService nutritionService;

    @GetMapping("/target")
    public ResponseEntity<ApiResponse<NutritionTargetResponse>> getCurrentTarget(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Nutrition target retrieved successfully",
                        nutritionService.getCurrentTarget(
                                userDetails.getId()
                        )
                )
        );
    }

    @PostMapping("/target/calculate")
    public ResponseEntity<ApiResponse<NutritionTargetResponse>> calculateTarget(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Nutrition target calculated successfully",
                        nutritionService.calculateAndCreateTarget(
                                userDetails.getId()
                        )
                )
        );
    }

    @PutMapping("/target")
    public ResponseEntity<ApiResponse<NutritionTargetResponse>> customizeTarget(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CustomizeNutritionTargetRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Nutrition target customized successfully",
                        nutritionService.customizeTarget(
                                userDetails.getId(),
                                request
                        )
                )
        );
    }

    @GetMapping("/daily/{date}")
    public ResponseEntity<ApiResponse<DailyNutritionResponse>> getDailyNutrition(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Daily nutrition retrieved successfully",
                        nutritionService.getDailyNutrition(
                                userDetails.getId(),
                                date
                        )
                )
        );
    }
}