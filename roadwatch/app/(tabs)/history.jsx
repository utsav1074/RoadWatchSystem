import { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function History() {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const reports = [
    {
      id: 1,
      plate: "BAA-1234",
      violation: "Illegal Parking",
      date: "Jan 21, 2026",
      status: "Pending",
    },
    {
      id: 2,
      plate: "BAG-9087",
      violation: "Speeding",
      date: "Jan 19, 2026",
      status: "Accepted",
    },
    {
      id: 3,
      plate: "KAA-7788",
      violation: "Red Light Violation",
      date: "Jan 18, 2026",
      status: "Rejected",
    },
    {
      id: 4,
      plate: "KAA-7760",
      violation: "Red Light Violation",
      date: "Jan 18, 2026",
      status: "Accepted",
    },
  ];

  const filters = ["All", "Pending", "Accepted", "Rejected"];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          icon: "time-outline",
        };
      case "Accepted":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          icon: "checkmark-circle-outline",
        };
      case "Rejected":
        return {
          bg: "bg-rose-100",
          text: "text-rose-700",
          icon: "close-circle-outline",
        };
      default:
        return {};
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBFCFE]" edges={["top"]}>
      {/* ================= WHITE TOP CONTAINER ================= */}
      <View className="bg-white px-5 py-6 border-b border-slate-200">
        {/* Header Row */}
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => router.push("/home")} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </Pressable>

          <Text className="text-xl font-semibold text-slate-900">
            Report History
          </Text>
        </View>

        {/* Search Bar */}
        <View className="mb-5">
          <View className="flex-row items-center rounded-xl px-3 border border-slate-300">
            <Ionicons
              name="search-outline"
              size={16}
              color="#64748B"
              style={{ marginRight: 6 }}
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search by plate number..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-base"
            />
          </View>
        </View>

        {/* Filter Chips */}
        <View className="flex-row">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full mr-3 border ${
                  isActive ? "bg-slate-700" : "bg-gray-50 border-slate-300"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isActive ? "text-white" : "text-slate-700"
                  }`}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ================= REPORT LIST ================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-5 pt-6"
      >
        {reports.map((report) => {
          const statusStyle = getStatusStyle(report.status);

          return (
            <View
              key={report.id}
              className="bg-white rounded-3xl p-5 shadow-xl mb-5"
            >
              {/* Top Row */}
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-semibold text-slate-900">
                  {report.plate}
                </Text>

                <View
                  className={`px-3 py-1 rounded-full flex-row items-center ${statusStyle.bg}`}
                >
                  <Ionicons
                    name={statusStyle.icon}
                    size={14}
                    color="#0F172A"
                    style={{ marginRight: 4 }}
                  />
                  <Text className={`text-xs font-semibold ${statusStyle.text}`}>
                    {report.status}
                  </Text>
                </View>
              </View>

              {/* Violation */}
              <View className="flex-row items-center mb-2">
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color="#475569"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-slate-600 text-sm">
                  {report.violation}
                </Text>
              </View>

              {/* Date */}
              <View className="flex-row items-center">
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color="#475569"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-slate-500 text-xs">
                  Submitted on {report.date}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
