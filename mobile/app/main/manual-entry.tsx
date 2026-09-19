import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../../src/constants/colors";
import FoodSearchBar from "../../src/features/food/components/FoodSearchBar";
import FoodSearchResult, {
  FoodItemData,
} from "../../src/features/food/components/FoodSearchResult";
import { foodService } from "../../src/features/food/services/foodService";
import { Food } from "../../src/features/food/types";

export default function ManualEntryScreen() {
  const [search, setSearch] = useState("");
  const [foods, setFoods] = useState<Food[]>([]);
  const [recentFoods, setRecentFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecentFoods();
  }, []);

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      setFoods([]);
      setError(null);
      return;
    }

    const timeout = setTimeout(() => {
      searchFoods(trimmedSearch);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const loadRecentFoods = async () => {
    try {
      const data = await foodService.getRecentFoods();
      setRecentFoods(data);
    } catch {
      // Recent searches are optional.
      setRecentFoods([]);
    }
  };

  const searchFoods = async (name: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await foodService.searchFoods(name);
      setFoods(data);
    } catch {
      setFoods([]);
      setError("Unable to search food. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFood = async (food: Food) => {
    try {
      await foodService.recordSearch(food.id);

      router.push({
        pathname: "/main/nutrition-result",
        params: {
          foodId: String(food.id),
        },
      });
    } catch {
      Alert.alert(
        "Unable to continue",
        "Could not select this food. Please try again.",
      );
    }
  };

  const handleClear = () => {
    setSearch("");
    setFoods([]);
    setError(null);
  };

  const mapFoodToResult = (food: Food): FoodItemData => ({
    id: food.id,
    name: food.name,
    category: food.category.name,
    caloriesPer100g: food.nutrition?.caloriesKcal ?? 0,
    macros: {
      protein: food.nutrition?.proteinG ?? 0,
      carbs: food.nutrition?.carbohydratesG ?? 0,
      fat: food.nutrition?.fatG ?? 0,
    },
    imageUri: food.imageUrl ?? undefined,
  });

  const displayedFoods = search.trim() ? foods : recentFoods;

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

          <Text style={styles.headerTitle}>Add Food</Text>

          <View style={styles.headerButtonPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <FoodSearchBar
            value={search}
            onChangeText={setSearch}
            onClear={handleClear}
          />

          {!search.trim() && recentFoods.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>

                <Pressable onPress={() => setRecentFoods([])} hitSlop={8}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              </View>

              <View style={styles.recentChips}>
                {recentFoods.slice(0, 6).map((food) => (
                  <Pressable
                    key={food.id}
                    style={styles.recentChip}
                    onPress={() => setSearch(food.name)}
                  >
                    <Text style={styles.recentChipText}>{food.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {isLoading && (
            <View style={styles.centerState}>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.stateText}>Searching food...</Text>
            </View>
          )}

          {!isLoading && error && (
            <View style={styles.centerState}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!isLoading &&
            !error &&
            search.trim() &&
            displayedFoods.length === 0 && (
              <View style={styles.centerState}>
                <Text style={styles.emptyTitle}>No food found</Text>
                <Text style={styles.stateText}>Try another food name.</Text>
              </View>
            )}

          {!isLoading && !error && displayedFoods.length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.sectionTitle}>
                {search.trim() ? "SEARCH RESULTS" : "RECENT FOODS"}
              </Text>

              {displayedFoods.map((food) => (
                <FoodSearchResult
                  key={food.id}
                  food={mapFoodToResult(food)}
                  onPress={() => handleSelectFood(food)}
                  onAdd={() => handleSelectFood(food)}
                />
              ))}
            </View>
          )}

          <Pressable
            style={styles.customFoodButton}
            onPress={() =>
              Alert.alert(
                "Custom Food",
                "Custom food entry will be available soon.",
              )
            }
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.text} />

            <View style={styles.customFoodTextContainer}>
              <Text style={styles.customFoodTitle}>Can't find your food?</Text>

              <Text style={styles.customFoodSubtitle}>
                Add a custom food manually
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.secondaryText}
            />
          </Pressable>
        </ScrollView>
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
    height: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },

  // customFoodButton: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: colors.white,
  //   borderWidth: 1,
  //   borderColor: "#E5E7EB",
  //   borderRadius: 16,
  //   paddingHorizontal: 12,
  //   paddingVertical: 7,
  // },

  customFoodText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 3,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  intro: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.4,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },

  recentSection: {
    marginBottom: 22,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitleText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#737373",
  },

  // clearText: {
  //   fontSize: 12,
  //   fontWeight: "600",
  //   color: "#6B7280",
  // },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  activeChip: {
    backgroundColor: "#171717",
    borderColor: "#171717",
  },

  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  activeChipText: {
    color: colors.white,
  },

  resultsSection: {
    marginBottom: 20,
  },

  resultsCountText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#737373",
    marginBottom: 12,
  },

  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },

  emptyText: {
    fontSize: 13,
    color: colors.secondaryText,
    textAlign: "center",
  },

  fallbackCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },

  fallbackTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  fallbackActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginLeft: 10,
  },

  fallbackActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
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

  headerButtonPlaceholder: {
    width: 42,
    height: 42,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#737373",
    marginBottom: 10,
  },

  clearText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  recentChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  recentChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  recentChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text,
  },

  centerState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },

  stateText: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 8,
  },

  errorText: {
    fontSize: 13,
    color: "#B91C1C",
    textAlign: "center",
  },

  customFoodButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  customFoodTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  customFoodTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  customFoodSubtitle: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 3,
  },
});
