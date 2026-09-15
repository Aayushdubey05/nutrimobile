package com.nutrivision.backend.food.entity;

import com.nutrivision.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "food_search_history",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_food_search_history_user_food",
                        columnNames = {"user_id", "food_id"}
                )
        },
        indexes = {
                @Index(
                        name = "idx_food_search_history_user_searched_at",
                        columnList = "user_id, searched_at DESC"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class FoodSearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_food_search_history_user"
            )
    )
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "food_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_food_search_history_food"
            )
    )
    private Food food;

    @Column(name = "searched_at", nullable = false, updatable = false)
    private OffsetDateTime searchedAt;
}