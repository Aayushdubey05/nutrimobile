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

import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import { colors } from "@/constants/colors";
import AuthHeader from "@/features/auth/components/AuthHeader";

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
            title="Welcome back"
            subtitle="Log in to continue tracking your meals."
          />

          {/* Form */}
          <View style={styles.form}>
            {/* Email */}
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
            />

            {/* Password */}
            <Input
              label="Password"
              placeholder="Enter your password"
              isPassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Error */}
            <ErrorMessage message="Invalid email or password" />

            {/* Forgot password */}
            <Pressable
              style={styles.forgotButton}
              onPress={() => router.push("/auth/forgot-password")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            {/* Login */}
            <Button title="Login" onPress={() => {}} />

            {/* Sign up */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>

              <Pressable onPress={() => router.push("/auth/signup")}>
                <Text style={styles.signupLink}>Sign up</Text>
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
    paddingTop: 62,
    paddingBottom: 40,
  },

  form: {
    width: "100%",
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 24,
    paddingVertical: 4,
  },

  forgotText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  signupText: {
    fontSize: 14,
    color: colors.secondaryText,
  },

  signupLink: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
});
