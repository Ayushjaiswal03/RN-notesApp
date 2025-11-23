// app/_layout.tsx
// Root layout for expo-router. Loads persisted user and safely redirects to login/notes.
// Important: ensure a Slot is rendered on first render (expo-router requires this).

import React, { useEffect } from "react";
import { Slot, useRouter, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import useAuthStore from "../store/authStore";

/*
  Strategy:
  - load persisted user (Zustand store)
  - wait until rootNavigationState exists (navigation tree mounted)
  - then safely call router.replace(...) inside setTimeout(0)
    which prevents the "Attempted to navigate before mounting" error that
    can occur when navigation hasn't fully initialized.
*/

export default function RootLayout() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  // Zustand store functions / values
  const loadUserFromStorage = useAuthStore((s) => s.loadUserFromStorage);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  // on mount, trigger loading of persisted user
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // When router/navigation tree is present and user loading finished,
  // perform safe redirect. The guard prevents navigation before mount.
  useEffect(() => {
    // rootNavigationState is undefined until the navigation container is ready.
    if (!rootNavigationState) return;

    // Do the replace in a microtask to ensure nav tree is mounted.
    setTimeout(() => {
      if (user) {
        router.replace("/notes");
      } else {
        router.replace("/login");
      }
    }, 0);
  }, [rootNavigationState, user, router]);

  // show a loader while auth store initializes (loading flag)
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Render children routes via Slot (expo-router requires this)
  return (
    <>
      <Slot />      {/* this renders the current route's component */}
      <StatusBar style="auto" />
    </>
  );
}
