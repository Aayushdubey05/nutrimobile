package com.nutrivision.backend.user.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.security.CustomUserDetails;
import com.nutrivision.backend.user.dto.UpdateUserRequest;
import com.nutrivision.backend.user.dto.UserResponse;
import com.nutrivision.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "User retrieved successfully",
                        userService.getCurrentUser(userDetails.getId())
                )
        );
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "User updated successfully",
                        userService.updateCurrentUser(
                                userDetails.getId(),
                                request
                        )
                )
        );
    }
}