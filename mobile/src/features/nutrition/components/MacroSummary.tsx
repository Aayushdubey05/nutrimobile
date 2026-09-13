import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../constants/colors";

interface MacroSummaryProps {
  label: string;
  consumed: number;
  target: number;
}

function MacroSummary({ label, consumed, target }: MacroSummaryProps) {
  const progress = Math.min(consumed / target, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>
        {consumed}g<Text style={styles.target}> / {target}g</Text>
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

export default function MacroSummaryRow() {
  return (
    <View style={styles.row}>
      <MacroSummary label="Protein" consumed={58} target={100} />

      <MacroSummary label="Carbs" consumed={142} target={220} />

      <MacroSummary label="Fat" consumed={44} target={65} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  container: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    color: colors.secondaryText,
    marginBottom: 5,
  },

  value: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  target: {
    fontWeight: "400",
    color: colors.secondaryText,
  },

  track: {
    height: 4,
    backgroundColor: "#ECECEC",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 8,
  },

  progress: {
    height: "100%",
    backgroundColor: colors.text,
    borderRadius: 2,
  },
});
