import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/api";

// ================= GET TOKEN =================
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("NO_TOKEN");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ================= SUBMIT REPORT =================
export const submitReport = async (formData) => {
  const headers = await getAuthHeader();

  const response = await fetch(`${BASE_URL}/report`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();

  return { response, data };
};
