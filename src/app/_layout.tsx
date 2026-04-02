import { useEffect } from "react";

import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppSettingsProvider } from "@/context/app-settings-context";
import { RecipeHistoryProvider } from "@/context/recipe-history-context";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ProtestStrike: require("../../public/ProtestStrike-Regular.ttf")
  });

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <RecipeHistoryProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" }
            }}
          />
        </RecipeHistoryProvider>
      </AppSettingsProvider>
    </SafeAreaProvider>
  );
}
