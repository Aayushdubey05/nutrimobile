import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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
import MacroSummaryRow from "../../src/features/nutrition/components/MacroSummary";

const MEAL_IMAGE =
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=85";

const MEALS = [
  {
    id: "1",
    mealType: "Breakfast",
    time: "8:30 AM",
    name: "Paneer Tikka",
    calories: 280,
  },
  {
    id: "2",
    mealType: "Lunch",
    time: "1:15 PM",
    name: "Dal Tadka & Roti",
    calories: 420,
  },
  {
    id: "3",
    mealType: "Dinner",
    time: "7:30 PM",
    name: "Paneer Tikka",
    calories: 360,
  },
];

export default function DiaryScreen() {
  const [meals, setMeals] = useState(MEALS);

  const [selectedDate, setSelectedDate] = useState("Today, 7 Sep");

  const caloriesConsumed = meals.reduce(
    (total, meal) => total + meal.calories,
    0,
  );

  const calorieTarget = 2000;

  const caloriesLeft = Math.max(calorieTarget - caloriesConsumed, 0);

  const calorieProgress = Math.min(caloriesConsumed / calorieTarget, 1);

  const handleDeleteMeal = (id: string) => {
    setMeals((currentMeals) => currentMeals.filter((meal) => meal.id !== id));
  };

  const handlePreviousDay = () => {
    // UI-only for now.
  };

  const handleNextDay = () => {
    // UI-only for now.
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
          {/* Header */}
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

          {/* Date Selector */}
          <DateSelector
            dateLabel={selectedDate}
            onPrevious={handlePreviousDay}
            onNext={handleNextDay}
          />

          {/* Nutrition Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <View>
                <Text style={styles.summaryLabel}>CALORIES CONSUMED</Text>

                <View style={styles.calorieRow}>
                  <Text style={styles.calorieValue}>
                    {caloriesConsumed.toLocaleString()}
                  </Text>

                  <Text style={styles.calorieTarget}>
                    / {calorieTarget.toLocaleString()} kcal
                  </Text>
                </View>
              </View>

              <View style={styles.leftPill}>
                <Text style={styles.leftPillText}>
                  {caloriesLeft} kcal left
                </Text>
              </View>
            </View>

            {/* Calorie Progress */}
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

            {/* Macro Summary */}
            <MacroSummaryRow />
          </View>

          {/* Meals Header */}
          <View style={styles.mealsHeader}>
            <Text style={styles.mealsTitle}>Today's Meals</Text>

            <Text style={styles.mealsCount}>{meals.length} logged</Text>
          </View>

          {/* Meals */}
          {meals.length > 0 ? (
            <View>
              {meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  mealType={meal.mealType}
                  time={meal.time}
                  name={meal.name}
                  calories={meal.calories}
                  imageUrl={MEAL_IMAGE}
                  onEdit={() => {
                    // UI-only for now.
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

              <Text style={styles.emptyTitle}>No meals logged today</Text>

              <Text style={styles.emptyText}>
                Scan or search for food to start your diary.
              </Text>
            </View>
          )}

          {/* Add Meal */}
          <Pressable style={styles.logAnotherButton} onPress={handleAddMeal}>
            <Ionicons name="add" size={19} color={colors.text} />

            <Text style={styles.logAnotherText}>Log another meal or snack</Text>
          </Pressable>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNav active="diary" />
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
