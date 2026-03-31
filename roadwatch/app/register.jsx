import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import InputField from "../components/InputField";

import { registerUser } from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
      setIsError(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      const { res, data } = await registerUser(form);

      if (!res.ok) {
        setIsError(true);
        setMessage(data.message || "Registration failed");
        return;
      }

      router.replace("/");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9FE]">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center px-6">
            <Pressable
              onPress={() => router.back()}
              className="mb-4 flex-row items-center"
            >
              <Feather name="arrow-left" size={20} color="#2E4DA7" />
              <Text className="text-[#3D6098] ml-2 text-base font-medium">
                Back
              </Text>
            </Pressable>

            <View className="bg-white rounded-3xl p-6 shadow-lg">
              <Text className="text-2xl font-semibold text-center">
                Create Account
              </Text>

              <Text className="text-gray-500 text-center mt-1 mb-6">
                Join RoadWatch today
              </Text>

              <Text className="text-m font-medium mb-2">Full Name</Text>
              <InputField
                placeholder="Enter your full name"
                value={form.fullName}
                onChangeText={(v) => handleChange("fullName", v)}
              />

              <Text className="text-m font-medium mt-4 mb-2">Username</Text>
              <InputField
                placeholder="Enter your username"
                value={form.username}
                onChangeText={(v) => handleChange("username", v)}
              />

              <Text className="text-m font-medium mt-4 mb-2">
                Email Address
              </Text>
              <InputField
                placeholder="Enter your email"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(v) => handleChange("email", v)}
              />

              <Text className="text-m font-medium mt-4 mb-2">Phone Number</Text>
              <InputField
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(v) => handleChange("phone", v)}
              />

              <Text className="text-m font-medium mt-4 mb-2">Password</Text>
              <InputField
                placeholder="Create a password"
                secure
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
              />

              {message ? (
                <Text
                  className={`text-sm mt-4 ${
                    isError ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {message}
                </Text>
              ) : null}

              <Pressable
                onPress={handleRegister}
                disabled={loading}
                className="bg-[#3D6098] py-4 rounded-2xl mt-6"
              >
                <Text className="text-white text-center font-semibold">
                  {loading ? "Registering..." : "Register"}
                </Text>
              </Pressable>

              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Already have an account? </Text>
                <Pressable onPress={() => router.push("/")}>
                  <Text className="text-[#3D6098] font-medium">Login</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
