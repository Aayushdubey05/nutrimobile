package com.nutrivision.backend.meal.service;

import com.nutrivision.backend.food.entity.CustomFood;
import com.nutrivision.backend.food.entity.Food;
import com.nutrivision.backend.food.entity.FoodNutrition;
import com.nutrivision.backend.food.repository.CustomFoodRepository;
import com.nutrivision.backend.food.repository.FoodNutritionRepository;
import com.nutrivision.backend.food.repository.FoodRepository;
import com.nutrivision.backend.meal.dto.request.CreateMealItemRequest;
import com.nutrivision.backend.meal.dto.request.CreateMealRequest;
import com.nutrivision.backend.meal.dto.request.UpdateMealItemRequest;
import com.nutrivision.backend.meal.dto.request.UpdateMealRequest;
import com.nutrivision.backend.meal.dto.response.MealItemResponse;
import com.nutrivision.backend.meal.dto.response.MealNutritionResponse;
import com.nutrivision.backend.meal.dto.response.MealResponse;
import com.nutrivision.backend.meal.entity.Meal;
import com.nutrivision.backend.meal.entity.MealItem;
import com.nutrivision.backend.meal.repository.MealItemRepository;
import com.nutrivision.backend.meal.repository.MealRepository;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MealService {

    private final MealRepository mealRepository;
    private final MealItemRepository mealItemRepository;
    private final FoodRepository foodRepository;
    private final CustomFoodRepository customFoodRepository;
    private final UserRepository userRepository;
    private final FoodNutritionRepository foodNutritionRepository;

    @Transactional
    public MealResponse createMeal(
            Long userId,
            CreateMealRequest request
    ) {

        User user = findUser(userId);

        Meal meal = new Meal();
        meal.setUser(user);
        meal.setMealType(request.mealType());
        meal.setMealDate(request.mealDate());
        meal.setMealTime(request.mealTime());

        OffsetDateTime now = OffsetDateTime.now();
        meal.setCreatedAt(now);
        meal.setUpdatedAt(now);

        Meal savedMeal = mealRepository.save(meal);

        List<MealItem> items = request.items()
                .stream()
                .map(item -> createMealItem(savedMeal, item))
                .toList();

        mealItemRepository.saveAll(items);

        savedMeal.setItems(new ArrayList<>(items));

        return toResponse(savedMeal);
    }

    public MealResponse getMeal(
            Long userId,
            Long mealId
    ) {

        Meal meal = findMealForUser(userId, mealId);

        return toResponse(meal);
    }

    public List<MealResponse> getMeals(Long userId) {

        findUser(userId);

        return mealRepository
                .findByUserIdOrderByMealDateDescMealTimeDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MealResponse> getMealsByDate(
            Long userId,
            LocalDate date
    ) {

        findUser(userId);

        return mealRepository
                .findByUserIdAndMealDateOrderByMealTimeDesc(
                        userId,
                        date
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MealResponse updateMeal(
            Long userId,
            Long mealId,
            UpdateMealRequest request
    ) {

        Meal meal = findMealForUser(userId, mealId);

        meal.setMealType(request.mealType());
        meal.setMealDate(request.mealDate());
        meal.setMealTime(request.mealTime());
        meal.setUpdatedAt(OffsetDateTime.now());

        mealItemRepository.deleteAll(meal.getItems());

        List<MealItem> newItems = request.items()
                .stream()
                .map(item -> createUpdatedMealItem(meal, item))
                .toList();

        mealItemRepository.saveAll(newItems);

        meal.setItems(new ArrayList<>(newItems));

        return toResponse(mealRepository.save(meal));
    }

    @Transactional
    public void deleteMeal(
            Long userId,
            Long mealId
    ) {

        Meal meal = findMealForUser(userId, mealId);

        mealItemRepository.deleteAll(meal.getItems());
        mealRepository.delete(meal);
    }

    private MealItem createMealItem(
            Meal meal,
            CreateMealItemRequest request
    ) {

        validateFoodReference(
                request.foodId(),
                request.customFoodId()
        );

        MealItem item = new MealItem();

        item.setMeal(meal);
        item.setQuantity(request.quantity());
        item.setWeightG(request.weightG());
        item.setCreatedAt(OffsetDateTime.now());

        if (request.foodId() != null) {

            Food food = foodRepository.findById(request.foodId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Food not found")
                    );

            FoodNutrition nutrition = foodNutritionRepository
                    .findByFoodId(food.getId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Nutrition data not found for food"
                            )
                    );

            item.setFood(food);

            setFoodNutrition(item, nutrition);

        } else {

            CustomFood customFood = customFoodRepository
                    .findByIdAndUserId(
                            request.customFoodId(),
                            meal.getUser().getId()
                    )
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Custom food not found"
                            )
                    );

            item.setCustomFood(customFood);

            setCustomFoodNutrition(item, customFood);
        }

        return item;
    }

    private void setFoodNutrition(
            MealItem item,
            FoodNutrition nutrition
    ) {

        BigDecimal multiplier = item.getWeightG()
                .divide(
                        BigDecimal.valueOf(100),
                        6,
                        RoundingMode.HALF_UP
                );

        item.setCaloriesKcal(
                multiply(nutrition.getCaloriesKcal(), multiplier)
        );
        item.setProteinG(
                multiply(nutrition.getProteinG(), multiplier)
        );
        item.setCarbohydratesG(
                multiply(nutrition.getCarbohydratesG(), multiplier)
        );
        item.setFatG(
                multiply(nutrition.getFatG(), multiplier)
        );
        item.setFiberG(
                multiply(nutrition.getFiberG(), multiplier)
        );
        item.setSugarG(
                multiply(nutrition.getSugarG(), multiplier)
        );
        item.setSaturatedFatG(
                multiply(nutrition.getSaturatedFatG(), multiplier)
        );
        item.setSodiumMg(
                multiply(nutrition.getSodiumMg(), multiplier)
        );
        item.setCholesterolMg(
                multiply(nutrition.getCholesterolMg(), multiplier)
        );
    }

    private MealItem createUpdatedMealItem(
            Meal meal,
            UpdateMealItemRequest request
    ) {

        validateFoodReference(
                request.foodId(),
                request.customFoodId()
        );

        MealItem item = new MealItem();

        item.setMeal(meal);
        item.setQuantity(request.quantity());
        item.setWeightG(request.weightG());
        item.setCreatedAt(OffsetDateTime.now());

        if (request.foodId() != null) {

            Food food = foodRepository.findById(request.foodId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Food not found")
                    );

            FoodNutrition nutrition = foodNutritionRepository
                    .findByFoodId(food.getId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Nutrition data not found for food"
                            )
                    );

            item.setFood(food);

            setFoodNutrition(item, nutrition);

        } else {

            CustomFood customFood = customFoodRepository
                    .findByIdAndUserId(
                            request.customFoodId(),
                            meal.getUser().getId()
                    )
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Custom food not found"
                            )
                    );

            item.setCustomFood(customFood);

            setCustomFoodNutrition(item, customFood);
        }

        return item;
    }

    private void setCustomFoodNutrition(
            MealItem item,
            CustomFood food
    ) {

        BigDecimal multiplier = item.getWeightG()
                .divide(
                        food.getServingSizeG(),
                        6,
                        RoundingMode.HALF_UP
                );

        item.setCaloriesKcal(
                multiply(food.getCaloriesKcal(), multiplier)
        );
        item.setProteinG(
                multiply(food.getProteinG(), multiplier)
        );
        item.setCarbohydratesG(
                multiply(food.getCarbohydratesG(), multiplier)
        );
        item.setFatG(
                multiply(food.getFatG(), multiplier)
        );
        item.setFiberG(
                multiply(food.getFiberG(), multiplier)
        );
        item.setSugarG(
                multiply(food.getSugarG(), multiplier)
        );
        item.setSaturatedFatG(
                multiply(food.getSaturatedFatG(), multiplier)
        );
        item.setSodiumMg(
                multiply(food.getSodiumMg(), multiplier)
        );
        item.setCholesterolMg(
                multiply(food.getCholesterolMg(), multiplier)
        );
    }

    private BigDecimal multiply(
            BigDecimal value,
            BigDecimal multiplier
    ) {

        return value
                .multiply(multiplier)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private void validateFoodReference(
            Long foodId,
            Long customFoodId
    ) {

        if ((foodId == null && customFoodId == null)
                || (foodId != null && customFoodId != null)) {

            throw new IllegalArgumentException(
                    "Exactly one of foodId or customFoodId must be provided"
            );
        }
    }

    private User findUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );
    }

    private Meal findMealForUser(
            Long userId,
            Long mealId
    ) {

        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Meal not found")
                );

        if (!meal.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Meal not found");
        }

        return meal;
    }

    private MealResponse toResponse(Meal meal) {

        List<MealItemResponse> items = meal.getItems()
                .stream()
                .map(this::toItemResponse)
                .toList();

        MealNutritionResponse nutrition =
                calculateNutrition(meal.getItems());

        return new MealResponse(
                meal.getId(),
                meal.getMealType(),
                meal.getMealDate(),
                meal.getMealTime(),
                items,
                nutrition,
                meal.getCreatedAt(),
                meal.getUpdatedAt()
        );
    }

    private MealItemResponse toItemResponse(MealItem item) {

        String foodName;

        if (item.getFood() != null) {
            foodName = item.getFood().getName();
        } else {
            foodName = item.getCustomFood().getName();
        }

        return new MealItemResponse(
                item.getId(),
                item.getFood() != null
                        ? item.getFood().getId()
                        : null,
                item.getCustomFood() != null
                        ? item.getCustomFood().getId()
                        : null,
                foodName,
                item.getQuantity(),
                item.getWeightG(),
                item.getCaloriesKcal(),
                item.getProteinG(),
                item.getCarbohydratesG(),
                item.getFatG(),
                item.getFiberG(),
                item.getSugarG(),
                item.getSaturatedFatG(),
                item.getSodiumMg(),
                item.getCholesterolMg()
        );
    }

    private MealNutritionResponse calculateNutrition(
            List<MealItem> items
    ) {

        return new MealNutritionResponse(
                sum(items, MealItem::getCaloriesKcal),
                sum(items, MealItem::getProteinG),
                sum(items, MealItem::getCarbohydratesG),
                sum(items, MealItem::getFatG),
                sum(items, MealItem::getFiberG),
                sum(items, MealItem::getSugarG),
                sum(items, MealItem::getSaturatedFatG),
                sum(items, MealItem::getSodiumMg),
                sum(items, MealItem::getCholesterolMg)
        );
    }

    private BigDecimal sum(
            List<MealItem> items,
            java.util.function.Function<MealItem, BigDecimal> getter
    ) {

        return items.stream()
                .map(getter)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                )
                .setScale(2, RoundingMode.HALF_UP);
    }
}