import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { fetchLatestNotification } from "../services/notificationService";

export default function GlobalNotificationHandler() {
  const lastNotificationIdRef = useRef(null);
  const initializedRef = useRef(false);
  const isCheckingRef = useRef(false);

  const router = useRouter();

  // ================= GLOBAL NOTIFICATION CHECK =================
  const checkNotifications = async () => {
    try {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;

      const latest = await fetchLatestNotification();

      if (!latest) {
        initializedRef.current = true;
        return;
      }

      // first fetch -> no alert
      if (!initializedRef.current) {
        lastNotificationIdRef.current = latest.notification_id;
        initializedRef.current = true;
        return;
      }

      // new notification
      if (latest.notification_id !== lastNotificationIdRef.current) {
        lastNotificationIdRef.current = latest.notification_id;

        Alert.alert("New Notification", latest.notification_message, [
          {
            text: "View",
            onPress: () => router.push("/notifications"),
          },
          {
            text: "Later",
            style: "cancel",
          },
        ]);
      }
    } catch (err) {
      console.log("Global notification check error:", err.message);
    } finally {
      isCheckingRef.current = false;
    }
  };

  // ================= POLLING =================
  useEffect(() => {
    checkNotifications();

    const interval = setInterval(() => {
      checkNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
