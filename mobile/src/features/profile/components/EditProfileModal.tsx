import React from "react";
import { colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
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

import type {
  ActivityLevelType,
  DietaryRestriction,
  FitnessGoalType,
  GenderType,
  HealthCondition,
  UserProfileResponse,
} from "../types";

interface Props {
  visible: boolean;
  profile: UserProfileResponse;
  name: string;
  restrictions: DietaryRestriction[];
  healthConditions: HealthCondition[];
  loading?: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    age: number;
    gender: GenderType;
    heightCm: number;
    currentWeightKg: number;
    targetWeightKg: number | null;
    fitnessGoal: FitnessGoalType;
    activityLevel: ActivityLevelType;
    dietaryRestrictionIds: number[];
    healthConditionIds: number[];
  }) => Promise<void>;
}

const genders: { value: GenderType; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

const goals: { value: FitnessGoalType; label: string }[] = [
  { value: "WEIGHT_LOSS", label: "Weight Loss" },
  { value: "MUSCLE_GAIN", label: "Muscle Gain" },
  { value: "MAINTAIN_WEIGHT", label: "Maintain Weight" },
  { value: "BODY_RECOMPOSITION", label: "Body Recomposition" },
  { value: "HEALTHY_WEIGHT_GAIN", label: "Healthy Weight Gain" },
  { value: "GENERAL_HEALTH", label: "General Health" },
  { value: "ATHLETIC_PERFORMANCE", label: "Athletic Performance" },
];

const activities: { value: ActivityLevelType; label: string }[] = [
  { value: "SEDENTARY", label: "Sedentary" },
  { value: "LIGHTLY_ACTIVE", label: "Lightly Active" },
  { value: "MODERATELY_ACTIVE", label: "Moderately Active" },
  { value: "VERY_ACTIVE", label: "Very Active" },
  { value: "EXTRA_ACTIVE", label: "Extra Active" },
];

export default function EditProfileModal({
  visible,
  profile,
  name,
  restrictions,
  healthConditions,
  loading = false,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = React.useState({
    name,
    age: String(profile.age),
    gender: profile.gender,
    heightCm: String(profile.heightCm),
    currentWeightKg: String(profile.currentWeightKg),
    targetWeightKg:
      profile.targetWeightKg == null ? "" : String(profile.targetWeightKg),
    fitnessGoal: profile.fitnessGoal,
    activityLevel: profile.activityLevel,
    dietaryRestrictionIds: profile.dietaryRestrictions.map((x) => x.id),
    healthConditionIds: profile.healthConditions.map((x) => x.id),
  });

  React.useEffect(() => {
    if (!visible) return;

    setForm({
      name,
      age: String(profile.age),
      gender: profile.gender,
      heightCm: String(profile.heightCm),
      currentWeightKg: String(profile.currentWeightKg),
      targetWeightKg:
        profile.targetWeightKg == null ? "" : String(profile.targetWeightKg),
      fitnessGoal: profile.fitnessGoal,
      activityLevel: profile.activityLevel,
      dietaryRestrictionIds: profile.dietaryRestrictions.map((x) => x.id),
      healthConditionIds: profile.healthConditions.map((x) => x.id),
    });
  }, [visible, profile, name]);

  const toggleId = (current: number[], id: number): number[] =>
    current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];

  const handleSave = async () => {
    const age = Number(form.age);
    const heightCm = Number(form.heightCm);
    const currentWeightKg = Number(form.currentWeightKg);

    if (!form.name.trim()) {
      return;
    }

    if (!age || !heightCm || !currentWeightKg) {
      return;
    }

    await onSave({
      name: form.name.trim(),
      age,
      gender: form.gender,
      heightCm,
      currentWeightKg,
      targetWeightKg: form.targetWeightKg ? Number(form.targetWeightKg) : null,
      fitnessGoal: form.fitnessGoal,
      activityLevel: form.activityLevel,
      dietaryRestrictionIds: form.dietaryRestrictionIds,
      healthConditionIds: form.healthConditionIds,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Profile</Text>

            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Field
              label="Name"
              value={form.name}
              onChangeText={(value) => setForm((x) => ({ ...x, name: value }))}
            />

            <Field
              label="Age"
              value={form.age}
              keyboardType="numeric"
              onChangeText={(value) => setForm((x) => ({ ...x, age: value }))}
            />

            <Field
              label="Height (cm)"
              value={form.heightCm}
              keyboardType="decimal-pad"
              onChangeText={(value) =>
                setForm((x) => ({ ...x, heightCm: value }))
              }
            />

            <Field
              label="Current Weight (kg)"
              value={form.currentWeightKg}
              keyboardType="decimal-pad"
              onChangeText={(value) =>
                setForm((x) => ({ ...x, currentWeightKg: value }))
              }
            />

            <Field
              label="Target Weight (kg)"
              value={form.targetWeightKg}
              keyboardType="decimal-pad"
              onChangeText={(value) =>
                setForm((x) => ({ ...x, targetWeightKg: value }))
              }
            />

            <Selection
              title="Gender"
              options={genders}
              selected={form.gender}
              onSelect={(value) => setForm((x) => ({ ...x, gender: value }))}
            />

            <Selection
              title="Fitness Goal"
              options={goals}
              selected={form.fitnessGoal}
              onSelect={(value) =>
                setForm((x) => ({ ...x, fitnessGoal: value }))
              }
            />

            <Selection
              title="Activity Level"
              options={activities}
              selected={form.activityLevel}
              onSelect={(value) =>
                setForm((x) => ({ ...x, activityLevel: value }))
              }
            />

            <Text style={styles.sectionLabel}>Dietary Restrictions</Text>

            <View style={styles.chips}>
              {restrictions.map((item) => {
                const selected = form.dietaryRestrictionIds.includes(item.id);

                return (
                  <Chip
                    key={item.id}
                    label={item.name}
                    selected={selected}
                    onPress={() =>
                      setForm((x) => ({
                        ...x,
                        dietaryRestrictionIds: toggleId(
                          x.dietaryRestrictionIds,
                          item.id,
                        ),
                      }))
                    }
                  />
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>Health Conditions</Text>

            <View style={styles.chips}>
              {healthConditions.map((item) => {
                const selected = form.healthConditionIds.includes(item.id);

                return (
                  <Chip
                    key={item.id}
                    label={item.name}
                    selected={selected}
                    onPress={() =>
                      setForm((x) => ({
                        ...x,
                        healthConditionIds: toggleId(
                          x.healthConditionIds,
                          item.id,
                        ),
                      }))
                    }
                  />
                );
              })}
            </View>

            <Pressable
              style={styles.saveButton}
              disabled={loading}
              onPress={handleSave}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveText}>Save Changes</Text>
              )}
            </Pressable>
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
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "numeric" | "decimal-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={colors.secondaryText}
      />
    </View>
  );
}

function Selection<T extends string>({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{title}</Text>

      <View style={styles.chips}>
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={selected === option.value}
            onPress={() => onSelect(option.value)}
          />
        ))}
      </View>
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.selectedChip]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.selectedChipText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modal: {
    maxHeight: "92%",
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  title: {
    fontSize: 21,
    fontWeight: "700",
    color: colors.text,
  },

  field: {
    marginBottom: 17,
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

  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  selectedChip: {
    backgroundColor: "#E5F2E7",
    borderColor: "#9CC9A3",
  },

  chipText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  selectedChipText: {
    color: "#2E7D32",
  },

  saveButton: {
    height: 48,
    borderRadius: 13,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
