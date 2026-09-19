import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../constants/colors";

interface MacroSummaryProps {
  label: string;
  consumed: number;
  target: number;
}

function MacroSummary({ label, consumed, target }: MacroSummaryProps) {
  const safeTarget = target > 0 ? target : 1;
  const progress = Math.min(consumed / safeTarget, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>
        {Math.round(consumed)}g
        <Text style={styles.target}> / {Math.round(target)}g</Text>
      </Text>

      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            {
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

interface MacroSummaryRowProps {
  protein: number;
  proteinTarget: number;
  carbs: number;
  carbsTarget: number;
  fat: number;
  fatTarget: number;
}

export default function MacroSummaryRow({
  protein,
  proteinTarget,
  carbs,
  carbsTarget,
  fat,
  fatTarget,
}: MacroSummaryRowProps) {
  return (
    <View style={styles.row}>
      <MacroSummary label="Protein" consumed={protein} target={proteinTarget} />

      <MacroSummary label="Carbs" consumed={carbs} target={carbsTarget} />

      <MacroSummary label="Fat" consumed={fat} target={fatTarget} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  container: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 4,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  target: {
    color: colors.secondaryText,
    fontWeight: "400",
  },

  track: {
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8,
  },

  progress: {
    height: "100%",
    backgroundColor: colors.text,
    borderRadius: 999,
  },
});
