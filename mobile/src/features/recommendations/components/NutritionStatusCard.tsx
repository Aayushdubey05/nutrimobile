import { colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

interface NutritionStatusCardProps {
  consumed: number;
  target: number;
  remaining: number;
}

export default function NutritionStatusCard({
  consumed,
  target,
  remaining,
}: NutritionStatusCardProps) {
  const progress = Math.min(consumed / target, 1);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>TODAY'S INTAKE STATUS</Text>

      <View style={styles.valueRow}>
        <Text style={styles.calories}>
          {consumed.toLocaleString()} / {target.toLocaleString()} kcal
        </Text>

        <View style={styles.remainingPill}>
          <Text style={styles.remainingText}>{remaining} kcal left</Text>
        </View>
      </View>

      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
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
    padding: 18,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: colors.secondaryText,
    marginBottom: 12,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  calories: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  remainingPill: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  remainingText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  progressBackground: {
    height: 8,
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },

  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
});
