import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Colors from "../constants/colors";

type Props = {
  style?: ViewStyle;
  children?: React.ReactNode;
};

export default function Card({ style, children }: Props) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,    // card background
    borderRadius: 12,                   // rounded corners
    padding: 12,                        // inner padding
    marginVertical: 8,                  // spacing between cards
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,                       // android elevation
  },
});
