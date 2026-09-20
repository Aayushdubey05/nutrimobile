import { colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

interface MacroAverageCardProps {
  proteinG: number;
  targetProteinG: number;

  carbohydratesG: number;
  targetCarbohydratesG: number;

  fatG: number;
  targetFatG: number;
}

export default function MacroAverageCard({
  proteinG,
  targetProteinG,
  carbohydratesG,
  targetCarbohydratesG,
  fatG,
  targetFatG,
}: MacroAverageCardProps) {
  const macros = [
    {
      name: "Protein",
      amount: `${Math.round(proteinG)}g / ${Math.round(targetProteinG)}g goal`,
      percentage:
        targetProteinG > 0 ? Math.round((proteinG / targetProteinG) * 100) : 0,
    },
    {
      name: "Carbohydrates",
      amount: `${Math.round(carbohydratesG)}g / ${Math.round(targetCarbohydratesG)}g goal`,
      percentage:
        targetCarbohydratesG > 0
          ? Math.round((carbohydratesG / targetCarbohydratesG) * 100)
          : 0,
    },
    {
      name: "Healthy Fats",
      amount: `${Math.round(fatG)}g / ${Math.round(targetFatG)}g goal`,
      percentage: targetFatG > 0 ? Math.round((fatG / targetFatG) * 100) : 0,
    },
  ];

  return (
    <View style={styles.card}>
      {macros.map((macro, index) => {
        const progress = Math.min(macro.percentage, 100);

        return (
          <View
            key={macro.name}
            style={[
              styles.macroRow,
              index === macros.length - 1 && styles.macroRowLast,
            ]}
          >
            <View style={styles.topRow}>
              <View>
                <Text style={styles.name}>{macro.name}</Text>

                <Text style={styles.amount}>{macro.amount}</Text>
              </View>

              <Text style={styles.percentage}>
                {macro.percentage}% of target
              </Text>
            </View>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
  },

  macroRow: {
    paddingBottom: 18,
    marginBottom: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  macroRowLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  amount: {
    marginTop: 4,
    fontSize: 12,
    color: colors.secondaryText,
  },

  percentage: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  progressBackground: {
    height: 7,
    marginTop: 12,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: colors.background,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.text,
  },
});
