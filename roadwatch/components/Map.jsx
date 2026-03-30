import { useRef, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

export default function Map({ onLocationSelect }) {
  const mapRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialRegion = {
    latitude: 27.7172,
    longitude: 85.324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleLongPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const selected = { latitude, longitude };
    setCoords(selected);
    onLocationSelect(selected);
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission required.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const selected = { latitude, longitude };
      setCoords(selected);
      onLocationSelect(selected);

      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setLoading(false);
    } catch {
      setLoading(false);
      Alert.alert("Error", "Could not fetch location");
    }
  };

  return (
    <View className="mb-6">
      <Text className="text-gray-800 font-medium mb-4">
        Location of Violation <Text className="text-red-500">*</Text>
      </Text>

      <View
        className="border border-slate-200 rounded-3xl overflow-hidden bg-slate-50"
        style={{ height: 300 }}
      >
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          onLongPress={handleLongPress}
        >
          {coords && <Marker coordinate={coords} />}
        </MapView>

        <Pressable
          onPress={getCurrentLocation}
          style={{
            position: "absolute",
            bottom: 15,
            right: 15,
            backgroundColor: "white",
            padding: 12,
            borderRadius: 50,
            elevation: 5,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Ionicons name="locate" size={22} color="#0F172A" />
          )}
        </Pressable>
      </View>
      {coords && (
        <View className="mt-4 bg-white border border-slate-200 p-3 rounded-2xl">
          <Text className="text-xs text-slate-500">
            Latitude: {coords.latitude.toFixed(6)}
          </Text>
          <Text className="text-xs text-slate-500">
            Longitude: {coords.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
}
