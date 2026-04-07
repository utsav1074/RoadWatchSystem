import { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getHistory } from "../../services/historyService";

export default function History() {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const loadHistory = async () => {
    try {
      const { response, data } = await getHistory();

      if (!response.ok) return;

      const formattedReports = data.map((report) => ({
        id: report.report_id,
        plate: report.vehicle_number || "N/A",
        violation: report.violation_type,
        date: new Date(report.report_date).toLocaleDateString(),
        status:
          report.report_status === "accepted"
            ? "Accepted"
            : report.report_status === "rejected"
              ? "Rejected"
              : "Pending",
      }));

      setReports(formattedReports);
    } catch (error) {
      if (error.message === "NO_TOKEN") {
        router.push("/");
      }
      console.log("History Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.plate
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      activeFilter === "All" || report.status === activeFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#FBFCFE]" edges={["top"]}>
      <View className="bg-white px-5 py-6 border-b border-slate-200">
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => router.push("/home")} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </Pressable>

          <Text className="text-xl font-semibold text-slate-900">
            Report History
          </Text>
        </View>

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-5 pt-6"
      >
        {loading ? (
          <Text className="text-center text-slate-500 mt-10">Loading...</Text>
        ) : filteredReports.length === 0 ? (
          <Text className="text-center text-slate-500 mt-10">
            No reports found.
          </Text>
        ) : (
          filteredReports.map((report) => {
            const statusStyle = getStatusStyle(report.status);

            return (
              <View
                key={report.id}
                className="bg-white rounded-3xl p-5 shadow-xl mb-5"
              >
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
                    <Text
                      className={`text-xs font-semibold ${statusStyle.text}`}
                    >
                      {report.status}
                    </Text>
                  </View>
                </View>

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
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
