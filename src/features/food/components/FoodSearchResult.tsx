import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../constants/colors";

export interface FoodItemData {
  id: string;
  name: string;
  category: string;
  caloriesPer100g: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  imageUri?: string;
}

interface FoodSearchResultProps {
  food: FoodItemData;
  onPress?: () => void;
  onAdd?: () => void;
}

export default function FoodSearchResult({
  food,
  onPress,
  onAdd,
}: FoodSearchResultProps) {
  const { name, category, caloriesPer100g, macros, imageUri } = food;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.iconFallback}>
            <Ionicons name="restaurant-outline" size={20} color="#171717" />
          </View>
        )}
      </View>

      {/* Middle info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {/* Small green category badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        </View>

        {/* Calories / 100g & Macro Summary */}
        <Text style={styles.calorieText}>
          {caloriesPer100g} kcal / 100g
        </Text>
        <Text style={styles.macroText}>
          P: {macros.protein}g • C: {macros.carbs}g • F: {macros.fat}g
        </Text>
      </View>

      {/* Circular Plus Action Button */}
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onAdd || onPress}
      >
        <Ionicons name="add" size={20} color="#171717" />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,

    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },

  pressed: {
    opacity: 0.8,
  },

  thumbnailContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
  },

  iconFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },

  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 2,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },

  categoryBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },

  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#15803D",
  },

  calorieText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginTop: 1,
  },

  macroText: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 2,
  },

  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  buttonPressed: {
    backgroundColor: "#E5E7EB",
    transform: [{ scale: 0.95 }],
  },
});

