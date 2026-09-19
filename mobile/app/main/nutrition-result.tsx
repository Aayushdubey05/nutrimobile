import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ExplainabilitySheet from "@/features/nutrition/components/ExplainabilitySheet";
import Button from "../../src/components/Button";
import { colors } from "../../src/constants/colors";
import NutritionMacroCard from "../../src/features/nutrition/components/NutritionMacroCard";
import PortionSizeCard from "../../src/features/nutrition/components/PortionSizeCard";
import { foodService } from "../../src/features/food/services/foodService";
import type { Food } from "../../src/features/food/types";
import type { MealType } from "../../src/features/meal/types";
import { mealService } from "../../src/features/meal/services/mealService";

const MEAL_TYPES: { label: string; value: MealType }[] = [
  { label: "Breakfast", value: "BREAKFAST" },
  { label: "Lunch", value: "LUNCH" },
  { label: "Dinner", value: "DINNER" },
  { label: "Snack", value: "SNACK" },
  { label: "Other", value: "OTHER" },
];

export default function NutritionResultScreen() {
  const { analysisId, foodId, weightG } = useLocalSearchParams<{
    analysisId?: string;
    foodId?: string;
    weightG?: string;
  }>();

  const [food, setFood] = useState<Food | null>(null);

  const initialWeight = Number(weightG) || 100;

  const [portion, setPortion] = useState(initialWeight);
  const [selectedPreset, setSelectedPreset] = useState(
    [100, 150, 200, 250].includes(initialWeight) ? initialWeight : 0,
  );

  const [selectedMealType, setSelectedMealType] = useState<MealType>("OTHER");

  const [showExplainability, setShowExplainability] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!foodId) {
      setIsLoading(false);

      Alert.alert(
        "Food unavailable",
        "No food was selected for this analysis.",
        [
          {
            text: "Go Back",
            onPress: () => router.back(),
          },
        ],
      );

      return;
    }

    loadFood(Number(foodId));
  }, [foodId]);

  const loadFood = async (id: number) => {
    try {
      setIsLoading(true);

      const data = await foodService.getFood(id);
      setFood(data);
    } catch {
      Alert.alert(
        "Food unavailable",
        "Could not load this food. Please try again.",
        [
          {
            text: "Go Back",
            onPress: () => router.back(),
          },
        ],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const nutrition = useMemo(() => {
    if (!food?.nutrition) {
      return null;
    }

    const multiplier = portion / 100;

    return {
      calories: food.nutrition.caloriesKcal * multiplier,
      protein: food.nutrition.proteinG * multiplier,
      carbs: food.nutrition.carbohydratesG * multiplier,
      fat: food.nutrition.fatG * multiplier,
    };
  }, [food, portion]);

  const handleDecrease = () => {
    setPortion((current) => Math.max(50, current - 50));
    setSelectedPreset(0);
  };

  const handleIncrease = () => {
    setPortion((current) => Math.min(1000, current + 50));
    setSelectedPreset(0);
  };

  const handlePresetSelect = (value: number) => {
    setPortion(value);
    setSelectedPreset(value);
  };

  const handleSaveToLog = async () => {
    if (!food) {
      return;
    }

    try {
      setIsSaving(true);

      const now = new Date();

      const mealDate = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("-");

      const mealTime = [
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0"),
      ].join(":");

      await mealService.createMeal({
        mealType: selectedMealType,
        mealDate,
        mealTime,
        items: [
          {
            foodId: food.id,
            customFoodId: null,
            quantity: 1,
            weightG: portion,
          },
        ],
      });

      Alert.alert(
        "Meal Added",
        `${food.name} has been added to your daily log.`,
        [
          {
            text: "View Dashboard",
            onPress: () => router.replace("/main/dashboard"),
          },
        ],
      );
    } catch {
      Alert.alert(
        "Unable to add meal",
        "Something went wrong while saving your meal. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.text} />

        <Text style={styles.loadingText}>Loading nutrition...</Text>
      </View>
    );
  }

  if (!food) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.emptyTitle}>Food not available</Text>

        <Pressable
          style={styles.backToSearchButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backToSearchText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={23} color={colors.text} />
          </Pressable>

          <View style={styles.headerButtonPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {food.imageUrl ? (
            <Image
              source={{ uri: food.imageUrl }}
              style={styles.foodImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imageFallback}>
              <Ionicons name="restaurant-outline" size={42} color="#737373" />
            </View>
          )}

          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <Ionicons name="leaf-outline" size={14} color={colors.text} />

              <Text style={styles.pillText}>{food.category.name}</Text>
            </View>

            {food.verified && (
              <View style={styles.pill}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={14}
                  color={colors.text}
                />

                <Text style={styles.pillText}>Verified food</Text>
              </View>
            )}
          </View>

          <View style={styles.foodNameRow}>
            <Text style={styles.foodName}>{food.name}</Text>
          </View>

          {food.description && (
            <Text style={styles.subtitle}>{food.description}</Text>
          )}

          <View style={styles.nutritionCard}>
            <View style={styles.calorieSection}>
              <Text style={styles.calorieValue}>
                {Math.round(nutrition?.calories ?? 0)} kcal
              </Text>

              <Text style={styles.calorieLabel}>For {portion}g serving</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.macrosRow}>
              <NutritionMacroCard
                label="Protein"
                value={`${nutrition?.protein.toFixed(1) ?? "0"}g`}
                progress={Math.min((nutrition?.protein ?? 0) / 40, 1)}
                indicatorColor="#4A90E2"
              />

              <NutritionMacroCard
                label="Carbs"
                value={`${nutrition?.carbs.toFixed(1) ?? "0"}g`}
                progress={Math.min((nutrition?.carbs ?? 0) / 60, 1)}
                indicatorColor="#63A66A"
              />

              <NutritionMacroCard
                label="Fat"
                value={`${nutrition?.fat.toFixed(1) ?? "0"}g`}
                progress={Math.min((nutrition?.fat ?? 0) / 40, 1)}
                indicatorColor="#D9A441"
              />
            </View>
          </View>

          <View style={styles.portionSection}>
            <PortionSizeCard
              portion={portion}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
              selectedPreset={selectedPreset}
              onPresetSelect={handlePresetSelect}
            />
          </View>

          <View style={styles.mealTypeSection}>
            <Text style={styles.mealTypeTitle}>MEAL TYPE</Text>

            <View style={styles.mealTypeGrid}>
              {MEAL_TYPES.map((meal) => {
                const selected = selectedMealType === meal.value;

                return (
                  <Pressable
                    key={meal.value}
                    onPress={() => setSelectedMealType(meal.value)}
                    style={[
                      styles.mealTypeButton,
                      selected && styles.mealTypeButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.mealTypeText,
                        selected && styles.mealTypeTextSelected,
                      ]}
                    >
                      {meal.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            style={styles.explanationHeader}
            onPress={() => setShowExplainability(true)}
          >
            <View style={styles.explanationTitleRow}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={colors.secondaryText}
              />

              <Text style={styles.explanationTitle}>Nutrition information</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color={colors.secondaryText}
            />
          </Pressable>

          <View style={styles.actions}>
            <Button
              title={isSaving ? "Adding..." : "✓  Add to Daily Log"}
              onPress={handleSaveToLog}
            />

            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.back()}
              disabled={isSaving}
            >
              <Text style={styles.secondaryButtonText}>
                Choose Another Food
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <ExplainabilitySheet
          visible={showExplainability}
          onClose={() => setShowExplainability(false)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  safeArea: {
    flex: 1,
  },

  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 50,
  },

  foodImage: {
    width: "100%",
    height: 270,
    borderRadius: 22,
    backgroundColor: "#DDD8D2",
  },

  imageFallback: {
    width: "100%",
    height: 270,
    borderRadius: 22,
    backgroundColor: "#DDD8D2",
    alignItems: "center",
    justifyContent: "center",
  },

  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },

  pill: {
    minHeight: 32,
    paddingHorizontal: 11,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  pillText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.text,
  },

  foodNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  foodName: {
    flex: 1,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.secondaryText,
    marginTop: 6,
  },

  nutritionCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 18,
    marginTop: 22,
  },

  calorieSection: {
    flex: 1,
  },

  calorieValue: {
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "700",
    color: colors.text,
  },

  calorieLabel: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 18,
  },

  macrosRow: {
    flexDirection: "row",
    gap: 8,
  },

  portionSection: {
    marginTop: 16,
  },

  mealTypeSection: {
    marginTop: 22,
  },

  mealTypeTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#737373",
    marginBottom: 10,
  },

  mealTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  mealTypeButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  mealTypeButtonSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },

  mealTypeText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  mealTypeTextSelected: {
    color: colors.white,
  },

  explanationHeader: {
    minHeight: 52,
    marginTop: 18,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  explanationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  explanationTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.secondaryText,
  },

  actions: {
    marginTop: 12,
  },

  secondaryButton: {
    height: 56,
    width: "100%",
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.secondaryText,
  },

  headerButtonPlaceholder: {
    width: 42,
    height: 42,
  },

  backToSearchButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.text,
  },

  backToSearchText: {
    color: colors.white,
    fontWeight: "600",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
});
