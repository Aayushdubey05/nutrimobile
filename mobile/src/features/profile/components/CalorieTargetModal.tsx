import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "@/constants/colors";

import type { NutritionTargetResponse } from "../types";

interface Props {
  visible: boolean;
  target: NutritionTargetResponse | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (data: {
    calorieTargetKcal: number;
    proteinTargetG: number;
    carbohydrateTargetG: number;
    fatTargetG: number;
  }) => Promise<void>;
  onRecalculate: () => Promise<void>;
}

export default function CalorieTargetModal({
  visible,
  target,
  loading = false,
  onClose,
  onSave,
  onRecalculate,
}: Props) {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  useEffect(() => {
    if (!visible || !target) return;

    setCalories(String(target.calorieTargetKcal));
    setProtein(String(target.proteinTargetG));
    setCarbs(String(target.carbohydrateTargetG));
    setFat(String(target.fatTargetG));
  }, [visible, target]);

  const handleSave = async () => {
    if (!calories || !protein || !carbs || !fat) return;

    await onSave({
      calorieTargetKcal: Number(calories),
      proteinTargetG: Number(protein),
      carbohydrateTargetG: Number(carbs),
      fatTargetG: Number(fat),
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Daily Nutrition Target</Text>

            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView>
            <Field
              label="Calories (kcal)"
              value={calories}
              onChangeText={setCalories}
            />

            <Field
              label="Protein (g)"
              value={protein}
              onChangeText={setProtein}
            />

            <Field
              label="Carbohydrates (g)"
              value={carbs}
              onChangeText={setCarbs}
            />

            <Field label="Fat (g)" value={fat} onChangeText={setFat} />

            <Pressable
              style={styles.saveButton}
              disabled={loading}
              onPress={handleSave}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveText}>Save Target</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.recalculateButton}
              disabled={loading}
              onPress={onRecalculate}
            >
              <Text style={styles.recalculateText}>
                Recalculate From My Profile
              </Text>
            </Pressable>

            {target?.customized && (
              <Text style={styles.info}>
                Your current target is manually customized.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modal: {
    maxHeight: "85%",
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 21,
    fontWeight: "700",
    color: colors.text,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 7,
  },

  input: {
    height: 46,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 14,
    color: colors.text,
  },

  saveButton: {
    height: 48,
    borderRadius: 13,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  recalculateButton: {
    height: 46,
    borderRadius: 13,
    backgroundColor: "#E8F3EA",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  recalculateText: {
    color: "#2E7D32",
    fontSize: 13,
    fontWeight: "700",
  },

  info: {
    textAlign: "center",
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 12,
  },
});
