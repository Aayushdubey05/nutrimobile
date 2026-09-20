package com.nutrivision.backend.progress.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.progress.ProgressPeriod;
import com.nutrivision.backend.progress.dto.response.ProgressResponse;
import com.nutrivision.backend.progress.service.ProgressService;
import com.nutrivision.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @GetMapping
    public ResponseEntity<ApiResponse<ProgressResponse>> getProgress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(
                    defaultValue = "WEEK"
            ) ProgressPeriod period
    ) {

        ProgressResponse response =
                progressService.getProgress(
                        userDetails.getId(),
                        period
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Progress retrieved successfully",
                        response
                )
        );
    }
}