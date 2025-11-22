import React, { useEffect } from "react";
import { Stack } from "expo-router";                //  stack wrapper
import { StatusBar } from "expo-status-bar";       // mobile's status bar 
import useAuthStore from "../store/authStore";     //  Zustand auth store
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";


export default function RootLayout() {
  
  const loadUserFromStorage = useAuthStore((s) => s.loadUserFromStorage); // load persisted user
  const user = useAuthStore((s) => s.user);                             // current user (or null)
  const loading = useAuthStore((s) => s.loading);                       // loading flag
  const router = useRouter();  


  useEffect(() => {
    loadUserFromStorage(); // loads user into store (async)
  }, [loadUserFromStorage]);

  useEffect(() => {
   
    if (user) {
     
      router.replace("/notes");
    } else {
      router.replace("/login");
    }
  }, [user, router]);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <>
      <Stack>
        
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="notes" options={{ headerShown: false }} />
        
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}