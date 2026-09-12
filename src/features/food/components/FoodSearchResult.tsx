import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../constants/colors";

interface FoodSearchResultProps {
  name: string;
  category: string;
  calories: number;
  onPress?: () => void;
}

export default function FoodSearchResult({
  name,
  category,
  calories,
  onPress,
}: FoodSearchResultProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="restaurant-outline" size={21} color={colors.text} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>

        <Text style={styles.category}>{category}</Text>
      </View>

      <View style={styles.calorieContainer}>
        <Text style={styles.calories}>{calories}</Text>

        <Text style={styles.kcal}>kcal</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.placeholder} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 70,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  pressed: {
    opacity: 0.75,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },

  category: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
  },

  calorieContainer: {
    alignItems: "flex-end",
    marginRight: 10,
  },

  calories: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  kcal: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 2,
  },
});
