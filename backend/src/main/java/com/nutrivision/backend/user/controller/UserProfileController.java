package com.nutrivision.backend.user.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.security.CustomUserDetails;
import com.nutrivision.backend.user.dto.UpdateUserProfileRequest;
import com.nutrivision.backend.user.dto.UserProfileResponse;
import com.nutrivision.backend.user.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/me/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "User profile retrieved successfully",
                        userProfileService.getProfile(userDetails.getId())
                )
        );
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "User profile updated successfully",
                        userProfileService.updateProfile(
                                userDetails.getId(),
                                request
                        )
                )
        );
    }
}