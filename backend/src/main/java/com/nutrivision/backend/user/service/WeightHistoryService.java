package com.nutrivision.backend.user.service;

import com.nutrivision.backend.user.dto.AddWeightHistoryRequest;
import com.nutrivision.backend.user.dto.WeightHistoryResponse;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.entity.WeightHistory;
import com.nutrivision.backend.user.repository.UserRepository;
import com.nutrivision.backend.user.repository.WeightHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WeightHistoryService {

    private final WeightHistoryRepository weightHistoryRepository;
    private final UserRepository userRepository;

    public List<WeightHistoryResponse> getWeightHistory(Long userId) {

        return weightHistoryRepository
                .findByUserIdOrderByRecordedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public WeightHistoryResponse addWeight(
            Long userId,
            AddWeightHistoryRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        WeightHistory history = new WeightHistory();

        history.setUser(user);
        history.setWeightKg(request.weightKg());
        history.setRecordedAt(OffsetDateTime.now());

        return toResponse(weightHistoryRepository.save(history));
    }

    private WeightHistoryResponse toResponse(WeightHistory history) {

        return new WeightHistoryResponse(
                history.getId(),
                history.getWeightKg(),
                history.getRecordedAt()
        );
    }
}