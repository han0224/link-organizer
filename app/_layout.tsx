// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "내 링크" }} />
      <Stack.Screen
        name="add-link"
        options={{
          title: "링크 추가",
          presentation: "modal",
        }}
      />
      <Stack.Screen name="link/[id]" options={{ title: "링크 상세" }} />
    </Stack>
  );
}
