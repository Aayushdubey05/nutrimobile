package com.nutrivision.backend.user;

import com.nutrivision.backend.user.dto.DietaryRestrictionResponse;
import com.nutrivision.backend.user.dto.HealthConditionResponse;
import com.nutrivision.backend.user.dto.UpdateUserProfileRequest;
import com.nutrivision.backend.user.dto.UserProfileResponse;
import com.nutrivision.backend.user.entity.DietaryRestriction;
import com.nutrivision.backend.user.entity.HealthCondition;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.entity.UserProfile;
import com.nutrivision.backend.user.entity.ActivityLevelType;
import com.nutrivision.backend.user.entity.FitnessGoalType;
import com.nutrivision.backend.user.entity.GenderType;
import com.nutrivision.backend.common.exception.UserProfileNotFoundException;
import com.nutrivision.backend.user.repository.DietaryRestrictionRepository;
import com.nutrivision.backend.user.repository.HealthConditionRepository;
import com.nutrivision.backend.user.repository.UserProfileRepository;
import com.nutrivision.backend.user.repository.UserRepository;
import com.nutrivision.backend.user.service.UserProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
        import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private DietaryRestrictionRepository dietaryRestrictionRepository;

    @Mock
    private HealthConditionRepository healthConditionRepository;

    @InjectMocks
    private UserProfileService userProfileService;

    private User user;
    private UserProfile profile;
    private DietaryRestriction vegetarian;
    private HealthCondition diabetes;

    @BeforeEach
    void setUp() {

        user = new User();

        user.setId(1L);
        user.setName("Ritesh Test");
        user.setEmail("ritesh.test@gmail.com");
        user.setPasswordHash("hashed-password");
        user.setDeleted(false);
        user.setDietaryRestrictions(new HashSet<>());
        user.setHealthConditions(new HashSet<>());
        user.setCreatedAt(OffsetDateTime.now());
        user.setUpdatedAt(OffsetDateTime.now());


        vegetarian = new DietaryRestriction();
        vegetarian.setId(1L);
        vegetarian.setName("Vegetarian");


        diabetes = new HealthCondition();
        diabetes.setId(1L);
        diabetes.setName("Diabetes");


        profile = new UserProfile();

        profile.setId(10L);
        profile.setUser(user);
        profile.setAge((short) 21);
        profile.setGender(GenderType.MALE);
        profile.setHeightCm(new BigDecimal("175.00"));
        profile.setCurrentWeightKg(new BigDecimal("55.00"));
        profile.setTargetWeightKg(new BigDecimal("65.00"));
        profile.setFitnessGoal(FitnessGoalType.MUSCLE_GAIN);
        profile.setActivityLevel(ActivityLevelType.MODERATELY_ACTIVE);
        profile.setCreatedAt(OffsetDateTime.now());
        profile.setUpdatedAt(OffsetDateTime.now());
    }


    // =========================================================
    // GET PROFILE
    // =========================================================

    @Test
    void getProfile_shouldReturnProfileSuccessfully() {

        user.getDietaryRestrictions().add(vegetarian);
        user.getHealthConditions().add(diabetes);

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userProfileRepository.findByUserId(1L))
                .thenReturn(Optional.of(profile));

        UserProfileResponse response =
                userProfileService.getProfile(1L);

        assertNotNull(response);

        assertEquals(10L, response.id());
        assertEquals((short) 21, response.age());
        assertEquals(GenderType.MALE, response.gender());
        assertEquals(
                new BigDecimal("175.00"),
                response.heightCm()
        );
        assertEquals(
                new BigDecimal("55.00"),
                response.currentWeightKg()
        );
        assertEquals(
                new BigDecimal("65.00"),
                response.targetWeightKg()
        );

        assertEquals(
                FitnessGoalType.MUSCLE_GAIN,
                response.fitnessGoal()
        );

        assertEquals(
                ActivityLevelType.MODERATELY_ACTIVE,
                response.activityLevel()
        );

        assertEquals(1, response.dietaryRestrictions().size());
        assertEquals(1, response.healthConditions().size());

        DietaryRestrictionResponse restriction =
                response.dietaryRestrictions()
                        .iterator()
                        .next();

        assertEquals(1L, restriction.id());
        assertEquals("Vegetarian", restriction.name());


        HealthConditionResponse condition =
                response.healthConditions()
                        .iterator()
                        .next();

        assertEquals(1L, condition.id());
        assertEquals("Diabetes", condition.name());

        verify(userRepository).findById(1L);
        verify(userProfileRepository).findByUserId(1L);
    }


    @Test
    void getProfile_shouldThrowWhenUserNotFound() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                IllegalArgumentException.class,
                () -> userProfileService.getProfile(1L)
        );

        verify(userRepository).findById(1L);
        verify(userProfileRepository, never())
                .findByUserId(any());
    }


    @Test
    void getProfile_shouldThrowWhenProfileNotFound() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userProfileRepository.findByUserId(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                UserProfileNotFoundException.class,
                () -> userProfileService.getProfile(1L)
        );

        verify(userRepository).findById(1L);
        verify(userProfileRepository).findByUserId(1L);
    }


    // =========================================================
    // UPDATE PROFILE - EXISTING PROFILE
    // =========================================================

    @Test
    void updateProfile_shouldUpdateExistingProfile() {

        Set<Long> restrictionIds = Set.of(1L);
        Set<Long> conditionIds = Set.of(1L);

        UpdateUserProfileRequest request =
                new UpdateUserProfileRequest(
                        (short) 22,
                        GenderType.MALE,
                        new BigDecimal("176.00"),
                        new BigDecimal("56.00"),
                        new BigDecimal("65.00"),
                        FitnessGoalType.MUSCLE_GAIN,
                        ActivityLevelType.MODERATELY_ACTIVE,
                        restrictionIds,
                        conditionIds
                );

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userProfileRepository.findByUserId(1L))
                .thenReturn(Optional.of(profile));

        when(dietaryRestrictionRepository.findAllById(
                restrictionIds
        )).thenReturn(List.of(vegetarian));

        when(healthConditionRepository.findAllById(
                conditionIds
        )).thenReturn(List.of(diabetes));

        when(userProfileRepository.save(profile))
                .thenReturn(profile);


        UserProfileResponse response =
                userProfileService.updateProfile(
                        1L,
                        request
                );


        assertNotNull(response);

        assertEquals(
                (short) 22,
                profile.getAge()
        );

        assertEquals(
                new BigDecimal("176.00"),
                profile.getHeightCm()
        );

        assertEquals(
                new BigDecimal("56.00"),
                profile.getCurrentWeightKg()
        );

        assertEquals(
                new BigDecimal("65.00"),
                profile.getTargetWeightKg()
        );

        assertEquals(
                FitnessGoalType.MUSCLE_GAIN,
                profile.getFitnessGoal()
        );

        assertEquals(
                ActivityLevelType.MODERATELY_ACTIVE,
                profile.getActivityLevel()
        );

        assertTrue(
                user.getDietaryRestrictions()
                        .contains(vegetarian)
        );

        assertTrue(
                user.getHealthConditions()
                        .contains(diabetes)
        );

        verify(userProfileRepository).save(profile);
        verify(dietaryRestrictionRepository)
                .findAllById(restrictionIds);
        verify(healthConditionRepository)
                .findAllById(conditionIds);
    }


    // =========================================================
    // UPDATE PROFILE - CREATE NEW PROFILE
    // =========================================================

    @Test
    void updateProfile_shouldCreateProfileWhenNotExists() {

        Set<Long> restrictionIds = Set.of();
        Set<Long> conditionIds = Set.of();

        UpdateUserProfileRequest request =
                new UpdateUserProfileRequest(
                        (short) 21,
                        GenderType.MALE,
                        new BigDecimal("175.00"),
                        new BigDecimal("55.00"),
                        new BigDecimal("65.00"),
                        FitnessGoalType.MUSCLE_GAIN,
                        ActivityLevelType.MODERATELY_ACTIVE,
                        restrictionIds,
                        conditionIds
                );

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userProfileRepository.findByUserId(1L))
                .thenReturn(Optional.empty());

        when(userProfileRepository.save(any(UserProfile.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));


        UserProfileResponse response =
                userProfileService.updateProfile(
                        1L,
                        request
                );


        assertNotNull(response);

        assertEquals(
                (short) 21,
                response.age()
        );

        assertEquals(
                GenderType.MALE,
                response.gender()
        );

        assertEquals(
                new BigDecimal("175.00"),
                response.heightCm()
        );

        assertEquals(
                new BigDecimal("55.00"),
                response.currentWeightKg()
        );

        assertEquals(
                new BigDecimal("65.00"),
                response.targetWeightKg()
        );

        assertTrue(
                user.getDietaryRestrictions().isEmpty()
        );

        assertTrue(
                user.getHealthConditions().isEmpty()
        );

        verify(userProfileRepository)
                .findByUserId(1L);

        verify(userProfileRepository)
                .save(any(UserProfile.class));
    }


    // =========================================================
    // INVALID DIETARY RESTRICTION
    // =========================================================

    @Test
    void updateProfile_shouldThrowWhenDietaryRestrictionNotFound() {

        Set<Long> restrictionIds = Set.of(1L, 2L);
        Set<Long> conditionIds = Set.of();

        UpdateUserProfileRequest request =
                new UpdateUserProfileRequest(
                        (short) 21,
                        GenderType.MALE,
                        new BigDecimal("175.00"),
                        new BigDecimal("55.00"),
                        new BigDecimal("65.00"),
                        FitnessGoalType.MUSCLE_GAIN,
                        ActivityLevelType.MODERATELY_ACTIVE,
                        restrictionIds,
                        conditionIds
                );

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userProfileRepository.findByUserId(1L))
                .thenReturn(Optional.of(profile));

        when(dietaryRestrictionRepository.findAllById(
                restrictionIds
        )).thenReturn(List.of(vegetarian));


        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userProfileService.updateProfile(
                                1L,
                                request
                        )
                );

        assertEquals(
                "One or more dietary restrictions not found",
                exception.getMessage()
        );

        verify(userProfileRepository, never())
                .save(any(UserProfile.class));
    }


    // =========================================================
    // INVALID HEALTH CONDITION
    // =========================================================

    @Test
    void updateProfile_shouldThrowWhenHealthConditionNotFound() {

        Set<Long> restrictionIds = Set.of();
        Set<Long> conditionIds = Set.of(1L, 2L);

        UpdateUserProfileRequest request =
                new UpdateUserProfileRequest(
                        (short) 21,
                        GenderType.MALE,
                        new BigDecimal("175.00"),
                        new BigDecimal("55.00"),
                        new BigDecimal("65.00"),
                        FitnessGoalType.MUSCLE_GAIN,
                        ActivityLevelType.MODERATELY_ACTIVE,
                        restrictionIds,
                        conditionIds
                );

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userProfileRepository.findByUserId(1L))
                .thenReturn(Optional.of(profile));

        when(healthConditionRepository.findAllById(
                conditionIds
        )).thenReturn(List.of(diabetes));


        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userProfileService.updateProfile(
                                1L,
                                request
                        )
                );

        assertEquals(
                "One or more health conditions not found",
                exception.getMessage()
        );

        verify(userProfileRepository, never())
                .save(any(UserProfile.class));
    }


    // =========================================================
    // USER NOT FOUND DURING UPDATE
    // =========================================================

    @Test
    void updateProfile_shouldThrowWhenUserNotFound() {

        UpdateUserProfileRequest request =
                new UpdateUserProfileRequest(
                        (short) 21,
                        GenderType.MALE,
                        new BigDecimal("175.00"),
                        new BigDecimal("55.00"),
                        new BigDecimal("65.00"),
                        FitnessGoalType.MUSCLE_GAIN,
                        ActivityLevelType.MODERATELY_ACTIVE,
                        Set.of(),
                        Set.of()
                );

        when(userRepository.findById(1L))
                .thenReturn(Optional.empty());


        assertThrows(
                IllegalArgumentException.class,
                () -> userProfileService.updateProfile(
                        1L,
                        request
                )
        );

        verify(userProfileRepository, never())
                .save(any(UserProfile.class));
    }
}