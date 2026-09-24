package com.nutrivision.backend.analysis.controller;

import com.nutrivision.backend.analysis.dto.request.CreateAnalysisRequest;
import com.nutrivision.backend.analysis.dto.request.UpdateAnalysisItemRequest;
import com.nutrivision.backend.analysis.dto.response.FoodAnalysisResponse;
import com.nutrivision.backend.analysis.service.FoodAnalysisService;
import com.nutrivision.backend.analysis.service.ImageStorageService;
import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/v1/analysis")
@RequiredArgsConstructor
public class FoodAnalysisController {

    private final FoodAnalysisService foodAnalysisService;
    private final ImageStorageService imageStorageService;

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

    /**
     * Analyzes a photo captured or picked on the device, sent as multipart form-data
     * under the {@code image} part.
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<FoodAnalysisResponse>> createAnalysisFromUpload(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart("image") MultipartFile image
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Food analysis completed successfully",
                        foodAnalysisService.createAnalysisFromUpload(
                                userDetails.getId(),
                                image
                        )
                )
        );
    }

    /**
     * Serves a stored analysis photo. Names are server-generated UUIDs and validated
     * by {@link ImageStorageService} before resolution.
     */
    @GetMapping("/images/{fileName}")
    public ResponseEntity<Resource> getAnalysisImage(@PathVariable String fileName) {

        Path path = imageStorageService.resolveStored(fileName);

        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(imageStorageService.contentTypeOf(fileName)))
                .body(new FileSystemResource(path));
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