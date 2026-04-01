import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  const weeklyData = [
    { value: 8, label: "Sun" },
    { value: 12, label: "Mon" },
    { value: 18, label: "Tue" },
    { value: 9, label: "Wed" },
    { value: 22, label: "Thu" },
    { value: 15, label: "Fri" },
    { value: 10, label: "Sat" },
  ];

  const reportBreakdown = [
    { value: 490, color: "#5DADE2", label: "Accepted" },
    { value: 250, color: "#F8B44C", label: "Pending" },
    { value: 300, color: "#FF7FA3", label: "Rejected" },
  ];

  const cardShadow = {
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBFCFE]" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= PREMIUM HEADER ================= */}
        <LinearGradient
          colors={["#0F172A", "#1E293B"]}
          className="px-5 pb-24 rounded-b-[40px] relative"
        >
          <View className="flex-row justify-end mt-4">
            <Pressable onPress={() => router.push("notifications")}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#E2E8F0"
              />
            </Pressable>
          </View>

          <Text className="text-2xl font-bold text-white mt-8">RoadWatch</Text>
          <Text className="text-slate-300 mt-1">Smart Traffic Monitoring</Text>

          <View className="absolute left-5 -bottom-14">
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={{
                width: 95,
                height: 95,
                borderRadius: 50,
                borderWidth: 4,
                borderColor: "#F8FAFC",
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 8,
              }}
            />
          </View>
        </LinearGradient>

        {/* ================= PROFILE INFO ================= */}
        <View className="px-5 mt-20">
          <Text className="text-xl font-semibold text-gray-900">
            Welcome back,
          </Text>
          <Text className="text-2xl font-bold text-gray-900 mt-1">
            Utsav Basnyat
          </Text>
        </View>

        {/* ================= STATS ================= */}
        <View className="px-5 mt-6">
          <View className="flex-row flex-wrap justify-between">
            {[
              {
                icon: "document-text-outline",
                color: "#3B82F6",
                value: "128",
                label: "Total Reports",
              },
              {
                icon: "time-outline",
                color: "#F59E0B",
                value: "34",
                label: "Pending Reports",
              },
              {
                icon: "checkmark-circle-outline",
                color: "#10B981",
                value: "79",
                label: "Verified Reports",
              },
              {
                icon: "wallet-outline",
                color: "#EF4444",
                value: "15",
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

        {/* ================= PIE CHART ================= */}
        <View className="px-5 mt-6">
          <View className="bg-white rounded-[28px] p-6" style={cardShadow}>
            <Text className="text-lg font-semibold text-gray-900 mb-6">
              Report Status Overview
            </Text>

            <View className="items-center">
              <PieChart
                data={reportBreakdown}
                radius={105}
                strokeWidth={1}
                strokeColor="#FFFFFF"
                showText={false}
                focusOnPress
              />
            </View>

            <View className="mt-8">
              {reportBreakdown.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between mb-4"
                >
                  <View className="flex-row items-center">
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: item.color,
                        marginRight: 10,
                      }}
                    />
                    <Text className="text-sm font-medium text-gray-800">
                      {item.label}
                    </Text>
                  </View>

                  <Text className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ================= BAR CHART ================= */}
        <View className="px-5 mt-8">
          <View
            className="bg-white rounded-[28px] p-4 overflow-hidden"
            style={cardShadow}
          >
            <View className="flex-row justify-between items-center mt-2 mb-6 mx-3">
              <Text className="text-lg font-semibold text-gray-900">
                Weekly Reports
              </Text>
              <Text className="text-sm text-gray-400">Last 7 days</Text>
            </View>

            <BarChart
              data={weeklyData.map((item) => ({
                ...item,
                frontColor: "#3B82F6",
              }))}
              height={190}
              barWidth={18}
              spacing={24}
              rulesColor="#CBD5E1"
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisTextStyle={{ color: "#334155", fontSize: 13 }}
              xAxisLabelTextStyle={{ color: "#1E293B", fontSize: 13 }}
              noOfSections={5}
              maxValue={50}
            />
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

        {/* ================= NEED HELP ================= */}
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
