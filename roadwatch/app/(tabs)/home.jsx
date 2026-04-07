import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ActivityIndicator, Alert } from "react-native";

import { getHome } from "../../services/homeService";
import { getProfile } from "../../services/profileService";

export default function Home() {
  const router = useRouter();

  const [homeData, setHomeData] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const { response, data } = await getHome();

      if (!response.ok) {
        Alert.alert("Error", "Failed to load data");
        return;
      }

      setHomeData(data);

      const profileRes = await getProfile();
      if (profileRes.response.ok) {
        setUserName(profileRes.data.user.fullName);
      }
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        router.replace("/");
      } else {
        Alert.alert("Error", "Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cardShadow = {
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#FBFCFE]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#334155" />
          <Text className="mt-3 text-slate-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FBFCFE]" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= HEADER ================= */}
        <LinearGradient colors={["#0F172A", "#1E293B"]} className="px-5 h-60">
          <View className="flex-row justify-end mt-4">
            <Pressable onPress={() => router.push("notifications")}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#E2E8F0"
              />
            </Pressable>
          </View>

          <Text className="text-2xl font-bold text-white mt-24">RoadWatch</Text>
          <Text className="text-slate-300 mt-1">Smart Traffic Monitoring</Text>
        </LinearGradient>

        {/* ================= PROFILE ================= */}
        <View className="px-5 mt-10">
          <Text className="text-xl font-semibold text-gray-900">
            Welcome back,
          </Text>
          <Text className="text-2xl font-bold text-gray-900 mt-1">
            {userName || "User"}
          </Text>
        </View>

        {/* ================= STATS ================= */}
        <View className="px-5 mt-6">
          <View className="flex-row flex-wrap justify-between">
            {[
              {
                icon: "document-text-outline",
                color: "#3B82F6",
                value: homeData?.totalReports || 0,
                label: "Total Reports",
              },
              {
                icon: "time-outline",
                color: "#F59E0B",
                value: homeData?.pendingReports || 0,
                label: "Pending Reports",
              },
              {
                icon: "checkmark-circle-outline",
                color: "#10B981",
                value: homeData?.verifiedReports || 0,
                label: "Verified Reports",
              },
              {
                icon: "wallet-outline",
                color: "#EF4444",
                value: homeData?.unpaidFines || 0,
                label: "Unpaid Fines",
              },
            ].map((item, index) => (
              <View
                key={index}
                className="w-[48%] bg-white p-5 rounded-3xl mb-5"
                style={cardShadow}
              >
                <View
                  style={{
                    backgroundColor: item.color + "15",
                    padding: 8,
                    borderRadius: 12,
                    alignSelf: "flex-start",
                  }}
                >
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>

                <Text className="text-3xl font-bold mt-4 text-gray-900">
                  {item.value}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ================= SAFETY TIPS ================= */}
        <View className="px-5 mt-8">
          <View className="bg-white p-5 rounded-3xl" style={cardShadow}>
            <View className="flex-row items-center mb-4">
              <Feather name="shield" size={20} color="#2563EB" />
              <Text className="ml-2 text-base font-semibold text-gray-900">
                Safety Tips
              </Text>
            </View>

            {[
              "Always follow traffic signals and signs",
              "Park only in designated areas",
              "Respect speed limits in all zones",
              "Use turn signals when changing lanes",
              "Never use phone while driving",
            ].map((tip, index) => (
              <View key={index} className="flex-row items-start mb-3">
                <Feather
                  name="alert-triangle"
                  size={16}
                  color="#F59E0B"
                  style={{ marginTop: 2 }}
                />
                <Text className="mt-0.5 ml-2 text-sm text-gray-700 flex-1">
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ================= HELP ================= */}
        <View className="px-5 mt-8 mb-8">
          <View className="bg-white p-5 rounded-3xl" style={cardShadow}>
            <View className="flex-row items-center mb-4">
              <Feather name="help-circle" size={20} color="#1F2937" />
              <Text className="ml-2 text-base font-semibold text-gray-900">
                Need Help?
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/contact")}
              className="py-3 rounded-xl border border-gray-300 items-center"
            >
              <Text className="text-sm font-medium text-gray-800">
                Contact Support
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
