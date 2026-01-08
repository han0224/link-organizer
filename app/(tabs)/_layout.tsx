// app/(tabs)/_layout.tsx
import { Icon } from "@/components/ui/icon/icon";
import { Tabs, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { getLastTab } from "../../utils/storage";

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    // 앱 시작 시 마지막 탭 불러오기
    const loadInitialTab = async () => {
      const lastTab = await getLastTab();
      // 현재 경로가 탭 루트인 경우에만 리다이렉트
      if (segments.length === 1 && segments[0] === "all") {
        router.replace(`/(tabs)/${lastTab}` as any);
      }
      setInitialRoute(lastTab);
    };
    loadInitialTab();
  }, []);

  return (
    <Tabs
      initialRouteName="all"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          height: Platform.OS === "ios" ? 88 : 60,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="all"
        options={{
          title: "전체",
          tabBarIcon: ({ color, size }) => (
            <Icon name="file" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(folder)"
        options={{
          title: "폴더",
          tabBarIcon: ({ color, size }) => (
            <Icon name="folder" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // 기본 동작 막고
            e.preventDefault();
            // 항상 폴더 초기 화면으로 이동
            router.replace("/(tabs)/(folder)");
          },
        }}
      />
    </Tabs>
  );
}
