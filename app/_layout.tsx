// app/_layout.tsx
import "react-native-get-random-values";

import { BaseColors } from "@/constants/theme";
import * as Linking from "expo-linking";
import { router, Stack } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

/**
 * 공유된 텍스트에서 URL을 추출합니다.
 * Android에서 다른 앱이 text/plain으로 공유하면 URL이 텍스트에 포함됩니다.
 */
function extractUrl(text: string): string | null {
  const urlRegex = /https?:\/\/[^\s]+/i;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

/**
 * 공유된 URL을 처리하고 add-link 페이지로 이동합니다.
 */
export default function RootLayout() {
  const lastHandledSharedUrlRef = useRef<{
    sharedUrl: string;
    handledAt: number;
  } | null>(null);

  const handleSharedUrl = (incoming: string) => {
    // Web에서는 내부 라우팅(URL 변경)이 "url 이벤트"로 들어와 무한 루프가 날 수 있어
    // 공유 딥링크 처리를 비활성화합니다. (웹 공유는 별도 Web Share API로 처리하는 편)
    if (Platform.OS === "web") return;

    const parsed = Linking.parse(incoming);

    let candidateSharedUrl: string | null = null;

    // 1) 딥링크로 직접 들어온 경우: linkorganizer://add-link?url=...
    if (parsed.path === "add-link" && parsed.queryParams?.url) {
      candidateSharedUrl = parsed.queryParams.url as string;
    } else {
      // 2) Android SEND intent로 공유된 경우: 텍스트에서 URL 추출
      // intent로 공유되면 URL 자체가 텍스트로 전달될 수 있음
      candidateSharedUrl = extractUrl(incoming);
    }

    if (!candidateSharedUrl) return;

    // getInitialURL + addEventListener가 연속으로 들어오거나,
    // 일부 기기에서 이벤트가 중복 발화할 수 있어 dedupe 합니다.
    const last = lastHandledSharedUrlRef.current;
    const now = Date.now();
    if (
      last &&
      last.sharedUrl === candidateSharedUrl &&
      now - last.handledAt < 1000
    ) {
      return;
    }
    lastHandledSharedUrlRef.current = {
      sharedUrl: candidateSharedUrl,
      handledAt: now,
    };

    router.push({
      pathname: "/add-link",
      params: { sharedUrl: candidateSharedUrl },
    });
  };

  // 앱이 이미 열려있을 때 공유가 들어오는 경우
  useEffect(() => {
    if (Platform.OS === "web") return;
    const subscription = Linking.addEventListener("url", (event) => {
      handleSharedUrl(event.url);
    });
    return () => subscription.remove();
  }, []);

  // 앱이 닫혀있을 때 공유로 열리는 경우
  useEffect(() => {
    if (Platform.OS === "web") return;
    const checkInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        // 약간의 딜레이를 줘서 라우터가 준비된 후 이동
        setTimeout(() => {
          handleSharedUrl(initialUrl);
        }, 500);
      }
    };
    checkInitialUrl();
  }, []);

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
            <Stack.Screen name="groups" />
            <Stack.Screen name="group/[id]" />
            <Stack.Screen name="group-settings" />
            <Stack.Screen name="setting/index" />
            <Stack.Screen name="auth/login" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
