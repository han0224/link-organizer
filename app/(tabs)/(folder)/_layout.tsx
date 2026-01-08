// app/(tabs)/(folder)/_layout.tsx
import { Stack } from "expo-router";

export default function FolderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
