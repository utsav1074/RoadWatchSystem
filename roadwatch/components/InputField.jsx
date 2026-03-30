import { View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

export default function InputField({
  placeholder,
  secure = false,
  keyboardType = "default",
  value,
  onChangeText,
}) {
  // ================= PASSWORD VISIBILITY =================
  const [hidden, setHidden] = useState(secure);

  return (
    <View className="h-14 bg-[#FBFCFE] rounded-xl px-4 flex-row items-center border border-gray-200">
      {/* INPUT */}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={hidden}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        className="flex-1 text-[15px] text-gray-700"
      />

      {/* TOGGLE PASSWORD */}
      {secure && (
        <Pressable onPress={() => setHidden(!hidden)}>
          <Feather
            name={hidden ? "eye" : "eye-off"}
            size={18}
            color="#6B7280"
          />
        </Pressable>
      )}
    </View>
  );
}
