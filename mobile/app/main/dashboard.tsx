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

interface Meal {
  id: string;
  mealType: string;
  time: string;
  name: string;
  calories: number;
  imageUri: string;
}

const DEFAULT_MEALS: Meal[] = [
  {
    id: "1",
    mealType: "BREAKFAST",
    time: "8:30 AM",
    name: "Avocado Toast with Poached Egg",
    calories: 420,
    imageUri:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "2",
    mealType: "LUNCH",
    time: "1:15 PM",
    name: "Quinoa Kale Salad Bowl",
    calories: 560,
    imageUri:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "3",
    mealType: "SNACK",
    time: "4:30 PM",
    name: "Greek Yogurt with Berries",
    calories: 260,
    imageUri:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80",
  },
];

export default function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [meals] = useState<Meal[]>(DEFAULT_MEALS);

  const filteredMeals = useMemo(() => {
    if (!searchQuery.trim()) return meals;
    return meals.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.mealType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [meals, searchQuery]);

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Top Header */}
        <View style={styles.topSection}>
          <View>
            <Text style={styles.appName}>NutriVision-3D</Text>
            <Text style={styles.greeting}>Good morning, Ritesh 👋</Text>
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
        <CalorieCard
          consumed={1240}
          target={2000}
          protein={{ current: 72, target: 120, unit: "g" }}
          carbs={{ current: 145, target: 250, unit: "g" }}
          fat={{ current: 42, target: 65, unit: "g" }}
        />

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
          filteredMeals.map((meal) => (
            <FoodSummaryCard
              key={meal.id}
              mealType={meal.mealType}
              time={meal.time}
              name={meal.name}
              calories={meal.calories}
              imageUri={meal.imageUri}
            />
          ))
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
});

