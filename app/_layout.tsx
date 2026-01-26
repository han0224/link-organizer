// app/_layout.tsx
import { BaseColors } from "@/constants/theme";
import { Stack } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ExpoStatusBar style="dark" />
        {Platform.OS === "android" && (
          <StatusBar
            backgroundColor={BaseColors.background}
            barStyle="dark-content"
          />
        )}
        <SafeAreaView
          style={{ flex: 1, backgroundColor: BaseColors.background }}
          edges={["top", "bottom"]}
        >
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="search-link" />
            <Stack.Screen name="add-link" options={{ presentation: "modal" }} />
            <Stack.Screen name="link/[id]" />
            <Stack.Screen name="folders" />
            <Stack.Screen name="folder/[id]" />
            <Stack.Screen name="setting/index" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
