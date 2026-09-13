import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../constants/colors";

interface NutritionMacroCardProps {
  label: string;
  value: string;
  progress: number;
  indicatorColor: string;
}

export default function NutritionMacroCard({
  label,
  value,
  progress,
  indicatorColor,
}: NutritionMacroCardProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{value}</Text>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progress,
            {
              width: `${safeProgress * 100}%`,
              backgroundColor: indicatorColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 92,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    justifyContent: "space-between",
  },

  label: {
    fontSize: 12,
    color: colors.secondaryText,
  },

  value: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginTop: 6,
  },

  progressTrack: {
    height: 4,
    width: "100%",
    backgroundColor: "#EDEDED",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 12,
  },

  progress: {
    height: "100%",
    borderRadius: 2,
  },
});
