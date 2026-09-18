import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import Input from "@/components/Input";
import Button from "@/components/Button";
import { colors } from "@/constants/colors";
import { useOnboarding } from "@/features/profile/context/OnboardingContext";
import type { GenderType } from "@/features/profile/types";

const genders: {
  label: string;
  value: GenderType;
}[] = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
  {
    label: "Prefer not to say",
    value: "PREFER_NOT_TO_SAY",
  },
];

export default function OnboardingAboutYou() {
  const { data, updateData } = useOnboarding();

  const [age, setAge] = useState(data.age?.toString() ?? "");
  const [height, setHeight] = useState(data.heightCm?.toString() ?? "");
  const [weight, setWeight] = useState(data.currentWeightKg?.toString() ?? "");
  const [targetWeight, setTargetWeight] = useState(
    data.targetWeightKg?.toString() ?? "",
  );
  const [gender, setGender] = useState<GenderType | null>(data.gender);

  function handleNext() {
    const ageValue = Number(age);
    const heightValue = Number(height);
    const weightValue = Number(weight);
    const targetWeightValue = targetWeight ? Number(targetWeight) : null;

    if (!age || !height || !weight || !gender) {
      Alert.alert("Incomplete Profile", "Please complete all required fields.");
      return;
    }

    if (
      ageValue < 1 ||
      ageValue > 150 ||
      heightValue < 50 ||
      heightValue > 300 ||
      weightValue < 1 ||
      weightValue > 500
    ) {
      Alert.alert(
        "Invalid Information",
        "Please enter valid age, height and weight.",
      );
      return;
    }

    if (
      targetWeightValue !== null &&
      (targetWeightValue < 1 || targetWeightValue > 500)
    ) {
      Alert.alert(
        "Invalid Target Weight",
        "Please enter a valid target weight.",
      );
      return;
    }

    updateData({
      age: ageValue,
      gender,
      heightCm: heightValue,
      currentWeightKg: weightValue,
      targetWeightKg: targetWeightValue,
    });

    router.push("/onboarding/goals");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.step}>STEP 1 OF 3</Text>

        <Text style={styles.title}>Tell us about yourself</Text>

        <Text style={styles.subtitle}>
          This information helps us calculate your nutrition targets.
        </Text>

        <Input
          label="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          placeholder="Enter your age"
        />

        <Text style={styles.label}>Gender</Text>

        <View style={styles.options}>
          {genders.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setGender(item.value)}
              style={[
                styles.option,
                gender === item.value && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  gender === item.value && styles.selectedOptionText,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Input
          label="Height (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="decimal-pad"
          placeholder="e.g. 175"
        />

        <Input
          label="Current Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          placeholder="e.g. 65"
        />

        <Input
          label="Target Weight (kg)"
          value={targetWeight}
          onChangeText={setTargetWeight}
          keyboardType="decimal-pad"
          placeholder="Optional"
        />

        <Button title="Continue" onPress={handleNext} />
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
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },

  option: {
    paddingHorizontal: 15,
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
});
