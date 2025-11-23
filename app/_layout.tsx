import React, { useEffect } from "react";
import { Slot, useRouter, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import useAuthStore from "../store/authStore";


export default function RootLayout() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  // Zustand store functions / values
  const loadUserFromStorage = useAuthStore((s) => s.loadUserFromStorage);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  // on mount, trigger loading
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  useEffect(() => {
    if (!rootNavigationState) return;

    setTimeout(() => {
      if (user) {
        router.replace("/notes");
      } else {
        router.replace("/login");
      }
    }, 0);
  }, [rootNavigationState, user, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <>
      <Slot />      
      <StatusBar style="auto" />
    </>
  );
}
