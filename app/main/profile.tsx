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

import BottomNav from "@/components/BottomNav";
import { colors } from "@/constants/colors";

import ProfileCard from "@/features/profile/components/ProfileCard";
import ProfileSettingRow from "@/features/profile/components/ProfileSettingRow";
import SettingsRow from "@/features/profile/components/SettingsRow";

export default function ProfileScreen() {
  const [mealReminders, setMealReminders] = useState(true);

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing will be connected later.");
  };

  const handleAdjustCalories = () => {
    Alert.alert(
      "Daily Calorie Target",
      "Calorie target adjustment will be connected later.",
    );
  };

  const handleDietaryPreference = () => {
    Alert.alert(
      "Dietary Preference",
      "Preference selection will be connected later.",
    );
  };

  const handleHealthConditions = () => {
    Alert.alert(
      "Health Conditions",
      "Health condition editing will be connected later.",
    );
  };

  const handleExportData = () => {
    Alert.alert("Export My Data", "Data export will be connected later.");
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
        onPress: () => {
          // Authentication will be connected later.
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. Your account and nutrition data will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            // Account deletion will be connected later.
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
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
          {/* Profile Card */}
          <ProfileCard onEditProfile={handleEditProfile} />

          {/* Nutrition & Health Profile */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                NUTRITION & HEALTH PROFILE
              </Text>
            </View>

            <View style={styles.syncedStatus}>
              <View style={styles.syncedDot} />

              <Text style={styles.syncedText}>Synced with 3D Scanner</Text>
            </View>
          </View>

          <View style={styles.card}>
            {/* Daily Calories */}
            <ProfileSettingRow
              title="Daily Calorie Target"
              value="2,000 kcal / day"
              rightText="Adjust"
              onPress={handleAdjustCalories}
            />

            {/* Dietary Preference */}
            <View style={styles.dietaryRow}>
              <Text style={styles.rowTitle}>Dietary Preference</Text>

              <Text style={styles.rowValue}>Vegetarian</Text>

              <View style={styles.preferenceOptions}>
                <Pressable
                  style={[styles.preferenceOption, styles.selectedPreference]}
                  onPress={handleDietaryPreference}
                >
                  <Text
                    style={[
                      styles.preferenceText,
                      styles.selectedPreferenceText,
                    ]}
                  >
                    Veg
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.preferenceOption}
                  onPress={handleDietaryPreference}
                >
                  <Text style={styles.preferenceText}>Vegan</Text>
                </Pressable>

                <Pressable
                  style={styles.preferenceOption}
                  onPress={handleDietaryPreference}
                >
                  <Text style={styles.preferenceText}>Non-Veg</Text>
                </Pressable>
              </View>
            </View>

            {/* Activity */}
            <ProfileSettingRow
              title="Activity Level"
              value="Moderate (3–5 workouts/wk)"
              showChevron
            />

            {/* Age & Weight */}
            <ProfileSettingRow
              title="Age & Weight"
              value="28 yrs · 59.0 kg"
              showChevron
            />

            {/* Health Conditions */}
            <ProfileSettingRow
              title="Health Conditions"
              value="None reported"
              rightText="Edit"
              onPress={handleHealthConditions}
            />
          </View>

          {/* Settings */}
          <View style={styles.sectionHeaderOnly}>
            <Text style={styles.sectionTitle}>SETTINGS</Text>
          </View>

          <View style={styles.card}>
            <SettingsRow
              title="Meal Reminders & Alerts"
              subtitle="Notifications for breakfast, lunch & dinner"
              icon="notifications-outline"
              toggle
              toggleValue={mealReminders}
              onToggle={setMealReminders}
            />

            <SettingsRow
              title="Export My Data"
              subtitle="Download logs as CSV or JSON report"
              icon="download-outline"
              showChevron
              onPress={handleExportData}
            />
          </View>

          {/* Account */}
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

          {/* Delete Account - visually separated */}
          <View style={styles.deleteCard}>
            <SettingsRow
              title="Delete Account"
              subtitle="Permanently delete your account and data"
              icon="trash-outline"
              showChevron
              destructive
              onPress={handleDeleteAccount}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.version}>
              NutriVision-3D v1.0.4 · Production Build
            </Text>

            <Pressable>
              <Text style={styles.legalText}>
                Privacy Policy & Terms of Service
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNav active="profile" />
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 27,
    marginBottom: 12,
    gap: 10,
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

  syncedStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  syncedDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#2E7D32",
  },

  syncedText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#2E7D32",
  },

  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 17,
  },

  dietaryRow: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  rowTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  rowValue: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 4,
  },

  preferenceOptions: {
    flexDirection: "row",
    gap: 7,
    marginTop: 11,
  },

  preferenceOption: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  selectedPreference: {
    backgroundColor: "#E5F2E7",
    borderColor: "#9CC9A3",
  },

  preferenceText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  selectedPreferenceText: {
    color: "#2E7D32",
  },

  accountCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 17,
  },

  deleteCard: {
    backgroundColor: "#FFF9F8",
    borderWidth: 1,
    borderColor: "#F3D5D1",
    borderRadius: 18,
    paddingHorizontal: 17,
    marginTop: 12,
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
});
