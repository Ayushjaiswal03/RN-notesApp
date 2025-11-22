import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  text: string;
  onPress: () => void;
};

export default function CustomButton({ text, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#0b6", 
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
