// app/_layout.tsx
import { initializeFolders } from "@/utils/storage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    initializeFolders();
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add-link" options={{ presentation: "modal" }} />
          <Stack.Screen name="link/[id]" />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
// // app/_layout.tsx
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <StatusBar style="dark" />
//       <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//           }}
//         >
//           <Stack.Screen name="index" />
//           <Stack.Screen name="add-link" options={{ presentation: "modal" }} />
//           <Stack.Screen name="link/[id]" />
//         </Stack>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }
