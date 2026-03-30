import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth Screens */}
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />

      {/* User Tabs */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
