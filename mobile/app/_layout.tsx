import { Stack } from "expo-router";

import { AuthProvider } from "../src/context/AuthContext";
import { QueryProvider } from "../src/providers/QueryProvider";
import { OnboardingProvider } from "@/features/profile/context/OnboardingContext";

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <OnboardingProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </OnboardingProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
