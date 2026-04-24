import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { colors } from "../src/styles/auth-styles";
import { hydrateSesionDesdeAsyncStorage } from "../src/services/auth-api";

export default function RootLayout() {
  const [nativeStorageReady, setNativeStorageReady] = useState(Platform.OS === "web");

  useEffect(() => {
    if (Platform.OS === "web") return;
    let cancelled = false;
    void SplashScreen.preventAutoHideAsync();
    (async () => {
      try {
        await hydrateSesionDesdeAsyncStorage();
      } finally {
        if (!cancelled) {
          setNativeStorageReady(true);
          await SplashScreen.hideAsync().catch(() => {});
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!nativeStorageReady) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "700" },
      }}
    />
  );
}
