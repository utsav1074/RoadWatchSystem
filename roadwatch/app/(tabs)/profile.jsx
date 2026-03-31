import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import {
  getProfile,
  uploadProfileImage,
  linkVehicle,
  deleteVehicle,
} from "../../services/profileService";

import { FILE_URL } from "../../config/api";

export default function Profile() {
  const router = useRouter();

  const [profileImage, setProfileImage] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [newPlate, setNewPlate] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkingVehicle, setLinkingVehicle] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const { response, data } = await getProfile();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to load profile.");
        return;
      }

      setUser(data.user);
      setVehicles(data.vehicles || []);

      setProfileImage(
        data.user?.imagePath ? `${FILE_URL}${data.user.imagePath}` : null,
      );
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        Alert.alert("Session Expired", "Please login again.");
        router.replace("/");
      } else {
        Alert.alert("Error", "Unable to connect to server.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= PICK IMAGE =================
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission Required", "Please allow access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      setUploadingImage(true);

      const formData = new FormData();
      formData.append("profileImage", {
        uri: result.assets[0].uri,
        name: `profile_${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      const { response, data } = await uploadProfileImage(formData);

      if (!response.ok) {
        Alert.alert("Error", data.message || "Upload failed.");
        return;
      }

      setProfileImage(`${FILE_URL}${data.imagePath}`);
      Alert.alert("Success", data.message);
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        Alert.alert("Session Expired", "Please login again.");
        router.replace("/");
      } else {
        Alert.alert("Error", "Image upload failed.");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  // ================= LINK VEHICLE =================
  const addVehicle = async () => {
    try {
      const plate = newPlate.trim().toUpperCase();

      if (!plate) {
        Alert.alert("Error", "Enter vehicle number.");
        return;
      }

      setLinkingVehicle(true);

      const { response, data } = await linkVehicle(plate);

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed.");
        return;
      }

      setNewPlate("");
      Alert.alert("Success", data.message);
      fetchProfile();
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        Alert.alert("Session Expired", "Please login again.");
        router.replace("/");
      } else {
        Alert.alert("Error", "Server error.");
      }
    } finally {
      setLinkingVehicle(false);
    }
  };

  // ================= REMOVE VEHICLE =================
  const removeVehicle = async (vehicleId) => {
    try {
      const { response, data } = await deleteVehicle(vehicleId);

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed.");
        return;
      }

      Alert.alert("Success", data.message);
      fetchProfile();
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        Alert.alert("Session Expired", "Please login again.");
        router.replace("/");
      } else {
        Alert.alert("Error", "Server error.");
      }
    }
  };

  // ================= LOGOUT =================
  const logoutUser = async () => {
    const AsyncStorage =
      require("@react-native-async-storage/async-storage").default;
    await AsyncStorage.removeItem("token");
    router.replace("/");
  };

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-[#FBFCFE]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#334155" />
          <Text className="mt-3 text-slate-600">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FBFCFE]">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="bg-white px-5 py-6 border-b border-slate-200">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.back()} className="mr-3">
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </Pressable>

            <Text className="text-xl font-semibold text-slate-900">
              Profile
            </Text>
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pt-8 pb-10">
            <View className="items-center mb-10">
              <Pressable onPress={pickImage} className="relative">
                {profileImage ? (
                  <View className="p-[3px] rounded-full border-2 border-[#2563EB]">
                    <Image
                      source={{ uri: profileImage }}
                      className="h-28 w-28 rounded-full"
                    />
                  </View>
                ) : (
                  <View className="bg-slate-200 h-28 w-28 rounded-full items-center justify-center">
                    <Ionicons name="person" size={48} color="#64748B" />
                  </View>
                )}

                <View className="absolute bottom-0 right-0 bg-slate-800 p-2 rounded-full">
                  <Ionicons name="camera-outline" size={14} color="white" />
                </View>
              </Pressable>

              {uploadingImage && (
                <Text className="text-slate-500 mt-3">Uploading image...</Text>
              )}
            </View>

            <Text className="text-slate-900 font-semibold mb-4">
              Account Information
            </Text>

            <View className="border-b border-slate-200 py-4">
              <Text className="text-slate-500 text-xs mb-1">Full Name</Text>
              <Text className="text-slate-900 font-medium">
                {user?.fullName || "-"}
              </Text>
            </View>

            <View className="border-b border-slate-200 py-4">
              <Text className="text-slate-500 text-xs mb-1">Username</Text>
              <Text className="text-slate-900 font-medium">
                {user?.username || "-"}
              </Text>
            </View>

            <View className="border-b border-slate-200 py-4">
              <Text className="text-slate-500 text-xs mb-1">Email Address</Text>
              <Text className="text-slate-900 font-medium">
                {user?.email || "-"}
              </Text>
            </View>

            <View className="py-4 mb-8">
              <Text className="text-slate-500 text-xs mb-1">Phone Number</Text>
              <Text className="text-slate-900 font-medium">
                {user?.phone || "-"}
              </Text>
            </View>

            <Text className="text-slate-900 font-semibold mb-4">
              Linked Vehicles
            </Text>

            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <View
                  key={vehicle.vehicle_id}
                  className="flex-row justify-between items-center border border-slate-200 rounded-2xl px-4 py-3 mb-3 bg-white"
                >
                  <View>
                    <Text className="text-slate-900 font-medium">
                      {vehicle.vehicle_number}
                    </Text>
                  </View>

                  <Pressable onPress={() => removeVehicle(vehicle.vehicle_id)}>
                    <Ionicons
                      name="close-circle-outline"
                      size={20}
                      color="#EF4444"
                    />
                  </Pressable>
                </View>
              ))
            ) : (
              <View className="border border-dashed border-slate-300 rounded-2xl px-4 py-5 bg-white mb-3">
                <Text className="text-slate-500 text-center">
                  No vehicles linked yet.
                </Text>
              </View>
            )}

            <TextInput
              value={newPlate}
              onChangeText={setNewPlate}
              placeholder="Enter Vehicle Plate Number"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              className="border border-slate-300 rounded-2xl px-4 py-3 bg-white text-base"
            />

            <Pressable
              onPress={addVehicle}
              disabled={linkingVehicle}
              className="bg-slate-700 py-4 rounded-2xl items-center mt-4"
            >
              <Text className="text-white font-semibold">
                {linkingVehicle ? "Linking..." : "Link Vehicle"}
              </Text>
            </Pressable>

            <View className="mt-12">
              <Pressable
                onPress={logoutUser}
                className="border border-slate-400 py-4 rounded-2xl items-center"
              >
                <Text className="text-slate-700 font-semibold text-base">
                  Log Out
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
