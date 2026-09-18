package com.nutrivision.backend.user.controller;

import com.nutrivision.backend.common.response.ApiResponse;
import com.nutrivision.backend.user.dto.HealthConditionResponse;
import com.nutrivision.backend.user.repository.HealthConditionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/health-conditions")
@RequiredArgsConstructor
public class HealthConditionController {

    private final HealthConditionRepository healthConditionRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<HealthConditionResponse>>> getAll() {

        List<HealthConditionResponse> conditions =
                healthConditionRepository.findAll()
                        .stream()
                        .map(condition ->
                                new HealthConditionResponse(
                                        condition.getId(),
                                        condition.getName()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Health conditions retrieved successfully",
                        conditions
                )
        );
    }
}