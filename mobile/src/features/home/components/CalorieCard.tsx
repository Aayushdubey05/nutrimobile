import Svg, { Circle } from "react-native-svg";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

interface MacroData {
  current: number;
  target: number;
  unit: string;
}

interface CalorieCardProps {
  consumed: number;
  target: number;
  protein: MacroData;
  carbs: MacroData;
  fat: MacroData;
}

export default function CalorieCard({
  consumed,
  target,
  protein,
  carbs,
  fat,
}: CalorieCardProps) {
  const calorieRatio = target > 0 ? Math.min(Math.max(consumed / target, 0), 1) : 0;

  const size = 124;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - calorieRatio);

  return (
    <View style={styles.card}>
      {/* Left: Circular Calorie Progress Ring */}
      <View style={styles.leftContainer}>
        <View style={styles.ringOuter}>
          <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
            {/* Background Circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Animated/Dynamic Progress Circle */}
            {calorieRatio > 0 && (
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#171717"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(-90 ${center} ${center})`}
              />
            )}
          </Svg>
          <View style={styles.ringInner}>
            <Text style={styles.calorieLabel}>CALORIES</Text>
            <Text style={styles.calorieValue}>{consumed.toLocaleString()}</Text>
            <Text style={styles.calorieTarget}>
              / {target.toLocaleString()} kcal
            </Text>
          </View>
        </View>
      </View>

      {/* Right: Macro Progress Rows */}
      <View style={styles.rightContainer}>
        {/* Protein */}
        <MacroRow
          label="Protein"
          current={protein.current}
          target={protein.target}
          unit={protein.unit}
          barColor="#3B82F6"
          bgColor="#EFF6FF"
        />

        {/* Carbs */}
        <MacroRow
          label="Carbs"
          current={carbs.current}
          target={carbs.target}
          unit={carbs.unit}
          barColor="#10B981"
          bgColor="#ECFDF5"
        />

        {/* Fat */}
        <MacroRow
          label="Fat"
          current={fat.current}
          target={fat.target}
          unit={fat.unit}
          barColor="#F59E0B"
          bgColor="#FFFBEB"
        />
      </View>
    </View>
  );
}

interface MacroRowProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  barColor: string;
  bgColor: string;
}

function MacroRow({
  label,
  current,
  target,
  unit,
  barColor,
  bgColor,
}: MacroRowProps) {
  const progressPercent = Math.min(Math.max((current / target) * 100, 0), 100);

  return (
    <View style={styles.macroRow}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValues}>
          {current} / {target}
          {unit}
        </Text>
      </View>
      <View style={[styles.macroTrack, { backgroundColor: bgColor }]}>
        <View
          style={[
            styles.macroFill,
            { width: `${progressPercent}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,

    // Subtle soft shadow
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },

  leftContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  ringOuter: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  ringInner: {
    alignItems: "center",
    justifyContent: "center",
  },

  calorieLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#8E8E93",
    marginBottom: 2,
  },

  calorieValue: {
    fontSize: 23,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 26,
  },

  calorieTarget: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.secondaryText,
    marginTop: 2,
  },

  rightContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
  },

  macroRow: {
    width: "100%",
  },

  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  macroLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },

  macroValues: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  macroTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
  },

  macroFill: {
    height: "100%",
    borderRadius: 3,
  },
});
