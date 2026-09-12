import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Button from "../../src/components/Button";
import { colors } from "../../src/constants/colors";
import FoodSearchBar from "../../src/features/food/components/FoodSearchBar";
import FoodSearchResult from "../../src/features/food/components/FoodSearchResult";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
}

const FOOD_ITEMS: FoodItem[] = [
  {
    id: "1",
    name: "Paneer Butter Masala",
    category: "Indian • Vegetarian",
    calories: 420,
  },
  {
    id: "2",
    name: "Jeera Rice",
    category: "Indian • Vegetarian",
    calories: 280,
  },
  {
    id: "3",
    name: "Vegetable Biryani",
    category: "Indian • Vegetarian",
    calories: 380,
  },
  {
    id: "4",
    name: "Dal Tadka",
    category: "Indian • Vegetarian",
    calories: 220,
  },
  {
    id: "5",
    name: "Roti",
    category: "Indian • Vegetarian",
    calories: 120,
  },
];

export default function ManualEntryScreen() {
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return FOOD_ITEMS;
    }

    return FOOD_ITEMS.filter((food) => food.name.toLowerCase().includes(query));
  }, [search]);

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleContinue = () => {
    if (!selectedFood) {
      return;
    }

    // router.push("/(main)/nutrition-result");
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>

          <Text style={styles.headerTitle}>Add food</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Intro */}
          <View style={styles.intro}>
            <Text style={styles.title}>Search your food</Text>

            <Text style={styles.subtitle}>
              Find a food manually and add it to your nutrition log.
            </Text>
          </View>

          {/* Search */}
          <FoodSearchBar
            value={search}
            onChangeText={setSearch}
            onClear={() => setSearch("")}
            placeholder="Search for a food"
          />

          {/* Selected Food */}
          {selectedFood && (
            <View style={styles.selectedSection}>
              <Text style={styles.sectionTitle}>Selected food</Text>

              <View style={styles.selectedCard}>
                <View style={styles.selectedIcon}>
                  <Ionicons name="checkmark" size={20} color={colors.text} />
                </View>

                <View style={styles.selectedInfo}>
                  <Text style={styles.selectedName}>{selectedFood.name}</Text>

                  <Text style={styles.selectedCategory}>
                    {selectedFood.category}
                  </Text>
                </View>

                <Pressable onPress={() => setSelectedFood(null)} hitSlop={10}>
                  <Ionicons
                    name="close-outline"
                    size={21}
                    color={colors.icon}
                  />
                </Pressable>
              </View>
            </View>
          )}

          {/* Food List */}
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>
              {search.trim() ? "Search results" : "Popular foods"}
            </Text>

            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => (
                <FoodSearchResult
                  key={food.id}
                  name={food.name}
                  category={food.category}
                  calories={food.calories}
                  onPress={() => handleFoodSelect(food)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color={colors.icon}
                  />
                </View>

                <Text style={styles.emptyTitle}>No food found</Text>

                <Text style={styles.emptyText}>
                  Try searching with a different food name.
                </Text>
              </View>
            )}
          </View>

          {/* Continue */}
          <View style={styles.buttonContainer}>
            <Button title="Continue" onPress={handleContinue} />
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
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
  },

  headerPlaceholder: {
    width: 42,
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
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.secondaryText,
    maxWidth: 340,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },

  selectedSection: {
    marginTop: 24,
  },

  selectedCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedInfo: {
    flex: 1,
    marginLeft: 12,
  },

  selectedName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },

  selectedCategory: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
  },

  resultsSection: {
    marginTop: 26,
  },

  emptyState: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: "center",
  },

  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondaryText,
    textAlign: "center",
  },

  buttonContainer: {
    marginTop: 14,
  },
});
