import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import { colors } from "../../src/constants/colors";
import AuthHeader from "../../src/features/auth/components/AuthHeader";

export default function SignupScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}
          <AuthHeader
            title="Create your account"
            subtitle="Start your personalized nutrition journey."
          />

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <Input
              label="Full name"
              placeholder="Enter your full name"
              autoCapitalize="words"
            />

            {/* Email */}
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
            />

            {/* Password */}
            <Input
              label="Password"
              placeholder="Create a password"
              isPassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Confirm Password */}
            <Input
              label="Confirm password"
              placeholder="Re-enter your password"
              isPassword
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />

            {/* Create Account */}
            <Button
              title="Create account"
              onPress={() => router.replace("/main/dashboard")}
            />

            {/* Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>

              <Pressable onPress={() => router.push("/auth/login")}>
                <Text style={styles.loginLink}>Log in</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 40,
  },

  form: {
    width: "100%",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 26,
    paddingBottom: 10,
  },

  loginText: {
    fontSize: 14,
    color: colors.secondaryText,
  },

  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
});
