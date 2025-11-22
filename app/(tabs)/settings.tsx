import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TabSettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.sub}>This is the Tabs Settings placeholder.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "700" },
  sub: { marginTop: 10, color: "#6b7280" },
});
