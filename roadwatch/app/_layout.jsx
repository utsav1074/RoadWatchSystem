import "../global.css";
import { Stack } from "expo-router";
import GlobalNotificationHandler from "../components/GlobalNotificationHandler";

export default function RootLayout() {
  return (
    <>
      {/* GLOBAL NOTIFICATION HANDLER */}
      <GlobalNotificationHandler />

      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />

        {/* User Tabs */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
