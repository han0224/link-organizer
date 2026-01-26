/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

// 기본 색상 상수
export const BaseColors = {
  // f9fafb
  background: "#f8f8fc", // 기본 배경색 (background-light)
  backgroundSecondary: "#f5f5f5", // 보조 배경색
  backgroundDark: "#1a1a1a", // 다크 모드 배경색
  white: "#fff",
  black: "#000",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d4d4d4",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#525252",
    700: "#374151",
    800: "#262626",
    900: "#111827",
  },
  primary: {
    50: "#eff6ff",
    200: "#bfdbfe",
      
    // 500: "#3b82f6",
    500: "#34626f", // HTML에서 가져온 primary 색상
    600: "#2563eb",
  },
  card: {
    light: "#ffffff",
    dark: "#262626",
  },
  red: {
    500: "#ef4444",
  },
};

export const Colors = {
  light: {
    text: "#11181C",
    background: BaseColors.background,
    backgroundSecondary: BaseColors.backgroundSecondary,
    white: BaseColors.white,
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
