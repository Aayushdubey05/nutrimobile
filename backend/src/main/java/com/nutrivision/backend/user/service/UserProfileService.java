package com.nutrivision.backend.user.service;

import com.nutrivision.backend.user.dto.DietaryRestrictionResponse;
import com.nutrivision.backend.user.dto.HealthConditionResponse;
import com.nutrivision.backend.user.dto.UpdateUserProfileRequest;
import com.nutrivision.backend.user.dto.UserProfileResponse;
import com.nutrivision.backend.user.entity.DietaryRestriction;
import com.nutrivision.backend.user.entity.HealthCondition;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.entity.UserProfile;
import com.nutrivision.backend.user.repository.DietaryRestrictionRepository;
import com.nutrivision.backend.user.repository.HealthConditionRepository;
import com.nutrivision.backend.user.repository.UserProfileRepository;
import com.nutrivision.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final DietaryRestrictionRepository dietaryRestrictionRepository;
    private final HealthConditionRepository healthConditionRepository;

    public UserProfileResponse getProfile(Long userId) {

        User user = findUser(userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User profile not found")
                );

        return toResponse(user, profile);
    }

    @Transactional
    public UserProfileResponse updateProfile(
            Long userId,
            UpdateUserProfileRequest request
    ) {

        User user = findUser(userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserProfile newProfile = new UserProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.setAge(request.age());
        profile.setGender(request.gender());
        profile.setHeightCm(request.heightCm());
        profile.setCurrentWeightKg(request.currentWeightKg());
        profile.setTargetWeightKg(request.targetWeightKg());
        profile.setFitnessGoal(request.fitnessGoal());
        profile.setActivityLevel(request.activityLevel());

        user.setDietaryRestrictions(
                findDietaryRestrictions(request.dietaryRestrictionIds())
        );

        user.setHealthConditions(
                findHealthConditions(request.healthConditionIds())
        );

        UserProfile savedProfile = userProfileRepository.save(profile);

        return toResponse(user, savedProfile);
    }

    private User findUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );
    }

    private Set<DietaryRestriction> findDietaryRestrictions(
            Set<Long> ids
    ) {

        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }

        Set<DietaryRestriction> restrictions =
                new HashSet<>(dietaryRestrictionRepository.findAllById(ids));

        if (restrictions.size() != ids.size()) {
            throw new IllegalArgumentException(
                    "One or more dietary restrictions not found"
            );
        }

        return restrictions;
    }

    private Set<HealthCondition> findHealthConditions(
            Set<Long> ids
    ) {

        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }

        Set<HealthCondition> conditions =
                new HashSet<>(healthConditionRepository.findAllById(ids));

        if (conditions.size() != ids.size()) {
            throw new IllegalArgumentException(
                    "One or more health conditions not found"
            );
        }

        return conditions;
    }

    private UserProfileResponse toResponse(User user, UserProfile profile) {

        Set<DietaryRestrictionResponse> restrictions = user.getDietaryRestrictions()
                .stream().map(r -> new DietaryRestrictionResponse(
                        r.getId(),
                        r.getName()
                )).collect(Collectors.toSet());

        Set<HealthConditionResponse> conditions = user.getHealthConditions()
                .stream().map(c -> new HealthConditionResponse(
                        c.getId(),
                        c.getName()
                )).collect(Collectors.toSet());

        return new UserProfileResponse(
                profile.getId(),
                profile.getAge(),
                profile.getGender(),
                profile.getHeightCm(),
                profile.getCurrentWeightKg(),
                profile.getTargetWeightKg(),
                profile.getFitnessGoal(),
                profile.getActivityLevel(),
                restrictions,
                conditions,
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}