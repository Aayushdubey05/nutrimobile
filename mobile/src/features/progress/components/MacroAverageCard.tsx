import { colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

interface MacroItem {
  name: string;
  amount: string;
  percentage: number;
}

const MACROS: MacroItem[] = [
  {
    name: "Protein",
    amount: "74g / 100g goal",
    percentage: 74,
  },
  {
    name: "Carbohydrates",
    amount: "170g / 220g goal",
    percentage: 77,
  },
  {
    name: "Healthy Fats",
    amount: "52g / 65g goal",
    percentage: 80,
  },
];

export default function MacroAverageCard() {
  return (
    <View style={styles.card}>
      {MACROS.map((macro, index) => (
        <View
          key={macro.name}
          style={[
            styles.macroRow,
            index === MACROS.length - 1 && styles.macroRowLast,
          ]}
        >
          <View style={styles.topRow}>
            <View>
              <Text style={styles.name}>{macro.name}</Text>

              <Text style={styles.amount}>{macro.amount}</Text>
            </View>

            <Text style={styles.percentage}>{macro.percentage}% of target</Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${macro.percentage}%`,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 17,
  },

  macroRow: {
    marginBottom: 20,
  },

  macroRowLast: {
    marginBottom: 0,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 10,
  },

  name: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },

  amount: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 3,
  },

  percentage: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  progressBackground: {
    height: 7,
    backgroundColor: "#EDEDED",
    borderRadius: 7,
    overflow: "hidden",
    marginTop: 9,
  },

  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 7,
  },
});
