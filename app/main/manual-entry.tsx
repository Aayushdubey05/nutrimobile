import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
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

const INDIAN_VEG_FOODS: FoodItemData[] = [
  {
    id: "1",
    name: "Paneer Tikka",
    category: "Indian",
    caloriesPer100g: 265,
    macros: { protein: 18, carbs: 6, fat: 20 },
    imageUri:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "2",
    name: "Palak Paneer",
    category: "Indian",
    caloriesPer100g: 180,
    macros: { protein: 12, carbs: 8, fat: 11 },
    imageUri:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "3",
    name: "Dal Tadka",
    category: "Indian",
    caloriesPer100g: 130,
    macros: { protein: 7, carbs: 18, fat: 4 },
    imageUri:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "4",
    name: "Roti",
    category: "Indian",
    caloriesPer100g: 297,
    macros: { protein: 10, carbs: 52, fat: 3 },
    imageUri:
      "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "5",
    name: "Basmati Rice",
    category: "Indian",
    caloriesPer100g: 130,
    macros: { protein: 3, carbs: 28, fat: 0.4 },
    imageUri:
      "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=300&q=80",
  },
];

const DEFAULT_RECENT = ["Paneer", "Roti", "Dal Tadka", "Basmati Rice"];

export default function ManualEntryScreen() {
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(DEFAULT_RECENT);

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return INDIAN_VEG_FOODS;
    return INDIAN_VEG_FOODS.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query)
    );
  }, [search]);

  const handleSelectRecent = (chip: string) => {
    setSearch(chip);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const handleAddCustomFood = () => {
    Alert.alert(
      "Add Custom Food",
      "Enter custom food details to add it to your log.",
      [{ text: "OK" }]
    );
  };

  const handleAddFoodItem = (food: FoodItemData) => {
    Alert.alert("Food Selected", `${food.name} added to your log!`, [
      { text: "View Results", onPress: () => router.push("/main/nutrition-result") },
      { text: "OK" },
    ]);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {/* Left Circular Back Button */}
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>

          {/* Right Small Rounded "+ Custom Food" Button */}
          <Pressable
            style={({ pressed }) => [
              styles.customFoodButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleAddCustomFood}
          >
            <Ionicons name="add" size={15} color={colors.text} />
            <Text style={styles.customFoodText}>Custom Food</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Main Title & Subtitle */}
          <View style={styles.intro}>
            <Text style={styles.title}>Search food</Text>
            <Text style={styles.subtitle}>
              Search Indian vegetarian foods by name or portion.
            </Text>
          </View>

          {/* Search Bar */}
          <FoodSearchBar
            value={search}
            onChangeText={setSearch}
            onClear={() => setSearch("")}
            placeholder="Search food..."
          />

          {/* Recent Searches Section */}
          {recentSearches.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitleText}>RECENT SEARCHES</Text>
                <Pressable onPress={handleClearRecent}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              </View>

              <View style={styles.chipsRow}>
                {recentSearches.map((chip) => (
                  <Pressable
                    key={chip}
                    style={({ pressed }) => [
                      styles.chip,
                      search === chip && styles.activeChip,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => handleSelectRecent(chip)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        search === chip && styles.activeChipText,
                      ]}
                    >
                      {chip}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Results Section */}
          <View style={styles.resultsSection}>
            <Text style={styles.resultsCountText}>
              RESULTS ({filteredFoods.length})
            </Text>

            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => (
                <FoodSearchResult
                  key={food.id}
                  food={food}
                  onPress={() => handleAddFoodItem(food)}
                  onAdd={() => handleAddFoodItem(food)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={28} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No foods found</Text>
                <Text style={styles.emptyText}>
                  Try searching with a different food name or add custom food.
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Fallback Card */}
          <View style={styles.fallbackCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fallbackTitle}>Can't find your food?</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.fallbackActionButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleAddCustomFood}
            >
              <Text style={styles.fallbackActionText}>
                Add custom food manually
              </Text>
            </Pressable>
          </View>
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

  customFoodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

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

  clearText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },

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
});

