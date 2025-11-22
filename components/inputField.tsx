import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import Colors from "../constants/colors";

type Props = {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  style?: TextInputProps;
};

export default function InputField({ label, value, onChangeText, placeholder, multiline }: Props) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        style={[styles.input, multiline ? styles.multiline : undefined]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.muted,
    marginBottom: 6,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
