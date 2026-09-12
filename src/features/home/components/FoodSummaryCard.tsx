import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

interface FoodSummaryCardProps {
  name: string;
  calories: number;
  protein: number;
  time: string;
}

export default function FoodSummaryCard({
  name,
  calories,
  protein,
  time,
}: FoodSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="restaurant-outline" size={20} color={colors.text} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>

        <Text style={styles.time}>{time}</Text>
      </View>

      <View style={styles.nutrition}>
        <Text style={styles.calories}>{calories} kcal</Text>

        <Text style={styles.protein}>{protein}g protein</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  time: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 3,
  },

  nutrition: {
    alignItems: "flex-end",
    marginLeft: 10,
  },

  calories: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  protein: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 3,
  },
});
