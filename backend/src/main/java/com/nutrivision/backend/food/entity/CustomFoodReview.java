package com.nutrivision.backend.food.entity;

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
        name = "custom_food_review",
        indexes = {
                @Index(
                        name = "idx_custom_food_review_custom_food",
                        columnList = "custom_food_id"
                ),
                @Index(
                        name = "idx_custom_food_review_admin",
                        columnList = "admin_id"
                ),
                @Index(
                        name = "idx_custom_food_review_reviewed_at",
                        columnList = "reviewed_at DESC"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class CustomFoodReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "custom_food_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_custom_food_review_custom_food")
    )
    private CustomFood customFood;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "admin_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_custom_food_review_admin")
    )
    private User admin;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(
            nullable = false,
            columnDefinition = "custom_food_status"
    )
    private CustomFoodStatus status;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "reviewed_at", nullable = false)
    private OffsetDateTime reviewedAt;
}