import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import BottomNav from "@/components/BottomNav";
import SectionHeader from "../../src/components/SectionHeader";
import { colors } from "../../src/constants/colors";
import CalorieCard from "../../src/features/home/components/CalorieCard";
import FoodSummaryCard from "../../src/features/home/components/FoodSummaryCard";
import QuickAction from "../../src/features/home/components/QuickAction";
import { useDashboard } from "../../src/features/home/hooks/useDashboard";
import { useAuth } from "../../src/features/auth/hooks/useAuth";

function formatMealTime(time: string): string {
  const [hoursString, minutes] = time.split(":");

  const hours = Number(hoursString);

  const period = hours >= 12 ? "PM" : "AM";

  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes} ${period}`;
}

export default function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();

  const { nutrition, meals, isLoading, error, refresh } = useDashboard();

  const filteredMeals = useMemo(() => {
    if (!searchQuery.trim()) {
      return meals;
    }

    const query = searchQuery.toLowerCase();

    return meals.filter((meal) =>
      meal.items.some(
        (item) =>
          item.foodName.toLowerCase().includes(query) ||
          meal.mealType.toLowerCase().includes(query),
      ),
    );
  }, [meals, searchQuery]);

  const consumedCalories = nutrition?.consumed.caloriesKcal ?? 0;
  const targetCalories = nutrition?.target.caloriesKcal ?? 0;

  const consumedProtein = nutrition?.consumed.proteinG ?? 0;
  const targetProtein = nutrition?.target.proteinG ?? 0;

  const consumedCarbs = nutrition?.consumed.carbohydratesG ?? 0;
  const targetCarbs = nutrition?.target.carbohydratesG ?? 0;

  const consumedFat = nutrition?.consumed.fatG ?? 0;
  const targetFat = nutrition?.target.fatG ?? 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {isLoading && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Loading your nutrition...</Text>
          </View>
        )}

        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>

            <Pressable style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {/* Top Header */}
        <View style={styles.topSection}>
          <View>
            <Text style={styles.appName}>NutriVision-3D</Text>
            <Text style={styles.greeting}>
              Good morning, {user?.name ?? "there"} 👋
            </Text>
            <Text style={styles.subtitle}>
              Let's track your nutrition today.
            </Text>
          </View>

          {/* Profile Avatar Button */}
          <Pressable
            style={({ pressed }) => [
              styles.avatarButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/main/profile")}
          >
            <Text style={styles.avatarText}>RK</Text>
          </Pressable>
        </View>

        {/* Nutrition Summary Card */}
        {nutrition && (
          <CalorieCard
            consumed={consumedCalories}
            target={targetCalories}
            protein={{
              current: consumedProtein,
              target: targetProtein,
              unit: "g",
            }}
            carbs={{
              current: consumedCarbs,
              target: targetCarbs,
              unit: "g",
            }}
            fat={{
              current: consumedFat,
              target: targetFat,
              unit: "g",
            }}
          />
        )}

        {/* Search Field */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={19} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search food..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>

        {/* Primary Scan Food Button */}
        <Pressable
          style={({ pressed }) => [
            styles.scanButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/main/scan")}
        >
          <Ionicons
            name="camera-outline"
            size={20}
            color="#FFFFFF"
            style={styles.scanIcon}
          />
          <Text style={styles.scanButtonText}>Scan Food</Text>
        </Pressable>

        {/* Quick Actions (Add Meal, Recommendation) */}
        <View style={styles.quickActionsRow}>
          <QuickAction
            variant="pill"
            icon="add-circle-outline"
            title="Add Meal"
            onPress={() => router.push("/main/manual-entry")}
          />
          <View style={{ width: 12 }} />
          <QuickAction
            variant="pill"
            icon="sparkles-outline"
            title="Recommendation"
            onPress={() => router.push("/main/recommendations")}
          />
        </View>

        {/* Today's Meals Section */}
        <SectionHeader
          title="Today's Meals"
          action="See all"
          onActionPress={() => router.push("/main/diary")}
        />

        {filteredMeals.length > 0 ? (
          filteredMeals.slice(0, 5).map((meal) => {
            const mealName =
              meal.items.length === 1
                ? meal.items[0].foodName
                : meal.items.length > 1
                  ? `${meal.items[0].foodName} + ${meal.items.length - 1} more`
                  : "Meal";

            const calories = Math.round(meal.nutrition.caloriesKcal);

            const time = formatMealTime(meal.mealTime);

            return (
              <FoodSummaryCard
                key={meal.id}
                mealType={meal.mealType}
                time={time}
                name={mealName}
                calories={calories}
                imageUri={meal.items[0]?.imageUrl ?? undefined}
              />
            );
          })
        ) : (
          /* Empty State Variation */
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconBadge}>
              <Ionicons name="restaurant-outline" size={28} color="#737373" />
            </View>
            <Text style={styles.emptyStateTitle}>No meals logged yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Scan or search your food to start tracking.
            </Text>
            <Pressable
              style={styles.emptyStateActionButton}
              onPress={() => router.push("/main/scan")}
            >
              <Text style={styles.emptyStateActionText}>Log First Meal</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Bottom 5-Item Navigation Bar */}
      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 110,
  },

  topSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  appName: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#737373",
    textTransform: "uppercase",
    marginBottom: 6,
  },

  greeting: {
    fontSize: 23,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 3,
  },

  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },

  searchContainer: {
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 10,
    height: "100%",
  },

  scanButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#171717",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  scanIcon: {
    marginRight: 8,
  },

  scanButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  quickActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  emptyStateContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 16,
  },

  emptyStateIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },

  emptyStateSubtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },

  emptyStateActionButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#171717",
    borderRadius: 12,
  },

  emptyStateActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statusContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },

  statusText: {
    fontSize: 14,
    color: colors.secondaryText,
  },

  errorContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },

  errorText: {
    fontSize: 13,
    color: "#B91C1C",
    textAlign: "center",
    marginBottom: 12,
  },

  retryButton: {
    backgroundColor: "#171717",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
