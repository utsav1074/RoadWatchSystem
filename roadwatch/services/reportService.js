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

// ================= PARSE RESPONSE =================
const parseResponse = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

// ================= VERIFY PLATE IMAGE =================
export const verifyPlateImage = async (formData) => {
  const headers = await getAuthHeader();

  const response = await fetch(`${BASE_URL}/report/verify-plate`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await parseResponse(response);

  return { response, data };
};

// ================= SUBMIT REPORT =================
export const submitReport = async (formData) => {
  const headers = await getAuthHeader();

  const response = await fetch(`${BASE_URL}/report`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await parseResponse(response);

  return { response, data };
};
