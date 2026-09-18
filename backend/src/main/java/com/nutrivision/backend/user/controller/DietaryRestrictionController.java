package com.nutrivision.backend.user.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.user.dto.DietaryRestrictionResponse;
import com.nutrivision.backend.user.repository.DietaryRestrictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dietary-restrictions")
@RequiredArgsConstructor
public class DietaryRestrictionController {

    private final DietaryRestrictionRepository dietaryRestrictionRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DietaryRestrictionResponse>>> getAll() {

        List<DietaryRestrictionResponse> restrictions =
                dietaryRestrictionRepository.findAll()
                        .stream()
                        .map(restriction ->
                                new DietaryRestrictionResponse(
                                        restriction.getId(),
                                        restriction.getName()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Dietary restrictions retrieved successfully",
                        restrictions
                )
        );
    }
}