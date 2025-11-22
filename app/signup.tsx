import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import useAuthStore from "../store/authStore";
import CustomButton from "../components/customButton";

export default function SignupScreen() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);   // store function to register & persist
  const loading = useAuthStore((s) => s.loading);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSignup = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Validation", "Please enter username and password");
      return;
    }
    
    const res = await signup(username.trim(), password.trim());
    if (res.ok) {
      router.replace("/notes");
    } else {
      Alert.alert("Signup failed", res.error ?? "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Choose a username"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Choose a password"
        secureTextEntry
        style={styles.input}
      />

      <CustomButton text={loading ? "Creating..." : "Create account"} onPress={onSignup} />

      <Text style={styles.switchText} onPress={() => router.push("/login")}>
        Already have an account? Sign in
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  switchText: {
    marginTop: 16,
    color: "blue",
    textAlign: "center",
  },
});
