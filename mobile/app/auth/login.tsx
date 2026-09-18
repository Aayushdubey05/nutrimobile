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
import { useAuth } from "@/features/auth/hooks/useAuth";
import { validateLoginForm } from "@/features/auth/validation";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");

    const validationError = validateLoginForm({
      email,
      password,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });

      router.replace("/main/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password";

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
            title="Welcome back"
            subtitle="Log in to continue tracking your meals."
          />

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoComplete="email"
              editable={!loading}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              isPassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              value={password}
              onChangeText={setPassword}
              autoComplete="password"
              editable={!loading}
            />

            {error ? <ErrorMessage message={error} /> : null}

            {/* <Pressable
              style={styles.forgotButton}
              onPress={() => router.push("/auth/forgot-password")}
              disabled={loading}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable> */}

            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don't have an account?{" "}
              </Text>

              <Pressable
                onPress={() => router.push("/auth/signup")}
                disabled={loading}
              >
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