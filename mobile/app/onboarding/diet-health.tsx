import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import Button from "@/components/Button";
import { colors } from "@/constants/colors";
import { profileService } from "@/features/profile/services/profileService";
import { useOnboarding } from "@/features/profile/context/OnboardingContext";
import { nutritionService } from "@/features/nutrition/services/nutritionService";

import type {
  DietaryRestriction,
  HealthCondition,
  UpdateUserProfileRequest,
} from "@/features/profile/types";

export default function DietHealthScreen() {
  const { data, updateData } = useOnboarding();

  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([]);

  const [conditions, setConditions] = useState<HealthCondition[]>([]);

  const [selectedRestrictions, setSelectedRestrictions] = useState<number[]>(
    data.dietaryRestrictionIds,
  );

  const [selectedConditions, setSelectedConditions] = useState<number[]>(
    data.healthConditionIds,
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions() {
    try {
      const [restrictionData, conditionData] = await Promise.all([
        profileService.getDietaryRestrictions(),
        profileService.getHealthConditions(),
      ]);

      setRestrictions(restrictionData);
      setConditions(conditionData);
    } catch (error) {
      console.error(error);

      Alert.alert("Unable to load options", "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleRestriction(id: number) {
    setSelectedRestrictions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function toggleCondition(id: number) {
    setSelectedConditions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function handleComplete() {
    if (
      data.age === null ||
      data.gender === null ||
      data.heightCm === null ||
      data.currentWeightKg === null ||
      data.fitnessGoal === null ||
      data.activityLevel === null
    ) {
      Alert.alert("Incomplete Profile", "Please complete the previous steps.");
      return;
    }

    setSaving(true);

    try {
      const request: UpdateUserProfileRequest = {
        age: data.age,
        gender: data.gender,
        heightCm: data.heightCm,
        currentWeightKg: data.currentWeightKg,
        targetWeightKg: data.targetWeightKg,
        fitnessGoal: data.fitnessGoal,
        activityLevel: data.activityLevel,
        dietaryRestrictionIds: selectedRestrictions,
        healthConditionIds: selectedConditions,
      };

      updateData({
        dietaryRestrictionIds: selectedRestrictions,
        healthConditionIds: selectedConditions,
      });

      await profileService.updateProfile(request);

      await nutritionService.calculateTarget();

      router.replace("/main/dashboard");
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Setup Failed",
        "We could not save your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading options...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.step}>STEP 3 OF 3</Text>

        <Text style={styles.title}>Diet & health</Text>

        <Text style={styles.subtitle}>
          Select all that apply. You can change these later from your profile.
        </Text>

        <Text style={styles.label}>Dietary Restrictions</Text>

        <View style={styles.options}>
          {restrictions.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => toggleRestriction(item.id)}
              style={[
                styles.option,
                selectedRestrictions.includes(item.id) && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedRestrictions.includes(item.id) &&
                    styles.selectedOptionText,
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Health Conditions</Text>

        <View style={styles.options}>
          {conditions.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => toggleCondition(item.id)}
              style={[
                styles.option,
                selectedConditions.includes(item.id) && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedConditions.includes(item.id) &&
                    styles.selectedOptionText,
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Button
          title="Complete Setup"
          loading={saving}
          onPress={handleComplete}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 24,
    paddingBottom: 40,
  },

  step: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.secondaryText,
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondaryText,
    marginTop: 7,
    marginBottom: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 25,
  },

  option: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  selectedOption: {
    backgroundColor: "#E5F2E7",
    borderColor: "#9CC9A3",
  },

  optionText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  selectedOptionText: {
    color: "#2E7D32",
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: colors.secondaryText,
  },
});
