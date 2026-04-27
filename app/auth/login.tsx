// app/auth/login.tsx
import {
  AUTH_ACCESS_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
} from "@/constants/auth-storage";
import { BaseColors } from "@/constants/theme";
import { exchangeGoogleIdTokenForJwt } from "@/lib/auth/google-backend-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthSessionResult } from "expo-auth-session";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function idTokenFromGoogleResponse(res: AuthSessionResult): string | null {
  if (res.type !== "success") return null;
  const fromAuth = res.authentication
    ? (res.authentication as { idToken?: string }).idToken
    : undefined;
  const fromParams =
    typeof res.params?.id_token === "string" && res.params.id_token.length > 0
      ? res.params.id_token
      : null;
  const token = fromAuth ?? fromParams;
  if (!token) {
    console.warn("[login] idToken 없음", {
      hasAuthentication: Boolean(res.authentication),
      paramKeys: res.params ? Object.keys(res.params) : [],
    });
  }
  return token ?? null;
}

function GoogleIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </Svg>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  /** 같은 idToken으로 서버 POST 중복 방지 (Strict Mode 등) */
  const lastSentIdTokenRef = useRef<string | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const [loginMessage, setLoginMessage] = useState("Google 로그인 대기 중");

  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  const isWeb = Platform.OS === "web";

  const expoClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  const authConfig: Partial<Google.GoogleAuthRequestConfig> = {
    // 플랫폼 ID가 없으면 Google 훅이 clientId(Expo Go용 .apps.googleusercontent.com 등)를 씁니다.
    clientId: expoClientId ?? "MISSING_EXPO_CLIENT_ID",
    scopes: ["openid", "profile", "email"],
    ...(isIOS && iosClientId ? { iosClientId } : {}),
    ...(isAndroid && androidClientId ? { androidClientId } : {}),
    ...(isWeb && webClientId ? { webClientId } : {}),
  };

  const [request, response, promptAsync] =
    Google.useIdTokenAuthRequest(authConfig);

  useEffect(() => {
    if (!response) return;

    if (response.type === "error") {
      setLoginMessage("로그인 실패: auth 응답 에러");
      if (__DEV__ && "error" in response) {
        console.warn("[login] Google error", response.error, response);
      }
      return;
    }

    if (response.type === "dismiss") {
      setLoginMessage("로그인이 취소되었습니다.");
      return;
    }

    if (response.type !== "success") return;

    const idToken = idTokenFromGoogleResponse(response);
    if (!idToken) {
      // 네이티브: code만 먼저 오고 PKCE 교환 후 id_token이 붙습니다. 그 전에는 대기만 합니다.
      const hasPendingCode = Boolean(
        typeof response.params?.code === "string" && response.params.code.length > 0
      );
      if (hasPendingCode) {
        setLoginMessage("Google에서 토큰 발급 중...");
        return;
      }
      setLoginMessage("로그인 실패: Google idToken 없음");
      return;
    }

    if (lastSentIdTokenRef.current === idToken) return;
    lastSentIdTokenRef.current = idToken;

    const handleToken = async () => {
      try {
        setLoadingUserInfo(true);
        setLoginMessage("서버에 로그인 중...");
        const { accessToken, refreshToken } =
          await exchangeGoogleIdTokenForJwt(idToken);
        await AsyncStorage.multiSet([
          [AUTH_ACCESS_TOKEN_KEY, accessToken],
          [AUTH_REFRESH_TOKEN_KEY, refreshToken],
        ]);
        setLoginMessage("로그인 성공");
        router.replace("/");
      } catch (e) {
        const err = e instanceof Error ? e.message : "서버 연결 실패";
        console.error("[login] 서버 교환 실패", e);
        setLoginMessage(err);
      } finally {
        setLoadingUserInfo(false);
      }
    };

    void handleToken();
  }, [response, router]);

  const hasClientId = isIOS
    ? Boolean(iosClientId || expoClientId)
    : isAndroid
    ? Boolean(androidClientId || expoClientId)
    : isWeb
    ? Boolean(webClientId || expoClientId)
    : Boolean(expoClientId);

  return (
    <View
      style={[
        styles.root,
        { paddingBottom: insets.bottom, paddingTop: insets.top },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Google 로그인</Text>
        <Text style={styles.subtitle}>
          Google 인증 후 서버에서 발급한 토큰이 이 기기에 저장됩니다.
        </Text>

      <Pressable
        style={({ pressed }) => [
          styles.gsiButton,
          (!request || !hasClientId || loadingUserInfo) &&
            styles.gsiButtonDisabled,
          pressed && styles.gsiButtonPressed,
        ]}
        onPress={() => {
          setLoginMessage("Google 로그인 진행 중...");
          promptAsync();
        }}
        disabled={!request || !hasClientId || loadingUserInfo}
      >
        <View style={styles.gsiButtonState} />
        <View style={styles.gsiButtonContentWrapper}>
          <View style={styles.gsiButtonIcon}>
            <GoogleIcon size={20} />
          </View>
          <Text style={styles.gsiButtonContents}>Sign in with Google</Text>
        </View>
      </Pressable>

      {loadingUserInfo && <ActivityIndicator color={BaseColors.primary[500]} />}
      <Text style={styles.resultText}>{loginMessage}</Text>

      {!hasClientId && (
        <Text style={styles.warnText}>
          .env에 EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID(공통) 또는 플랫폼용
          EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
          EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID 를 설정하세요. Google Cloud Console
          OAuth 동의화면에 redirect URI를 등록해야 합니다.
        </Text>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BaseColors.background,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    alignItems: "flex-start",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: BaseColors.primary[600],
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: BaseColors.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: BaseColors.gray[600],
    marginBottom: 20,
    textAlign: "center",
  },
  gsiButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BaseColors.white,
    borderWidth: 1,
    borderColor: "#dadce0",
    borderRadius: 4,
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: "relative",
    overflow: "hidden",
  },
  gsiButtonDisabled: {
    opacity: 0.5,
  },
  gsiButtonPressed: {
    backgroundColor: "#f8f9fa",
  },
  gsiButtonState: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)",
    opacity: 0,
  },
  gsiButtonContentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  gsiButtonIcon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  gsiButtonContents: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3c4043",
  },
  resultText: {
    marginTop: 16,
    fontSize: 13,
    color: BaseColors.gray[700],
    textAlign: "center",
  },
  warnText: {
    marginTop: 12,
    fontSize: 12,
    color: BaseColors.red[500],
    textAlign: "center",
  },
});
