import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  ActivityLevelType,
  FitnessGoalType,
  GenderType,
} from "../types";

interface OnboardingData {
  age: number | null;
  gender: GenderType | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  targetWeightKg: number | null;

  fitnessGoal: FitnessGoalType | null;
  activityLevel: ActivityLevelType | null;

  dietaryRestrictionIds: number[];
  healthConditionIds: number[];
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  reset: () => void;
}

const initialData: OnboardingData = {
  age: null,
  gender: null,
  heightCm: null,
  currentWeightKg: null,
  targetWeightKg: null,
  fitnessGoal: null,
  activityLevel: null,
  dietaryRestrictionIds: [],
  healthConditionIds: [],
};

const OnboardingContext =
  createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] =
    useState<OnboardingData>(initialData);

  function updateData(
    newData: Partial<OnboardingData>,
  ) {
    setData((current) => ({
      ...current,
      ...newData,
    }));
  }

  function reset() {
    setData(initialData);
  }

  return (
    <OnboardingContext.Provider
      value={{ data, updateData, reset }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      "useOnboarding must be used inside OnboardingProvider",
    );
  }

  return context;
}