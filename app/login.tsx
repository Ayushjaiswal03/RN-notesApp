import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import useAuthStore from "../store/authStore";
import CustomButton from "../components/customButton";

export default function LoginScreen() {
  const router = useRouter();                       //  navigation
  const login = useAuthStore((s) => s.login);      // login from store
  const loading = useAuthStore((s) => s.loading);  // loading 
  const [username, setUsername] = useState("");    // input 
  const [password, setPassword] = useState("");

  // when user presses login button
  const onLogin = async () => {
    
    if (!username.trim() || !password.trim()) {
      Alert.alert("Validation", "Please enter username and password");
      return;
    }

    const res = await login(username.trim(), password.trim());
    if (res.ok) {
      
      router.replace("/notes");
    } else {
      
      Alert.alert("Login failed", res.error ?? "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

      <TextInput
        value={username}                              
        onChangeText={setUsername}                    
        placeholder="Username"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      <CustomButton text={loading ? "Signing in..." : "Sign In"} onPress={onLogin} />

      
      <Text style={styles.switchText} onPress={() => router.push("/signup")}>
        Don't have an account? Sign up
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
