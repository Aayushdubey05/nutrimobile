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

import BottomNav from "@/components/BottomNav";
import { colors } from "@/constants/colors";
import { useAuth } from "@/features/auth/hooks/useAuth";

import CalorieTargetModal from "@/features/profile/components/CalorieTargetModal";
import EditProfileModal from "@/features/profile/components/EditProfileModal";
import ProfileCard from "@/features/profile/components/ProfileCard";
import ProfileSettingRow from "@/features/profile/components/ProfileSettingRow";
import SettingsRow from "@/features/profile/components/SettingsRow";
import { profileService } from "@/features/profile/services/profileService";

import type {
  DietaryRestriction,
  HealthCondition,
  NutritionTargetResponse,
  UserProfileResponse,
} from "@/features/profile/types";

export default function ProfileScreen() {
  const { user, refreshUser, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [nutritionTarget, setNutritionTarget] =
    useState<NutritionTargetResponse | null>(null);

  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([]);
  const [healthConditions, setHealthConditions] = useState<HealthCondition[]>(
    [],
  );

  const [mealReminders, setMealReminders] = useState(true);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingTarget, setSavingTarget] = useState(false);

  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [calorieModalVisible, setCalorieModalVisible] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const profileData = await profileService.getProfile().catch((err) => {
        if (err.response?.status === 404) return null; // Profile not initialized yet
        throw err;
      });

      const settingsData = await profileService.getSettings().catch(() => ({
        notificationsEnabled: true,
      }));

      const [restrictionsData, conditionsData] = await Promise.all([
        profileService.getDietaryRestrictions(),
        profileService.getHealthConditions(),
      ]);

      if (!profileData) {
        // Prompt user to edit/complete profile setup
        setEditProfileVisible(true);
      } else {
        setProfile(profileData);
      }

      setMealReminders(settingsData.notificationsEnabled);
      setRestrictions(restrictionsData);
      setHealthConditions(conditionsData);

      try {
        let target = await profileService.getNutritionTarget().catch(() => null);
        if (!target && profileData) {
          target = await profileService.calculateNutritionTarget().catch(() => null);
        }
        setNutritionTarget(target);
      } catch {
        setNutritionTarget(null);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      Alert.alert("Unable to Load Profile", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (data: {
    name: string;
    age: number;
    gender: any;
    heightCm: number;
    currentWeightKg: number;
    targetWeightKg: number | null;
    fitnessGoal: any;
    activityLevel: any;
    dietaryRestrictionIds: number[];
    healthConditionIds: number[];
  }) => {
    try {
      setSavingProfile(true);

      const updatedProfile = await profileService.updateProfile({
        age: data.age,
        gender: data.gender,
        heightCm: data.heightCm,
        currentWeightKg: data.currentWeightKg,
        targetWeightKg: data.targetWeightKg,
        fitnessGoal: data.fitnessGoal,
        activityLevel: data.activityLevel,
        dietaryRestrictionIds: data.dietaryRestrictionIds,
        healthConditionIds: data.healthConditionIds,
      });

      if (data.name.trim() !== user?.name) {
        await profileService.updateUser({
          name: data.name.trim(),
        });

        await refreshUser();
      }

      setProfile(updatedProfile);
      setEditProfileVisible(false);

      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully.",
      );
    } catch (error) {
      console.error("Failed to update profile:", error);

      Alert.alert(
        "Update Failed",
        "Could not update your profile. Please try again.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleReminderToggle = async (value: boolean) => {
    const previousValue = mealReminders;

    setMealReminders(value);

    try {
      await profileService.updateSettings({
        notificationsEnabled: value,
      });
    } catch (error) {
      console.error("Failed to update notification setting:", error);

      setMealReminders(previousValue);

      Alert.alert("Update Failed", "Could not update notification settings.");
    }
  };

  const handleSaveTarget = async (data: {
    calorieTargetKcal: number;
    proteinTargetG: number;
    carbohydrateTargetG: number;
    fatTargetG: number;
  }) => {
    try {
      setSavingTarget(true);

      const updated = await profileService.updateNutritionTarget(data);

      setNutritionTarget(updated);
      setCalorieModalVisible(false);

      Alert.alert(
        "Target Updated",
        "Your daily nutrition target has been updated.",
      );
    } catch (error) {
      console.error("Failed to update target:", error);

      Alert.alert("Update Failed", "Could not update your nutrition target.");
    } finally {
      setSavingTarget(false);
    }
  };

  const handleRecalculateTarget = async () => {
    try {
      setSavingTarget(true);

      const updated = await profileService.calculateNutritionTarget();

      setNutritionTarget(updated);
      setCalorieModalVisible(false);

      Alert.alert(
        "Target Recalculated",
        "Your nutrition target was recalculated using your current profile.",
      );
    } catch (error) {
      console.error("Failed to calculate target:", error);

      Alert.alert(
        "Calculation Failed",
        "Please make sure your profile is complete.",
      );
    } finally {
      setSavingTarget(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  if (loading || !profile || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.text} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dietaryNames = profile.dietaryRestrictions.map((item) => item.name);

  const healthNames = profile.healthConditions.map((item) => item.name);

  const activityLabels: Record<string, string> = {
    SEDENTARY: "Sedentary",
    LIGHTLY_ACTIVE: "Lightly active",
    MODERATELY_ACTIVE: "Moderate",
    VERY_ACTIVE: "Very active",
    EXTRA_ACTIVE: "Extra active",
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Profile & Settings</Text>

            <Text style={styles.subtitle}>
              Manage your preferences and dietary goals
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileCard
            name={user.name}
            email={user.email}
            dietaryRestrictions={dietaryNames}
            onEditProfile={() => setEditProfileVisible(true)}
          />

          <View style={styles.sectionHeaderOnly}>
            <Text style={styles.sectionTitle}>NUTRITION & HEALTH PROFILE</Text>
          </View>

          <View style={styles.card}>
            <ProfileSettingRow
              title="Daily Calorie Target"
              value={
                nutritionTarget
                  ? `${Math.round(
                      nutritionTarget.calorieTargetKcal,
                    )} kcal / day`
                  : "Not calculated"
              }
              rightText="Adjust"
              onPress={() => setCalorieModalVisible(true)}
            />

            <ProfileSettingRow
              title="Dietary Preference"
              value={
                dietaryNames.length > 0
                  ? dietaryNames.join(", ")
                  : "None reported"
              }
              rightText="Edit"
              onPress={() => setEditProfileVisible(true)}
            />

            <ProfileSettingRow
              title="Activity Level"
              value={activityLabels[profile.activityLevel]}
              showChevron
              onPress={() => setEditProfileVisible(true)}
            />

            <ProfileSettingRow
              title="Age & Weight"
              value={`${profile.age} yrs · ${profile.currentWeightKg} kg`}
              showChevron
              onPress={() => setEditProfileVisible(true)}
            />

            <ProfileSettingRow
              title="Health Conditions"
              value={
                healthNames.length > 0
                  ? healthNames.join(", ")
                  : "None reported"
              }
              rightText="Edit"
              onPress={() => setEditProfileVisible(true)}
            />
          </View>

          <View style={styles.sectionHeaderOnly}>
            <Text style={styles.sectionTitle}>SETTINGS</Text>
          </View>

          <View style={styles.card}>
            <SettingsRow
              title="Meal Reminders & Alerts"
              subtitle="Notification preference"
              icon="notifications-outline"
              toggle
              toggleValue={mealReminders}
              onToggle={handleReminderToggle}
            />
          </View>

          <View style={styles.sectionHeaderOnly}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>
          </View>

          <View style={styles.accountCard}>
            <SettingsRow
              title="Log Out"
              subtitle="Sign out from this account"
              icon="log-out-outline"
              showChevron
              onPress={handleLogout}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>
              NutriVision-3D v1.0.4 · Production Build
            </Text>

            <Text style={styles.legalText}>
              Privacy Policy & Terms of Service
            </Text>
          </View>
        </ScrollView>

        <BottomNav active="profile" />

        <EditProfileModal
          visible={editProfileVisible}
          profile={profile}
          name={user.name}
          restrictions={restrictions}
          healthConditions={healthConditions}
          loading={savingProfile}
          onClose={() => setEditProfileVisible(false)}
          onSave={handleSaveProfile}
        />

        <CalorieTargetModal
          visible={calorieModalVisible}
          target={nutritionTarget}
          loading={savingTarget}
          onClose={() => setCalorieModalVisible(false)}
          onSave={handleSaveTarget}
          onRecalculate={handleRecalculateTarget}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondaryText,
    marginTop: 5,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 115,
  },

  sectionHeaderOnly: {
    marginTop: 27,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: colors.secondaryText,
  },

  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 17,
  },

  accountCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 17,
  },

  footer: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 10,
  },

  version: {
    fontSize: 10,
    color: colors.secondaryText,
    textAlign: "center",
  },

  legalText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text,
    marginTop: 9,
    textAlign: "center",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: colors.secondaryText,
  },
});
