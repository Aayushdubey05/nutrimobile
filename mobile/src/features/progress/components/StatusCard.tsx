import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

interface StatusCardProps {
  adherenceDays: number;
  totalDays: number;
  adherencePercentage: number;
  period: "WEEK" | "MONTH";
}

export default function StatusCard({
  adherenceDays,
  totalDays,
  adherencePercentage,
  period,
}: StatusCardProps) {
  const periodLabel = period === "WEEK" ? "this week" : "this month";

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconContainer}>
          <Ionicons name="analytics-outline" size={18} color={colors.text} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Nutrition Consistency</Text>

          <Text style={styles.subtitle}>
            {adherenceDays} of {totalDays} days within your calorie target{" "}
            {periodLabel}.
          </Text>
        </View>
      </View>

      <View style={styles.statusPill}>
        <Text style={styles.statusText}>
          {Math.round(adherencePercentage)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: colors.secondaryText,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.background,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
});
