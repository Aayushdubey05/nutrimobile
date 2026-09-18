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
import ErrorMessage from "../../src/components/ErrorMessage";
import Input from "../../src/components/Input";
import { colors } from "../../src/constants/colors";
import AuthHeader from "../../src/features/auth/components/AuthHeader";
import { useAuth } from "../../src/features/auth/hooks/useAuth";
import { validateSignupForm } from "../../src/features/auth/validation";

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");

    const validationError = validateSignupForm({
      name,
      email,
      password,
      confirmPassword,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      router.replace("/main/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create account";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

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
          <AuthHeader
            title="Create your account"
            subtitle="Start your personalized nutrition journey."
          />

          <View style={styles.form}>
            {/* Name */}
            <Input
              label="Full name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />

            {/* Email */}
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoComplete="email"
              editable={!loading}
            />

            {/* Password */}
            <Input
              label="Password"
              placeholder="Create a password"
              isPassword
              showPassword={showPassword}
              onTogglePassword={() =>
                setShowPassword(!showPassword)
              }
              value={password}
              onChangeText={setPassword}
              autoComplete="new-password"
              editable={!loading}
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
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoComplete="new-password"
              editable={!loading}
            />

            {/* Error */}
            {error ? <ErrorMessage message={error} /> : null}

            {/* Create Account */}
            <Button
              title="Create account"
              onPress={handleSignup}
              loading={loading}
            />

            {/* Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?{" "}
              </Text>

              <Pressable
                onPress={() => router.push("/auth/login")}
                disabled={loading}
              >
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