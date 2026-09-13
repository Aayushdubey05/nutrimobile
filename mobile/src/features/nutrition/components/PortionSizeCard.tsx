import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../constants/colors";

interface PortionPreset {
  value: number;
  label: string;
}

interface PortionSizeCardProps {
  portion: number;
  onDecrease: () => void;
  onIncrease: () => void;
  selectedPreset: number;
  onPresetSelect: (value: number) => void;
}

const PRESETS: PortionPreset[] = [
  {
    value: 150,
    label: "Small",
  },
  {
    value: 250,
    label: "Std",
  },
  {
    value: 350,
    label: "Large",
  },
];

export default function PortionSizeCard({
  portion,
  onDecrease,
  onIncrease,
  selectedPreset,
  onPresetSelect,
}: PortionSizeCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Portion Size</Text>

      <Text style={styles.serving}>1 medium serving</Text>

      <View style={styles.amountRow}>
        <Pressable onPress={onDecrease} style={styles.roundButton} hitSlop={8}>
          <Ionicons name="remove" size={22} color={colors.text} />
        </Pressable>

        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{portion}</Text>

          <Text style={styles.unit}>g</Text>
        </View>

        <Pressable onPress={onIncrease} style={styles.roundButton} hitSlop={8}>
          <Ionicons name="add" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.presetsRow}>
        {PRESETS.map((preset) => {
          const selected = selectedPreset === preset.value;

          return (
            <Pressable
              key={preset.value}
              onPress={() => onPresetSelect(preset.value)}
              style={[styles.preset, selected && styles.selectedPreset]}
            >
              <Text
                style={[
                  styles.presetValue,
                  selected && styles.selectedPresetText,
                ]}
              >
                {preset.value}g
              </Text>

              <Text
                style={[
                  styles.presetLabel,
                  selected && styles.selectedPresetText,
                ]}
              >
                {preset.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 18,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },

  serving: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  amountContainer: {
    minWidth: 130,
    alignItems: "center",
    justifyContent: "center",
  },

  amount: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "700",
    color: colors.text,
  },

  unit: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: -2,
  },

  presetsRow: {
    flexDirection: "row",
    gap: 8,
  },

  preset: {
    flex: 1,
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedPreset: {
    borderWidth: 2,
    borderColor: colors.text,
    backgroundColor: colors.white,
  },

  presetValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  presetLabel: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 2,
  },

  selectedPresetText: {
    color: colors.text,
  },
});
