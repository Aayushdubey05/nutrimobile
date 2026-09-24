package com.nutrivision.backend.analysis.service;

import com.nutrivision.backend.analysis.entity.AnalysisStatus;
import com.nutrivision.backend.analysis.entity.FoodAnalysis;
import com.nutrivision.backend.analysis.repository.FoodAnalysisRepository;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

/**
 * Writes analysis status rows in their own transactions.
 *
 * <p>The analysis itself runs in a transaction that rolls back when Gemini or
 * persistence fails, which would also discard the row marking the attempt as
 * FAILED. Committing these independently keeps a record of failed attempts.
 */
@Service
@RequiredArgsConstructor
public class AnalysisRecordWriter {

    private final FoodAnalysisRepository foodAnalysisRepository;
    private final UserRepository userRepository;

    /** Creates and commits the PROCESSING row so it survives a later rollback. */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Long createProcessing(Long userId, String imageUrl) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        FoodAnalysis analysis = new FoodAnalysis();
        analysis.setUser(user);
        analysis.setImageUrl(imageUrl);
        analysis.setStatus(AnalysisStatus.PROCESSING);
        analysis.setCreatedAt(OffsetDateTime.now());

        return foodAnalysisRepository.save(analysis).getId();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markFailed(Long analysisId) {

        foodAnalysisRepository.findById(analysisId).ifPresent(analysis -> {
            analysis.setStatus(AnalysisStatus.FAILED);
            analysis.setCompletedAt(OffsetDateTime.now());
            foodAnalysisRepository.save(analysis);
        });
    }
}
