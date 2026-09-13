import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../constants/colors";

interface MealCardProps {
  mealType: string;
  time: string;
  name: string;
  calories: number;
  imageUrl: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MealCard({
  mealType,
  time,
  name,
  calories,
  imageUrl,
  onEdit,
  onDelete,
}: MealCardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.mealType}>
            {mealType} · {time}
          </Text>

          <View style={styles.actions}>
            <Pressable onPress={onEdit} hitSlop={8} style={styles.actionButton}>
              <Ionicons name="pencil-outline" size={16} color={colors.icon} />
            </Pressable>

            <Pressable
              onPress={onDelete}
              hitSlop={8}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={16} color={colors.icon} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.calories}>{calories} kcal</Text>

          <View style={styles.vegetarianBadge}>
            <Ionicons name="leaf-outline" size={11} color="#397A45" />

            <Text style={styles.vegetarianText}>Vegetarian</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    marginBottom: 10,
  },

  thumbnail: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: "#E4E0DB",
  },

  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
    minHeight: 76,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mealType: {
    flex: 1,
    fontSize: 10,
    fontWeight: "600",
    color: colors.secondaryText,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 8,
  },

  actionButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginTop: 5,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },

  calories: {
    fontSize: 12,
    color: colors.secondaryText,
  },

  vegetarianBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF8F0",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 4,
    gap: 3,
  },

  vegetarianText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#397A45",
  },
});
