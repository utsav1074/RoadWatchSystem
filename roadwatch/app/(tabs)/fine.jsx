import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { getFines } from "../../services/fineService";

export default function Fine() {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All");
  const [fines, setFines] = useState([]);

  // ================= FETCH FINES =================
  useEffect(() => {
    const loadFines = async () => {
      try {
        const { response, data } = await getFines();

        if (response.ok) {
          const formatted = data.map((f) => ({
            id: f.fine_id,
            plate: f.vehicle_number || "N/A",
            violation: f.violation_type,
            amount: `Rs ${f.fine_amount}`,
            date: new Date(f.fine_issueDate).toLocaleDateString(),
            status: f.fine_status === "paid" ? "Paid" : "Unpaid",
          }));

          setFines(formatted);
        }
      } catch (error) {
        console.log("Fine error:", error);
      }
    };

    loadFines();
  }, []);

  const filters = ["All", "Paid", "Unpaid"];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
        };
      case "Unpaid":
        return {
          bg: "bg-rose-100",
          text: "text-rose-700",
        };
      default:
        return {};
    }
  };

  const filteredFines =
    activeFilter === "All"
      ? fines
      : fines.filter((fine) => fine.status === activeFilter);

  return (
    <SafeAreaView className="flex-1 bg-[#FBFCFE]" edges={["top"]}>
      {/* ================= TOP ================= */}
      <View className="bg-white px-5 py-6 border-b border-slate-200">
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => router.push("/home")} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </Pressable>

          <Text className="text-xl font-semibold text-slate-900">My Fines</Text>
        </View>

        <View className="flex-row">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full mr-3 border ${
                  isActive
                    ? "bg-slate-700 border-slate-700"
                    : "bg-gray-50 border-slate-300"
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

      {/* ================= LIST ================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-5 pt-6"
      >
        {filteredFines.length === 0 && (
          <Text className="text-center text-slate-500 mt-10">
            No fines found
          </Text>
        )}

        {filteredFines.map((fine) => {
          const statusStyle = getStatusStyle(fine.status);

          return (
            <View
              key={fine.id}
              className="bg-white rounded-3xl p-5 shadow-xl mb-5"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold text-slate-900">
                  {fine.plate}
                </Text>

                <View className={`px-3 py-1 rounded-full ${statusStyle.bg}`}>
                  <Text className={`text-xs font-semibold ${statusStyle.text}`}>
                    {fine.status}
                  </Text>
                </View>
              </View>

              <Text className="text-slate-600 text-sm mb-3">
                {fine.violation}
              </Text>

              <View className="flex-row justify-between">
                <View>
                  <Text className="text-slate-500 text-xs">Amount</Text>
                  <Text className="text-slate-900 font-semibold">
                    {fine.amount}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-slate-500 text-xs">Issued Date</Text>
                  <Text className="text-slate-900 font-medium">
                    {fine.date}
                  </Text>
                </View>
              </View>

              {fine.status === "Unpaid" && (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/pay",
                      params: fine,
                    })
                  }
                  className="bg-slate-700 py-3 rounded-xl items-center mt-4"
                >
                  <Text className="text-white font-semibold">Pay Now</Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
