package com.nutrivision.backend.recommendation.entity;

import com.nutrivision.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "recommendation_feedback",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_recommendation_feedback_user",
                        columnNames = {"recommendation_id", "user_id"}
                )
        },
        indexes = {
                @Index(
                        name = "idx_recommendation_feedback_user",
                        columnList = "user_id"
                ),
                @Index(
                        name = "idx_recommendation_feedback_recommendation",
                        columnList = "recommendation_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class RecommendationFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "recommendation_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_recommendation_feedback_recommendation"
            )
    )
    private Recommendation recommendation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_recommendation_feedback_user"
            )
    )
    private User user;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(
            nullable = false,
            columnDefinition = "recommendation_feedback_type"
    )
    private RecommendationFeedbackType feedback;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}