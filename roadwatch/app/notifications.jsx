import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Notifications() {
  const router = useRouter();

  // Dummy data (replace later with backend)
  const notifications = [
    {
      id: "1",
      title: "Report Verified",
      message: "Your report has been accepted.",
      time: "2 min ago",
    },
    {
      id: "2",
      title: "New Fine Issued",
      message: "A fine has been added to your account.",
      time: "1 hour ago",
    },
    {
      id: "3",
      title: "Report Rejected",
      message: "Your report was rejected due to low clarity.",
      time: "Yesterday",
    },
  ];

  const renderItem = ({ item }) => (
    <View className="bg-white p-4 rounded-2xl mb-3 shadow-sm">
      <Text className="text-base font-semibold text-gray-900">
        {item.title}
      </Text>
      <Text className="text-sm text-gray-600 mt-1">{item.message}</Text>
      <Text className="text-xs text-gray-400 mt-2">{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FBFCFE]">
      {/* HEADER */}
      <View className="flex-row items-center px-5 py-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text className="ml-4 text-lg font-semibold text-gray-900">
          Notifications
        </Text>
      </View>

      {/* LIST */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
