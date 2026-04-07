import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Pay() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedMethod, setSelectedMethod] = useState("eSewa");

  // ================= GET DATA FROM ROUTER =================
  const fine = {
    fineId: params.id,
    plate: params.plate,
    violation: params.violation,
    amount: params.amount,
    date: params.date,
  };

  const methods = [
    { name: "eSewa", icon: "wallet-outline" },
    { name: "Khalti", icon: "card-outline" },
    { name: "Bank Transfer", icon: "business-outline" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#FBFCFE]" edges={["top"]}>
      {/* ===== HEADER ===== */}
      <View className="bg-white px-5 py-6 border-b border-slate-200">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </Pressable>
          <Text className="text-xl font-semibold text-slate-900">Pay</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ===== FINE SUMMARY ===== */}
        <View className="bg-white rounded-3xl p-5 shadow-xl mb-6">
          <View>
            <Text className="text-xl font-bold mb-4">
              Fine ID - {fine.fineId}
            </Text>

            <Text className="text-base font-semibold text-slate-900">
              {fine.plate}
            </Text>
          </View>

          <Text className="text-slate-600 text-sm mt-4 mb-3">
            {fine.violation}
          </Text>

          <View className="flex-row justify-between">
            <View>
              <Text className="text-slate-500 text-xs">Issued Date</Text>
              <Text className="text-slate-900 font-medium">{fine.date}</Text>
            </View>

            <View className="items-end">
              <Text className="text-slate-500 text-xs">Total Amount</Text>
              <Text className="text-2xl font-bold text-slate-900">
                {fine.amount}
              </Text>
            </View>
          </View>
        </View>

        {/* ===== PAYMENT METHOD ===== */}
        <Text className="text-slate-900 font-semibold mb-3">
          Payment Method
        </Text>

        {methods.map((method) => {
          const isSelected = selectedMethod === method.name;

          return (
            <Pressable
              key={method.name}
              onPress={() => setSelectedMethod(method.name)}
              className={`bg-white rounded-2xl p-4 mb-4 flex-row items-center justify-between border ${
                isSelected ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={method.icon}
                  size={22}
                  color={isSelected ? "#334155" : "#64748B"}
                />
                <Text className="ml-3 text-slate-900 font-medium">
                  {method.name}
                </Text>
              </View>

              {isSelected && (
                <Ionicons name="checkmark-circle" size={22} color="#334155" />
              )}
            </Pressable>
          );
        })}

        {/* ===== PAY BUTTON ===== */}
        <Pressable
          className="bg-slate-700 py-4 rounded-2xl items-center mt-4"
          onPress={() => alert("Payment Successful")}
        >
          <Text className="text-white font-semibold text-base">
            Pay {fine.amount}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
