import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

interface FoodSummaryCardProps {
  name: string;
  calories: number;
  protein?: number;
  time: string;
  mealType?: string;
  imageUri?: string;
}

export default function FoodSummaryCard({
  name,
  calories,
  time,
  mealType,
  imageUri,
}: FoodSummaryCardProps) {
  const headerTag = mealType ? `${mealType.toUpperCase()} — ${time}` : time;

  return (
    <View style={styles.card}>
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

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.tag}>{headerTag}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      </View>

      {/* Calories */}
      <View style={styles.nutrition}>
        <Text style={styles.calories}>{calories} kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EBEBEB",
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

  thumbnailContainer: {
    width: 48,
    height: 48,
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

  tag: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#8E8E93",
    marginBottom: 3,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  nutrition: {
    alignItems: "flex-end",
    marginLeft: 10,
  },

  calories: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
});

