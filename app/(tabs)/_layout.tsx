import React from "react";
import { Tabs } from "expo-router"; // Expo Router Tabs component
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
