package com.nutrivision.backend.food.service;

import com.nutrivision.backend.food.dto.category.FoodCategoryResponse;
import com.nutrivision.backend.food.dto.food.CreateFoodRequest;
import com.nutrivision.backend.food.dto.food.FoodResponse;
import com.nutrivision.backend.food.dto.food.UpdateFoodRequest;
import com.nutrivision.backend.food.dto.nutrition.FoodNutritionResponse;
import com.nutrivision.backend.food.dto.serving.FoodServingResponse;
import com.nutrivision.backend.food.entity.Food;
import com.nutrivision.backend.food.entity.FoodCategory;
import com.nutrivision.backend.food.entity.FoodNutrition;
import com.nutrivision.backend.food.entity.FoodSearchHistory;
import com.nutrivision.backend.food.entity.FoodServing;
import com.nutrivision.backend.food.repository.FoodCategoryRepository;
import com.nutrivision.backend.food.repository.FoodNutritionRepository;
import com.nutrivision.backend.food.repository.FoodRepository;
import com.nutrivision.backend.food.repository.FoodSearchHistoryRepository;
import com.nutrivision.backend.food.repository.FoodServingRepository;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FoodService {

    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    private final FoodCategoryRepository foodCategoryRepository;
    private final FoodNutritionRepository foodNutritionRepository;
    private final FoodServingRepository foodServingRepository;
    private final FoodSearchHistoryRepository foodSearchHistoryRepository;

    public List<FoodResponse> getAllFoods() {

        return foodRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public FoodResponse getFood(Long foodId) {

        Food food = findFood(foodId);

        return toResponse(food);
    }

    public List<FoodResponse> searchFoods(String name) {

        return foodRepository
                .findByNameContainingIgnoreCaseOrderByNameAsc(name)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<FoodResponse> getFoodsByCategory(Long categoryId) {

        if (!foodCategoryRepository.existsById(categoryId)) {
            throw new IllegalArgumentException("Food category not found");
        }

        return foodRepository
                .findByCategoryIdOrderByNameAsc(categoryId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public FoodResponse createFood(CreateFoodRequest request) {

        FoodCategory category = findCategory(request.categoryId());

        Food food = new Food();

        food.setName(request.name());
        food.setDescription(request.description());
        food.setCategory(category);
        food.setImageUrl(request.imageUrl());
        food.setVerified(true);

        OffsetDateTime now = OffsetDateTime.now();

        food.setCreatedAt(now);
        food.setUpdatedAt(now);

        Food savedFood = foodRepository.save(food);

        return toResponse(savedFood);
    }

    @Transactional
    public FoodResponse updateFood(Long foodId, UpdateFoodRequest request) {

        Food food = findFood(foodId);

        FoodCategory category = findCategory(request.categoryId());

        food.setName(request.name());
        food.setDescription(request.description());
        food.setCategory(category);
        food.setImageUrl(request.imageUrl());
        food.setUpdatedAt(OffsetDateTime.now());

        Food updatedFood = foodRepository.save(food);

        return toResponse(updatedFood);
    }

    @Transactional
    public void deleteFood(Long foodId) {

        Food food = findFood(foodId);

        foodRepository.delete(food);
    }

    @Transactional
    public void recordSearch(Long userId, Long foodId) {

        Food food = findFood(foodId);

        FoodSearchHistory history = foodSearchHistoryRepository.findByUserIdAndFoodId(userId, foodId)
                .orElseGet(() -> {
                    FoodSearchHistory newHistory = new FoodSearchHistory();

                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));

                    newHistory.setUser(user);

                    newHistory.setFood(food);

                    return newHistory;
                });

        history.setSearchedAt(OffsetDateTime.now());

        foodSearchHistoryRepository.save(history);
    }

    public List<FoodResponse> getRecentFoods(Long userId) {

        return foodSearchHistoryRepository
                .findByUserIdOrderBySearchedAtDesc(userId)
                .stream()
                .map(FoodSearchHistory::getFood)
                .map(this::toResponse)
                .toList();
    }

    private Food findFood(Long foodId) {

        return foodRepository.findById(foodId).orElseThrow(() ->
                new IllegalArgumentException("Food not found")
        );
    }

    private FoodCategory findCategory(Long categoryId) {

        return foodCategoryRepository.findById(categoryId).orElseThrow(() ->
                new IllegalArgumentException(
                        "Food category not found"
                )
        );
    }

    private FoodResponse toResponse(Food food) {

        FoodNutritionResponse nutrition = foodNutritionRepository.findByFoodId(food.getId())
                .map(this::toNutritionResponse)
                .orElse(null);

        List<FoodServingResponse> servings = foodServingRepository
                .findByFoodIdOrderByServingNameAsc(food.getId())
                .stream()
                .map(this::toServingResponse)
                .toList();

        FoodCategoryResponse category = new FoodCategoryResponse(
                food.getCategory().getId(),
                food.getCategory().getName()
        );

        return new FoodResponse(
                food.getId(),
                food.getName(),
                food.getDescription(),
                category,
                food.getImageUrl(),
                food.isVerified(),
                nutrition,
                servings
        );
    }

    private FoodNutritionResponse toNutritionResponse(FoodNutrition nutrition) {

        return new FoodNutritionResponse(
                nutrition.getCaloriesKcal(),
                nutrition.getProteinG(),
                nutrition.getCarbohydratesG(),
                nutrition.getFatG(),
                nutrition.getFiberG(),
                nutrition.getSugarG(),
                nutrition.getSaturatedFatG(),
                nutrition.getSodiumMg(),
                nutrition.getCholesterolMg()
        );
    }

    private FoodServingResponse toServingResponse(FoodServing serving) {

        return new FoodServingResponse(
                serving.getId(),
                serving.getServingName(),
                serving.getWeightG()
        );
    }
}