import { useEffect, useState } from "react";
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

import { submitReport, verifyPlateImage } from "../../services/reportService";

export default function Report() {
  const router = useRouter();

  // ================= STATE =================
  const [vehicleType, setVehicleType] = useState("");
  const [violationType, setViolationType] = useState("");
  const [description, setDescription] = useState("");
  const [plate, setPlate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [platePhoto, setPlatePhoto] = useState(null);
  const [evidencePhoto, setEvidencePhoto] = useState(null);

  const [plateCheckStatus, setPlateCheckStatus] = useState("idle");
  const [plateCheckMessage, setPlateCheckMessage] = useState("");
  const [matchedPlate, setMatchedPlate] = useState("");

  // ================= NORMALIZE =================
  const normalizePlate = (value = "") =>
    value.toUpperCase().replace(/[^A-Z0-9]/g, "");

  // ================= RESET =================
  const resetForm = () => {
    setPlate("");
    setVehicleType("");
    setViolationType("");
    setDescription("");
    setSelectedLocation(null);
    setPlatePhoto(null);
    setEvidencePhoto(null);
    setPlateCheckStatus("idle");
    setPlateCheckMessage("");
    setMatchedPlate("");
  };

  // ================= CAMERA =================
  const requestCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Camera access is needed.");
      return false;
    }

    return true;
  };

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

  // ================= VERIFY PLATE =================
  const checkPlateImage = async (imageAsset, enteredPlate) => {
    if (!imageAsset) return;

    try {
      setPlateCheckStatus("checking");
      setPlateCheckMessage("Checking plate...");
      setMatchedPlate("");

      const formData = new FormData();
      formData.append("plate", enteredPlate);
      formData.append("plateImage", {
        uri: imageAsset.uri,
        name: `plate_${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      const { response, data } = await verifyPlateImage(formData);

      const extracted = data?.extractedPlate || "";
      setMatchedPlate(extracted);

      if (!response.ok) {
        setPlateCheckStatus("not_matched");
        setPlateCheckMessage(
          data?.message || "❌ Plate verification failed. Try again.",
        );
        return;
      }

      if (data?.matched) {
        setPlateCheckStatus("matched");
        setPlateCheckMessage("✔ Plate matched successfully");
      } else {
        setPlateCheckStatus("not_matched");
        setPlateCheckMessage(
          data?.message || "❌ Plate did not match. Please retake the image.",
        );
      }
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        Alert.alert("Session Expired", "Please login again.");
        router.replace("/");
        return;
      }

      setPlateCheckStatus("not_matched");
      setPlateCheckMessage("❌ Plate verification failed. Try again.");
      setMatchedPlate("");
    }
  };

  // ================= CAPTURE =================
  const capturePlate = async () => {
    const img = await takePhoto();
    if (!img) return;

    setPlatePhoto(img);
    await checkPlateImage(img, plate);
  };

  const captureEvidence = async () => {
    const img = await takePhoto();
    if (!img) return;

    setEvidencePhoto(img);
  };

  // ================= AUTO RECHECK UI ONLY =================
  useEffect(() => {
    if (!platePhoto || !matchedPlate) return;

    const typed = normalizePlate(plate.trim());
    const detected = normalizePlate(matchedPlate);

    if (!typed) {
      setPlateCheckStatus("idle");
      setPlateCheckMessage("");
      return;
    }

    if (typed === detected) {
      setPlateCheckStatus("matched");
      setPlateCheckMessage("✔ Plate matched successfully");
    } else {
      setPlateCheckStatus("not_matched");
      setPlateCheckMessage("❌ Plate did not match. Please retake the image.");
    }
  }, [plate, matchedPlate, platePhoto]);

  // ================= REMOVE =================
  const removePlateImage = () => {
    setPlatePhoto(null);
    setPlateCheckStatus("idle");
    setPlateCheckMessage("");
    setMatchedPlate("");
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("plate", plate);
      formData.append("violationType", violationType);
      formData.append("description", description);

      if (selectedLocation) {
        formData.append("latitude", String(selectedLocation.latitude));
        formData.append("longitude", String(selectedLocation.longitude));
      }

      if (platePhoto) {
        formData.append("plateImage", {
          uri: platePhoto.uri,
          name: `plate_${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }

      if (evidencePhoto) {
        formData.append("supportImage", {
          uri: evidencePhoto.uri,
          name: `evidence_${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }

      const { response, data } = await submitReport(formData);

      if (!response.ok) {
        Alert.alert("Error", data?.message || "Failed to submit.");
        return;
      }

      Alert.alert("Success", data?.message || "Report submitted successfully.");
      resetForm();
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        Alert.alert("Session Expired", "Please login again.");
        router.replace("/");
        return;
      }

      Alert.alert("Error", "Server error.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
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
          <View className="mb-5">
            <Text className="text-xl font-semibold text-slate-900">
              Vehicle Details
            </Text>
            <Text className="text-xs text-slate-500 mt-1">
              Ensure the vehicle details are accurate.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-gray-800 font-medium mb-2">
              License Plate Number <Text className="text-red-500">*</Text>
            </Text>

            <TextInput
              value={plate}
              onChangeText={setPlate}
              placeholder="ABC-1234"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              className="rounded-2xl px-4 py-4 border border-slate-300 bg-white"
            />
          </View>

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

          <Map onLocationSelect={setSelectedLocation} />

          <View className="mb-7">
            <Text className="text-slate-900 text-base font-semibold mb-4">
              License Plate Photo <Text className="text-red-500">*</Text>
            </Text>

            <LiveImageBox
              image={platePhoto}
              onCapture={capturePlate}
              onReplace={capturePlate}
              onRemove={removePlateImage}
            />

            {!!plateCheckMessage && (
              <>
                <Text
                  className={`mt-3 text-sm ${
                    plateCheckStatus === "checking"
                      ? "text-slate-500"
                      : plateCheckStatus === "matched"
                        ? "text-emerald-600"
                        : "text-red-500"
                  }`}
                >
                  {plateCheckMessage}
                </Text>

                {!!matchedPlate && (
                  <Text className="text-xs text-slate-500 mt-1">
                    Detected Plate: {matchedPlate}
                  </Text>
                )}
              </>
            )}
          </View>

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

          <Pressable
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
