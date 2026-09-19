import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BottomNav from "../../src/components/BottomNav";
import { colors } from "../../src/constants/colors";
import DateSelector from "../../src/features/history/components/DateSelector";
import MealCard from "../../src/features/history/components/MealCard";
import { mealService } from "../../src/features/meal/services/mealService";
import type { MealResponse } from "../../src/features/meal/types";
import MacroSummaryRow from "../../src/features/nutrition/components/MacroSummary";
import { nutritionService } from "../../src/features/nutrition/services/nutritionService";

const MEAL_IMAGE =
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=85";

export default function DiaryScreen() {
  const [meals, setMeals] = useState<MealResponse[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const [calorieTarget, setCalorieTarget] = useState(0);
  const [proteinTarget, setProteinTarget] = useState(0);
  const [carbsTarget, setCarbsTarget] = useState(0);
  const [fatTarget, setFatTarget] = useState(0);

  useEffect(() => {
    loadDiary();
  }, [selectedDate]);

  const loadDiary = async () => {
    try {
      setLoading(true);

      const date = formatDateForApi(selectedDate);

      const [mealData, targetData] = await Promise.all([
        mealService.getMealsByDate(date),
        nutritionService.getCurrentTarget(),
      ]);

      setMeals(mealData);

      setCalorieTarget(Number(targetData.calorieTargetKcal));
      setProteinTarget(Number(targetData.proteinTargetG));
      setCarbsTarget(Number(targetData.carbohydrateTargetG));
      setFatTarget(Number(targetData.fatTargetG));
    } catch (error) {
      console.error("Failed to load diary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId: number) => {
    try {
      await mealService.deleteMeal(mealId);

      setMeals((currentMeals) =>
        currentMeals.filter((meal) => meal.id !== mealId),
      );
    } catch (error) {
      console.error("Failed to delete meal:", error);
    }
  };

  const caloriesConsumed = meals.reduce(
    (total, meal) => total + Number(meal.nutrition.caloriesKcal),
    0,
  );

  const proteinConsumed = meals.reduce(
    (total, meal) => total + Number(meal.nutrition.proteinG),
    0,
  );

  const carbsConsumed = meals.reduce(
    (total, meal) => total + Number(meal.nutrition.carbohydratesG),
    0,
  );

  const fatConsumed = meals.reduce(
    (total, meal) => total + Number(meal.nutrition.fatG),
    0,
  );

  const caloriesLeft = Math.max(calorieTarget - caloriesConsumed, 0);

  const calorieProgress =
    calorieTarget > 0 ? Math.min(caloriesConsumed / calorieTarget, 1) : 0;

  const handlePreviousDay = () => {
    setSelectedDate((current) => {
      const previous = new Date(current);
      previous.setDate(previous.getDate() - 1);
      return previous;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + 1);
      return next;
    });
  };

  const handleAddMeal = () => {
    router.push("/main/manual-entry");
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Meal Diary</Text>

              <Text style={styles.subtitle}>Strictly Vegetarian Log</Text>
            </View>

            <Pressable
              style={styles.addButton}
              onPress={handleAddMeal}
              hitSlop={8}
            >
              <Ionicons name="add" size={24} color={colors.text} />
            </Pressable>
          </View>

          <DateSelector
            dateLabel={formatDateLabel(selectedDate)}
            onPrevious={handlePreviousDay}
            onNext={handleNextDay}
          />

          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <View>
                <Text style={styles.summaryLabel}>CALORIES CONSUMED</Text>

                <View style={styles.calorieRow}>
                  <Text style={styles.calorieValue}>
                    {Math.round(caloriesConsumed).toLocaleString()}
                  </Text>

                  <Text style={styles.calorieTarget}>
                    / {Math.round(calorieTarget).toLocaleString()} kcal
                  </Text>
                </View>
              </View>

              <View style={styles.leftPill}>
                <Text style={styles.leftPillText}>
                  {Math.round(caloriesLeft)} kcal left
                </Text>
              </View>
            </View>

            <View style={styles.calorieTrack}>
              <View
                style={[
                  styles.calorieProgress,
                  {
                    width: `${calorieProgress * 100}%`,
                  },
                ]}
              />
            </View>

            <MacroSummaryRow
              protein={proteinConsumed}
              proteinTarget={proteinTarget}
              carbs={carbsConsumed}
              carbsTarget={carbsTarget}
              fat={fatConsumed}
              fatTarget={fatTarget}
            />
          </View>

          <View style={styles.mealsHeader}>
            <Text style={styles.mealsTitle}>
              {isToday(selectedDate) ? "Today's Meals" : "Meals"}
            </Text>

            <Text style={styles.mealsCount}>{meals.length} logged</Text>
          </View>

          {loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Loading meals...</Text>
            </View>
          ) : meals.length > 0 ? (
            <View>
              {meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  mealType={formatMealType(meal.mealType)}
                  time={formatMealTime(meal.mealTime)}
                  name={getMealName(meal)}
                  calories={Math.round(Number(meal.nutrition.caloriesKcal))}
                  imageUrl={getMealImage(meal)}
                  onEdit={() => {
                    // Edit flow can be connected later.
                  }}
                  onDelete={() => handleDeleteMeal(meal.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="restaurant-outline"
                  size={25}
                  color={colors.icon}
                />
              </View>

              <Text style={styles.emptyTitle}>No meals logged</Text>

              <Text style={styles.emptyText}>
                Scan or search for food to start your diary.
              </Text>
            </View>
          )}

          <Pressable style={styles.logAnotherButton} onPress={handleAddMeal}>
            <Ionicons name="add" size={19} color={colors.text} />

            <Text style={styles.logAnotherText}>Log another meal or snack</Text>
          </Pressable>
        </ScrollView>

        <BottomNav active="diary" />
      </SafeAreaView>
    </View>
  );
}

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(date: Date): string {
  const today = new Date();

  const isCurrentDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isCurrentDay) {
    return `Today, ${date.getDate()} ${date.toLocaleString("en-US", {
      month: "short",
    })}`;
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isToday(date: Date): boolean {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function formatMealType(type: string): string {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

function formatMealTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function getMealName(meal: MealResponse): string {
  if (meal.items.length === 0) {
    return "Meal";
  }

  return meal.items.map((item) => item.foodName).join(" + ");
}

function getMealImage(meal: MealResponse): string {
  return meal.items.find((item) => item.imageUrl)?.imageUrl ?? MEAL_IMAGE;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 18,
    marginTop: 14,
  },

  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  summaryLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.6,
    color: colors.secondaryText,
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 5,
  },

  calorieValue: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "700",
    color: colors.text,
  },

  calorieTarget: {
    fontSize: 13,
    color: colors.secondaryText,
    marginLeft: 4,
  },

  leftPill: {
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  leftPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text,
  },

  calorieTrack: {
    height: 7,
    width: "100%",
    backgroundColor: "#EAEAEA",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 18,
  },

  calorieProgress: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },

  mealsHeader: {
    marginTop: 26,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mealsTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.text,
  },

  mealsCount: {
    fontSize: 12,
    color: colors.secondaryText,
  },

  emptyState: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 35,
    alignItems: "center",
  },

  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },

  emptyText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 5,
    maxWidth: 260,
  },

  logAnotherButton: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondaryText,
    borderStyle: "dashed",
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 6,
  },

  logAnotherText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
});
