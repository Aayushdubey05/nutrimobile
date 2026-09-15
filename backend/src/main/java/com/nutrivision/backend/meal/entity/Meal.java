package com.nutrivision.backend.meal.entity;

import com.nutrivision.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "meal",
        indexes = {
                @Index(name = "idx_meal_user_date", columnList = "user_id, meal_date DESC"),
                @Index(name = "idx_meal_user_date_time", columnList = "user_id, meal_date, meal_time")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_meal_user")
    )
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false, columnDefinition = "meal_type")
    private MealType mealType;

    @Column(name = "meal_date", nullable = false)
    private LocalDate mealDate;

    @Column(name = "meal_time", nullable = false)
    private LocalTime mealTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "meal", fetch = FetchType.LAZY)
    private List<MealItem> items = new ArrayList<>();
}