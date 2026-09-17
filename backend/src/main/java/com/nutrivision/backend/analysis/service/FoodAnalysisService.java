package com.nutrivision.backend.analysis.service;

import com.nutrivision.backend.analysis.dto.request.CreateAnalysisRequest;
import com.nutrivision.backend.analysis.dto.request.UpdateAnalysisItemRequest;
import com.nutrivision.backend.analysis.dto.response.AiModelResultResponse;
import com.nutrivision.backend.analysis.dto.response.ExplainabilityResultResponse;
import com.nutrivision.backend.analysis.dto.response.FoodAnalysisItemResponse;
import com.nutrivision.backend.analysis.dto.response.FoodAnalysisResponse;
import com.nutrivision.backend.analysis.entity.AiModelResult;
import com.nutrivision.backend.analysis.entity.AnalysisStatus;
import com.nutrivision.backend.analysis.entity.ExplainabilityResult;
import com.nutrivision.backend.analysis.entity.FoodAnalysis;
import com.nutrivision.backend.analysis.entity.FoodAnalysisItem;
import com.nutrivision.backend.analysis.repository.AiModelResultRepository;
import com.nutrivision.backend.analysis.repository.ExplainabilityResultRepository;
import com.nutrivision.backend.analysis.repository.FoodAnalysisItemRepository;
import com.nutrivision.backend.analysis.repository.FoodAnalysisRepository;
import com.nutrivision.backend.food.entity.Food;
import com.nutrivision.backend.food.repository.FoodRepository;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FoodAnalysisService {

    private final UserRepository userRepository;
    private final FoodRepository foodRepository;

    private final FoodAnalysisRepository foodAnalysisRepository;
    private final FoodAnalysisItemRepository foodAnalysisItemRepository;
    private final AiModelResultRepository aiModelResultRepository;
    private final ExplainabilityResultRepository explainabilityResultRepository;

    @Transactional
    public FoodAnalysisResponse createAnalysis(
            Long userId,
            CreateAnalysisRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        /*
         * Dummy AI implementation.
         *
         * Later this part will be replaced by the actual ML service.
         */
        Food dummyFood = foodRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No food available for dummy analysis"
                        )
                );

        OffsetDateTime now = OffsetDateTime.now();

        FoodAnalysis analysis = new FoodAnalysis();

        analysis.setUser(user);
        analysis.setImageUrl(request.imageUrl());
        analysis.setStatus(AnalysisStatus.PROCESSING);
        analysis.setCreatedAt(now);

        FoodAnalysis savedAnalysis = foodAnalysisRepository.save(analysis);

        /*
         * Dummy detected food.
         */
        FoodAnalysisItem item = new FoodAnalysisItem();

        item.setAnalysis(savedAnalysis);
        item.setFood(dummyFood);
        item.setDetectedName(dummyFood.getName());
        item.setConfidence(new BigDecimal("0.92"));
        item.setEstimatedWeightG(new BigDecimal("150.00"));
        item.setFinalWeightG(new BigDecimal("150.00"));
        item.setFinalFood(dummyFood);
        item.setCreatedAt(now);

        FoodAnalysisItem savedItem =
                foodAnalysisItemRepository.save(item);

        /*
         * Dummy AI model information.
         */
        AiModelResult modelResult = new AiModelResult();

        modelResult.setAnalysisItem(savedItem);
        modelResult.setModelName("DummyFoodDetector");
        modelResult.setModelVersion("1.0");
        modelResult.setConfidence(new BigDecimal("0.92"));
        modelResult.setProcessingTimeMs(120);
        modelResult.setCreatedAt(now);

        aiModelResultRepository.save(modelResult);

        /*
         * Dummy explainability result.
         */
        ExplainabilityResult explainability = new ExplainabilityResult();

        explainability.setAnalysisItem(savedItem);
        explainability.setHeatmapUrl(null);
        explainability.setCaption(
                "The model detected " +
                        dummyFood.getName() +
                        " in the uploaded food image."
        );
        explainability.setCreatedAt(now);

        explainabilityResultRepository.save(explainability);

        /*
         * Mark analysis as completed.
         */
        savedAnalysis.setStatus(AnalysisStatus.COMPLETED);
        savedAnalysis.setCompletedAt(OffsetDateTime.now());

        FoodAnalysis completedAnalysis =
                foodAnalysisRepository.save(savedAnalysis);

        return toResponse(completedAnalysis);
    }

    public FoodAnalysisResponse getAnalysis(
            Long userId,
            Long analysisId
    ) {

        FoodAnalysis analysis = findUserAnalysis(
                userId,
                analysisId
        );

        return toResponse(analysis);
    }

    public List<FoodAnalysisResponse> getAnalyses(Long userId) {

        return foodAnalysisRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public FoodAnalysisResponse updateAnalysisItem(
            Long userId,
            Long analysisId,
            Long itemId,
            UpdateAnalysisItemRequest request
    ) {

        FoodAnalysis analysis = findUserAnalysis(
                userId,
                analysisId
        );

        FoodAnalysisItem item =
                foodAnalysisItemRepository.findById(itemId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Analysis item not found"
                                )
                        );

        if (!item.getAnalysis().getId().equals(analysis.getId())) {
            throw new IllegalArgumentException(
                    "Analysis item does not belong to this analysis"
            );
        }

        Food finalFood = foodRepository.findById(
                        request.finalFoodId()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Final food not found"
                        )
                );

        item.setFinalFood(finalFood);
        item.setFinalWeightG(request.finalWeightG());

        foodAnalysisItemRepository.save(item);

        return toResponse(analysis);
    }

    private FoodAnalysis findUserAnalysis(
            Long userId,
            Long analysisId
    ) {

        FoodAnalysis analysis = foodAnalysisRepository
                .findById(analysisId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Analysis not found"
                        )
                );

        if (!analysis.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Analysis does not belong to this user"
            );
        }

        return analysis;
    }

    private FoodAnalysisResponse toResponse(
            FoodAnalysis analysis
    ) {

        List<FoodAnalysisItemResponse> items =
                foodAnalysisItemRepository
                        .findByAnalysisId(analysis.getId())
                        .stream()
                        .map(this::toItemResponse)
                        .toList();

        return new FoodAnalysisResponse(
                analysis.getId(),
                analysis.getImageUrl(),
                analysis.getStatus(),
                analysis.getCreatedAt(),
                analysis.getCompletedAt(),
                items
        );
    }

    private FoodAnalysisItemResponse toItemResponse(
            FoodAnalysisItem item
    ) {

        List<AiModelResultResponse> aiResults =
                aiModelResultRepository
                        .findByAnalysisItemId(item.getId())
                        .stream()
                        .map(this::toAiModelResultResponse)
                        .toList();

        ExplainabilityResultResponse explainability =
                explainabilityResultRepository
                        .findByAnalysisItemId(item.getId())
                        .map(this::toExplainabilityResponse)
                        .orElse(null);

        return new FoodAnalysisItemResponse(
                item.getId(),
                item.getFood().getId(),
                item.getDetectedName(),
                item.getConfidence(),
                item.getEstimatedWeightG(),
                item.getFinalWeightG(),
                item.getFinalFood() != null
                        ? item.getFinalFood().getId()
                        : null,
                item.getFinalFood() != null
                        ? item.getFinalFood().getName()
                        : null,
                aiResults,
                explainability
        );
    }

    private AiModelResultResponse toAiModelResultResponse(
            AiModelResult result
    ) {

        return new AiModelResultResponse(
                result.getId(),
                result.getModelName(),
                result.getModelVersion(),
                result.getConfidence(),
                result.getProcessingTimeMs()
        );
    }

    private ExplainabilityResultResponse toExplainabilityResponse(
            ExplainabilityResult result
    ) {

        return new ExplainabilityResultResponse(
                result.getId(),
                result.getHeatmapUrl(),
                result.getCaption()
        );
    }
}