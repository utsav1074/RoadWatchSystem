import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/api";

// ================= GET TOKEN =================
const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

// ================= FETCH ALL NOTIFICATIONS =================
export const fetchNotifications = async () => {
  const token = await getToken();

  if (!token) return [];

  const res = await fetch(`${BASE_URL}/notifications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  return data;
};

// ================= FETCH LATEST NOTIFICATION =================
export const fetchLatestNotification = async () => {
  const data = await fetchNotifications();
  return data[0] || null;
};
