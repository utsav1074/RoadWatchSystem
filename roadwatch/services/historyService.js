import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/api";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");

  if (!token) throw new Error("NO_TOKEN");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getHistory = async () => {
  const headers = await getAuthHeader();

  const response = await fetch(`${BASE_URL}/history`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const data = await response.json();

  return { response, data };
};
