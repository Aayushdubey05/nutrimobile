package com.nutrivision.backend.user.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.security.CustomUserDetails;
import com.nutrivision.backend.user.dto.UpdateUserSettingsRequest;
import com.nutrivision.backend.user.dto.UserSettingsResponse;
import com.nutrivision.backend.user.service.UserSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/me/settings")
@RequiredArgsConstructor
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserSettingsResponse>> getSettings(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "User settings retrieved successfully",
                        userSettingsService.getSettings(userDetails.getId())
                )
        );
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserSettingsResponse>> updateSettings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateUserSettingsRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "User settings updated successfully",
                        userSettingsService.updateSettings(
                                userDetails.getId(),
                                request
                        )
                )
        );
    }
}