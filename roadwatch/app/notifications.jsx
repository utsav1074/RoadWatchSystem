import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { fetchNotifications } from "../services/notificationService";

export default function Notifications() {
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FORMAT TIME =================
  const formatTime = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const time = new Date(dateString);
    const diffMs = now - time;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return time.toLocaleString();
  };

  // ================= GET TITLE =================
  const getTitle = (message) => {
    const text = (message || "").toLowerCase();

    if (text.includes("accepted")) return "Report Accepted";
    if (text.includes("rejected")) return "Report Rejected";
    if (text.includes("fine") || text.includes("fined")) return "Fine Issued";

    return "Notification";
  };

  // ================= LOAD NOTIFICATIONS =================
  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data = await fetchNotifications();

      const formatted = data.map((item) => ({
        id: String(item.notification_id),
        title: getTitle(item.notification_message),
        message: item.notification_message,
        time: formatTime(item.notification_time),
      }));

      setNotifications(formatted);
    } catch (err) {
      console.log("Notification fetch error:", err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, []),
  );

  const renderItem = ({ item }) => (
    <View className="bg-white p-4 rounded-2xl mb-3 shadow-sm">
      <Text className="text-base font-semibold text-gray-900">
        {item.title}
      </Text>
      <Text className="text-sm text-gray-600 mt-1">{item.message}</Text>
      <Text className="text-xs text-gray-400 mt-2">{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FBFCFE]">
      {/* HEADER */}
      <View className="flex-row items-center px-5 py-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text className="ml-4 text-lg font-semibold text-gray-900">
          Notifications
        </Text>
      </View>

      {/* BODY */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2460B9" />
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-base font-semibold text-gray-800">
            No notifications yet
          </Text>
          <Text className="text-sm text-gray-500 mt-2 text-center">
            Your notifications will appear here once there is an update on your
            reports or fines.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
