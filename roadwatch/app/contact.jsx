import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  LayoutAnimation,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Contact() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "How do I submit a violation report?",
      a: "Tap the Report tab, fill in the violation details including plate number, location, violation type, and upload the photos as evidence. Submit the form and wait for admin review.",
    },
    {
      q: "How do I pay my fine?",
      a: "Open the Fine tab, select your pending fine, and proceed with secure digital payment.",
    },
    {
      q: "What happens after I submit a report?",
      a: "Your report goes through AI verification and admin review. If approved, a fine will be issued to the violator and report status will be updated.",
    },
    {
      q: "How do I enable/disable notifications?",
      a: "Go to Profile > Settings and manage your notification preferences from there.",
    },
    {
      q: "What if I disagree with a fine?",
      a: "Contact our support team via phone or email within 14 days of receiving the fine. Provide your fine ID and any supporting evidence. Our team will review your case and respond within 5 business days.",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["top"]}>
      {/* ===== HEADER ===== */}
      <View className="bg-white px-5 py-6 border-b border-slate-200">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </Pressable>
          <Text className="text-xl font-semibold text-slate-900">
            Contact & Support
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* ===== CONTACT CARD (ALL IN ONE BOX) ===== */}
        <View className="bg-white border border-slate-200 rounded-3xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-slate-900 mb-4">
            Get in Touch
          </Text>

          <View className="flex-row items-center py-3">
            <Ionicons name="mail-outline" size={20} color="#2563EB" />
            <Text className="text-slate-700 ml-4 text-sm flex-1">
              support@roadwatch.app
            </Text>
          </View>

          <View className="h-px bg-slate-200" />

          <View className="flex-row items-center py-3">
            <Ionicons name="call-outline" size={20} color="#16A34A" />
            <Text className="text-slate-700 ml-4 text-sm flex-1">
              +977 9810458633
            </Text>
          </View>

          <View className="h-px bg-slate-200" />

          <View className="flex-row items-center py-3">
            <Ionicons name="logo-facebook" size={20} color="#1877F2" />
            <Text className="text-slate-700 ml-4 text-sm flex-1">
              facebook.com/roadwatch
            </Text>
          </View>

          <View className="h-px bg-slate-200" />

          <View className="flex-row items-center py-3">
            <Ionicons name="logo-instagram" size={20} color="#E1306C" />
            <Text className="text-slate-700 ml-4 text-sm flex-1">
              @roadwatch.app
            </Text>
          </View>
        </View>

        {/* ===== FAQ SECTION ===== */}
        <View className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <Text className="text-lg font-semibold text-slate-900 mb-4">
            Frequently Asked Questions
          </Text>

          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <View key={index}>
                <Pressable
                  onPress={() => toggle(index)}
                  className="flex-row items-center justify-between py-4"
                >
                  <Text className="text-slate-900 text-sm font-medium flex-1 pr-4">
                    {item.q}
                  </Text>

                  <Feather
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#64748B"
                  />
                </Pressable>

                {isOpen && (
                  <View className="pb-4">
                    <Text className="text-slate-600 text-sm leading-5">
                      {item.a}
                    </Text>
                  </View>
                )}

                {index !== faqs.length - 1 && (
                  <View className="h-px bg-slate-200" />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
