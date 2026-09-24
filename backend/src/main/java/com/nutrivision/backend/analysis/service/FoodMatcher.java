package com.nutrivision.backend.analysis.service;

import com.nutrivision.backend.analysis.dto.gemini.GeminiAnalysisResult;
import com.nutrivision.backend.analysis.dto.gemini.GeminiDetectedFood;
import com.nutrivision.backend.analysis.dto.gemini.MatchedFood;
import com.nutrivision.backend.analysis.dto.gemini.NutritionPer100g;
import com.nutrivision.backend.food.entity.Food;
import com.nutrivision.backend.food.entity.FoodCategory;
import com.nutrivision.backend.food.entity.FoodNutrition;
import com.nutrivision.backend.food.repository.FoodCategoryRepository;
import com.nutrivision.backend.food.repository.FoodNutritionRepository;
import com.nutrivision.backend.food.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FoodMatcher {

    private final FoodRepository foodRepository;
    private final FoodNutritionRepository nutritionRepository;
    private final FoodCategoryRepository categoryRepository;

    private static final double FUZZY_MATCH_THRESHOLD = 0.8;

    public List<MatchedFood> matchOrCreateFoods(List<GeminiDetectedFood> detectedFoods) {
        return detectedFoods.stream()
                .map(this::matchOrCreateSingle)
                .toList();
    }

    @Transactional
    private MatchedFood matchOrCreateSingle(GeminiDetectedFood detected) {
        // 1. Try exact name match (case-insensitive)
        Optional<Food> exact = foodRepository.findByNameIgnoreCase(detected.getName());
        if (exact.isPresent()) {
            return new MatchedFood(exact.get(), detected, false);
        }

        // 2. Fuzzy match using Levenshtein distance
        List<Food> candidates = foodRepository.findAllByNameContainingIgnoreCase(getFirstWord(detected.getName()));
        Food bestMatch = candidates.stream()
                .max(Comparator.comparing(f -> similarity(f.getName(), detected.getName())))
                .filter(f -> similarity(f.getName(), detected.getName()) >= FUZZY_MATCH_THRESHOLD)
                .orElse(null);

        if (bestMatch != null) {
            return new MatchedFood(bestMatch, detected, false);
        }

        // 3. Create NEW Food entry with Gemini nutrition
        Food newFood = createNewFood(detected);
        return new MatchedFood(newFood, detected, true);
    }

    private Food createNewFood(GeminiDetectedFood detected) {
        Food food = new Food();
        food.setName(detected.getName());
        food.setDescription("Auto-created from Gemini analysis");
        food.setVerified(false); // Flag for admin review
        food.setCategory(findOrCreateCategory("AI Detected"));
        food.setCreatedAt(OffsetDateTime.now());
        food.setUpdatedAt(OffsetDateTime.now());
        Food saved = foodRepository.save(food);

        // Create nutrition record
        NutritionPer100g n = detected.getNutritionPer100g();
        FoodNutrition nutrition = new FoodNutrition();
        nutrition.setFood(saved);
        nutrition.setCaloriesKcal(n.getCaloriesKcal());
        nutrition.setProteinG(n.getProteinG());
        nutrition.setCarbohydratesG(n.getCarbohydratesG());
        nutrition.setFatG(n.getFatG());
        nutrition.setFiberG(n.getFiberG());
        nutrition.setSugarG(n.getSugarG());
        nutrition.setSaturatedFatG(n.getSaturatedFatG());
        nutrition.setSodiumMg(n.getSodiumMg());
        nutrition.setCholesterolMg(n.getCholesterolMg());
        nutritionRepository.save(nutrition);

        return saved;
    }

    private FoodCategory findOrCreateCategory(String name) {
        return categoryRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> {
                    FoodCategory cat = new FoodCategory();
                    cat.setName(name);
                    cat.setDescription("Auto-created category for AI detected foods");
                    return categoryRepository.save(cat);
                });
    }

    private String getFirstWord(String name) {
        String[] words = name.trim().split("\\s+");
        return words.length > 0 ? words[0] : name;
    }

    private double similarity(String a, String b) {
        LevenshteinDistance ld = new LevenshteinDistance();
        int dist = ld.apply(a.toLowerCase(), b.toLowerCase());
        int maxLen = Math.max(a.length(), b.length());
        return maxLen == 0 ? 1.0 : 1.0 - (double) dist / maxLen;
    }
}