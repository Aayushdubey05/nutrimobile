package com.nutrivision.backend.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "user_profile",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_user_profile_user",
                        columnNames = "user_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_user_profile_user")
    )
    private User user;

    @Column(nullable = false)
    private Short age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "gender_type")
    private GenderType gender;

    @Column(name = "height_cm", nullable = false, precision = 5, scale = 2)
    private BigDecimal heightCm;

    @Column(name = "current_weight_kg", nullable = false, precision = 6, scale = 2)
    private BigDecimal currentWeightKg;

    @Column(name = "target_weight_kg", precision = 6, scale = 2)
    private BigDecimal targetWeightKg;

    @Enumerated(EnumType.STRING)
    @Column(name = "fitness_goal", nullable = false, columnDefinition = "fitness_goal_type")
    private FitnessGoalType fitnessGoal;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_level", nullable = false, columnDefinition = "activity_level_type")
    private ActivityLevelType activityLevel;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}


