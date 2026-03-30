import { useState } from "react";
import { View, Text, Pressable, LayoutAnimation } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DropdownField({
  label,
  value,
  onChange,
  options = [],
  required = false,
  icon = "car-outline",
}) {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View className="mb-6">
      {/* LABEL */}
      <Text className="text-gray-800 font-medium mb-2">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>

      {/* FIELD */}
      <Pressable
        onPress={toggleDropdown}
        className="bg-white rounded-2xl px-4 py-4 border border-slate-300 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <Ionicons
            name={icon}
            size={18}
            color="#0F172A"
            style={{ marginRight: 8 }}
          />

          <Text
            className={`text-base ${value ? "text-gray-900" : "text-gray-400"}`}
          >
            {value || "Select option"}
          </Text>
        </View>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#0F172A"
        />
      </Pressable>

      {/* OPTIONS */}
      {open && (
        <View className="bg-white border border-slate-200 rounded-2xl mt-2 overflow-hidden">
          {options.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                onChange(item);
                toggleDropdown();
              }}
              className="px-4 py-4 flex-row justify-between items-center border-b border-slate-100"
            >
              <Text
                className={`text-base ${
                  value === item
                    ? "text-slate-900 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {item}
              </Text>

              {value === item && (
                <Ionicons name="checkmark" size={18} color="#0F172A" />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
