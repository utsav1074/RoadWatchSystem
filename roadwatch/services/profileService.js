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

// ================= FETCH PROFILE =================
export const getProfile = async () => {
  const headers = await getAuthHeader();

  const response = await fetch(`${BASE_URL}/profile`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const data = await response.json();

  return { response, data };
};

// ================= UPLOAD IMAGE =================
export const uploadProfileImage = async (formData) => {
  const headers = await getAuthHeader();

  const response = await fetch(`${BASE_URL}/profile/image`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();

  return { response, data };
};

// ================= LINK VEHICLE =================
export const linkVehicle = async (vehicleNumber) => {
  const headers = await getAuthHeader();

  const response = await fetch(`${BASE_URL}/profile/vehicle/link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ vehicleNumber }),
  });

  const data = await response.json();

  return { response, data };
};

// ================= REMOVE VEHICLE =================
export const deleteVehicle = async (vehicleId) => {
  const headers = await getAuthHeader();

  const response = await fetch(`${BASE_URL}/profile/vehicle/${vehicleId}`, {
    method: "DELETE",
    headers,
  });

  const data = await response.json();

  return { response, data };
};
