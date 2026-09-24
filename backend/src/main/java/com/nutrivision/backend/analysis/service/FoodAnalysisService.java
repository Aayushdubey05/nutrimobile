package com.nutrivision.backend.analysis.service;

import com.nutrivision.backend.analysis.dto.request.CreateAnalysisRequest;
import com.nutrivision.backend.analysis.dto.request.UpdateAnalysisItemRequest;
import com.nutrivision.backend.analysis.dto.response.ExplainabilityResultResponse;
import com.nutrivision.backend.analysis.dto.response.FoodAnalysisItemResponse;
import com.nutrivision.backend.analysis.dto.response.FoodAnalysisResponse;
import com.nutrivision.backend.analysis.dto.gemini.BoundingBox;
import com.nutrivision.backend.analysis.dto.gemini.GeminiAnalysisResult;
import com.nutrivision.backend.analysis.dto.gemini.GeminiDetectedFood;
import com.nutrivision.backend.analysis.dto.gemini.GeminiModelInfo;
import com.nutrivision.backend.analysis.dto.gemini.MatchedFood;
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

    private final GeminiService geminiService;
    private final FoodMatcher foodMatcher;

    @Transactional
    public FoodAnalysisResponse createAnalysis(
            Long userId,
            CreateAnalysisRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        OffsetDateTime now = OffsetDateTime.now();

        // 1. Create parent analysis record (status = PROCESSING)
        FoodAnalysis analysis = new FoodAnalysis();
        analysis.setUser(user);
        analysis.setImageUrl(request.imageUrl());
        analysis.setStatus(AnalysisStatus.PROCESSING);
        analysis.setCreatedAt(now);
        FoodAnalysis savedAnalysis = foodAnalysisRepository.save(analysis);

        try {
            // 2. Call Gemini
            GeminiAnalysisResult geminiResult = geminiService.analyzeFoodImage(request.imageUrl());

            // 3. Match/Create foods
            List<MatchedFood> matchedFoods = foodMatcher.matchOrCreateFoods(geminiResult.getFoods());

            // 4. Persist each detected food item
            for (MatchedFood mf : matchedFoods) {
                GeminiDetectedFood gf = mf.getDetected();

                FoodAnalysisItem item = new FoodAnalysisItem();
                item.setAnalysis(savedAnalysis);
                item.setFood(mf.getFood());                    // Matched or new Food entity
                item.setDetectedName(gf.getName());
                item.setConfidence(BigDecimal.valueOf(gf.getConfidence()));
                item.setEstimatedWeightG(BigDecimal.valueOf(gf.getEstimatedWeightG()));
                item.setFinalWeightG(BigDecimal.valueOf(gf.getEstimatedWeightG())); // User can adjust later
                item.setFinalFood(mf.getFood());               // Initially same as detected
                item.setCreatedAt(now);
                FoodAnalysisItem savedItem = foodAnalysisItemRepository.save(item);

                // 5. Save AiModelResult
                AiModelResult modelResult = new AiModelResult();
                modelResult.setAnalysisItem(savedItem);
                GeminiModelInfo modelInfo = geminiResult.getModelInfo();
                modelResult.setModelName(modelInfo != null ? modelInfo.getModel() : "gemini-3.8-flash");
                modelResult.setModelVersion("1.0");
                modelResult.setConfidence(BigDecimal.valueOf(gf.getConfidence()));
                modelResult.setProcessingTimeMs(modelInfo != null ? modelInfo.getProcessingTimeMs().intValue() : 0);
                modelResult.setCreatedAt(now);
                aiModelResultRepository.save(modelResult);

                // 6. Save ExplainabilityResult (caption + optional bounding box hint)
                ExplainabilityResult explainability = new ExplainabilityResult();
                explainability.setAnalysisItem(savedItem);
                explainability.setHeatmapUrl(null); // Future: generate from bounding box
                String caption = "Detected " + gf.getName() + " with " +
                        String.format("%.0f%%", gf.getConfidence() * 100) + " confidence. " +
                        "Estimated portion: " + gf.getEstimatedWeightG() + "g.";
                if (gf.getBoundingBox() != null) {
                    BoundingBox bb = gf.getBoundingBox();
                    caption += " Bounding box: [" + bb.getX() + ", " +
                            bb.getY() + ", " +
                            bb.getWidth() + ", " +
                            bb.getHeight() + "]";
                }
                explainability.setCaption(caption);
                explainability.setCreatedAt(now);
                explainabilityResultRepository.save(explainability);
            }

            // 7. Mark completed
            savedAnalysis.setStatus(AnalysisStatus.COMPLETED);
            savedAnalysis.setCompletedAt(OffsetDateTime.now());
            foodAnalysisRepository.save(savedAnalysis);

        } catch (AnalysisException e) {
            // 8. Mark failed
            savedAnalysis.setStatus(AnalysisStatus.FAILED);
            savedAnalysis.setCompletedAt(OffsetDateTime.now());
            foodAnalysisRepository.save(savedAnalysis);
            throw e;
        } catch (Exception e) {
            // 8. Mark failed
            savedAnalysis.setStatus(AnalysisStatus.FAILED);
            savedAnalysis.setCompletedAt(OffsetDateTime.now());
            foodAnalysisRepository.save(savedAnalysis);
            throw new AnalysisException("Food analysis failed: " + e.getMessage(), e);
        }

        return toResponse(savedAnalysis);
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
                explainability
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