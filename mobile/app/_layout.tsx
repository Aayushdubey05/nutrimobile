import { Stack } from "expo-router";

import { AuthProvider } from "../src/context/AuthContext";
import { QueryProvider } from "../src/providers/QueryProvider";

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryProvider>
  );
}