import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import InputField from "../components/InputField";
import { IP_ADDRESS } from "../components/IP";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
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

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch(`http://${IP_ADDRESS}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.message || "Login failed");
        return;
      }

      await AsyncStorage.setItem("token", data.token);

      router.replace("/home");
    } catch (err) {
      console.log(err);
      setIsError(true);
      setMessage("Cannot connect to server");
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            <View className="items-center mb-8">
              <View className="bg-[#3D6098] w-16 h-16 rounded-3xl items-center justify-center border border-[#E2E8F0] shadow-sm">
                <Feather name="shield" size={26} color="white" />
              </View>

              <Text className="text-2xl font-bold mt-4 text-[#3D6098] tracking-tight">
                RoadWatch
              </Text>
            </View>

            <View className="bg-white rounded-3xl p-6 shadow-lg">
              <Text className="text-2xl font-semibold text-center">
                Welcome Back
              </Text>

              <Text className="text-gray-500 text-center mt-1 mb-6">
                Sign in to continue
              </Text>

              <Text className="text-m font-medium mb-2">Username</Text>
              <InputField
                placeholder="Enter your username"
                value={form.username}
                onChangeText={(v) => handleChange("username", v)}
              />

              <Text className="text-m font-medium mt-4 mb-2">Password</Text>
              <InputField
                placeholder="Enter your password"
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
                onPress={handleLogin}
                disabled={loading}
                className="bg-[#3D6098] py-4 rounded-2xl mt-8"
              >
                <Text className="text-white text-center font-semibold">
                  {loading ? "Logging in..." : "Login"}
                </Text>
              </Pressable>

              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Don't have an account? </Text>
                <Pressable onPress={() => router.push("/register")}>
                  <Text className="text-[#3D6098] font-medium">Register</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
