import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import DropdownField from "../../components/DropdownField";
import LiveImageBox from "../../components/LiveImageBox";
import Map from "../../components/Map";

export default function Report() {
  const router = useRouter();

  // =========================
  // STATE VARIABLES
  // =========================
  const [vehicleType, setVehicleType] = useState("");
  const [violationType, setViolationType] = useState("");
  const [description, setDescription] = useState("");
  const [plate, setPlate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [platePhoto, setPlatePhoto] = useState(null);
  const [evidencePhoto, setEvidencePhoto] = useState(null);

  // =========================
  // CAMERA PERMISSION HANDLER
  // =========================
  const requestCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Camera access is needed.");
      return false;
    }
    return true;
  };

  // =========================
  // OPEN CAMERA & CAPTURE IMAGE
  // =========================
  const takePhoto = async () => {
    const ok = await requestCamera();
    if (!ok) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (result.canceled) return null;

    return result.assets?.[0] ?? null;
  };

  // Capture license plate image
  const capturePlate = async () => {
    const img = await takePhoto();
    if (!img) return;
    setPlatePhoto(img);
  };

  // Capture supporting evidence image
  const captureEvidence = async () => {
    const img = await takePhoto();
    if (!img) return;
    setEvidencePhoto(img);
  };

  // =========================
  // FORM VALIDATION
  // =========================
  const isValid =
    plate.trim().length > 0 &&
    vehicleType &&
    violationType &&
    description.trim().length > 0 &&
    selectedLocation &&
    platePhoto &&
    evidencePhoto;

  // =========================
  // SUBMIT HANDLER
  // =========================
  const handleSubmit = () => {
    if (!isValid) return;

    // Later this will connect to backend API
    Alert.alert("Success", "Report submitted successfully!");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* =========================
          HEADER SECTION
      ========================== */}
      <View className="px-5 pt-5 pb-4 border-b border-slate-200 bg-white">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.push("/home")} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </Pressable>

          <Text className="text-xl font-semibold text-slate-900">
            Report Violation
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6">
          {/* =========================
              VEHICLE DETAILS SECTION
          ========================== */}
          <View className="mb-5">
            <Text className="text-xl font-semibold text-slate-900">
              Vehicle Details
            </Text>
            <Text className="text-xs text-slate-500 mt-1">
              Ensure the vehicle details are accurate.
            </Text>
          </View>

          {/* License Plate Input */}
          <View className="mb-6">
            <Text className="text-gray-800 font-medium mb-2">
              License Plate Number <Text className="text-red-500">*</Text>
            </Text>

            <TextInput
              value={plate}
              onChangeText={setPlate}
              placeholder="ABC-1234"
              placeholderTextColor="#9CA3AF"
              className="rounded-2xl px-4 py-4 border border-slate-300 bg-white"
            />
          </View>

          {/* Vehicle Type Dropdown */}
          <DropdownField
            label="Vehicle Type"
            value={vehicleType}
            onChange={setVehicleType}
            options={[
              "Sedan",
              "SUV",
              "Truck",
              "Motorcycle",
              "Van",
              "Bus",
              "Other",
            ]}
            required
            icon="car-outline"
          />

          {/* Violation Type Dropdown */}
          <DropdownField
            label="Violation Type"
            value={violationType}
            onChange={setViolationType}
            options={[
              "Speeding",
              "Illegal Parking",
              "Red Light Violation",
              "Reckless Driving",
              "No Seatbelt",
            ]}
            required
            icon="warning-outline"
          />

          {/* =========================
              DESCRIPTION SECTION
          ========================== */}
          <View className="mb-6">
            <Text className="text-gray-800 font-medium mb-2">
              Description <Text className="text-red-500">*</Text>
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Provide additional details about the violation"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="rounded-2xl px-4 py-4 border border-slate-300 bg-white h-28"
            />
          </View>

          {/* =========================
              MAP LOCATION SECTION
          ========================== */}
          <Map onLocationSelect={setSelectedLocation} />

          {/* =========================
              LICENSE PLATE IMAGE
          ========================== */}
          <View className="mb-7">
            <Text className="text-slate-900 text-base font-semibold mb-4">
              License Plate Photo <Text className="text-red-500">*</Text>
            </Text>

            <LiveImageBox
              image={platePhoto}
              onCapture={capturePlate}
              onReplace={capturePlate}
              onRemove={() => setPlatePhoto(null)}
            />
          </View>

          {/* =========================
              SUPPORTING EVIDENCE IMAGE
          ========================== */}
          <View className="mb-8">
            <Text className="text-slate-900 text-base font-semibold mb-4">
              Supporting Evidence <Text className="text-red-500">*</Text>
            </Text>

            <LiveImageBox
              image={evidencePhoto}
              onCapture={captureEvidence}
              onReplace={captureEvidence}
              onRemove={() => setEvidencePhoto(null)}
            />
          </View>

          {/* =========================
              SUBMIT BUTTON
          ========================== */}
          <Pressable
            disabled={!isValid}
            onPress={handleSubmit}
            className="rounded-3xl py-4 mb-3 items-center bg-slate-700"
          >
            <Text className="text-white text-lg font-semibold">
              Submit Report
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
