package com.nutrivision.backend.user.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.security.CustomUserDetails;
import com.nutrivision.backend.user.dto.AddWeightHistoryRequest;
import com.nutrivision.backend.user.dto.WeightHistoryResponse;
import com.nutrivision.backend.user.service.WeightHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/me/weight-history")
@RequiredArgsConstructor
public class WeightHistoryController {

    private final WeightHistoryService weightHistoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WeightHistoryResponse>>> getWeightHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Weight history retrieved successfully",
                        weightHistoryService.getWeightHistory(
                                userDetails.getId()
                        )
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WeightHistoryResponse>> addWeight(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody AddWeightHistoryRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Weight record added successfully",
                                weightHistoryService.addWeight(
                                        userDetails.getId(),
                                        request
                                )
                        )
                );
    }
}