import { View, Pressable, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LiveImageBox({
  image,
  onCapture,
  onReplace,
  onRemove,
  height = 210,
}) {
  return (
    <View>
      {!image ? (
        <Pressable
          onPress={onCapture}
          className="items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50"
          style={{ height }}
        >
          <View className="bg-slate-900/5 p-5 rounded-full mb-3">
            <Ionicons name="camera-outline" size={28} color="#0F172A" />
          </View>

          <Text className="text-slate-800 font-semibold text-sm">
            Capture Photo
          </Text>

          <Text className="text-slate-400 text-xs mt-1">
            Ensure the image is clear
          </Text>
        </Pressable>
      ) : (
        <View className="relative">
          <Image
            source={{ uri: image.uri }}
            style={{
              width: "100%",
              height,
              borderRadius: 24,
            }}
          />

          <View className="absolute top-3 right-3 flex-row">
            <Pressable
              onPress={onReplace}
              className="bg-white p-2 rounded-full mr-2"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 5,
              }}
            >
              <Ionicons name="refresh-outline" size={18} color="#0F172A" />
            </Pressable>

            <Pressable
              onPress={onRemove}
              className="bg-white p-2 rounded-full"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 5,
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
