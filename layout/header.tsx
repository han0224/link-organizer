import React, { JSX, PropsWithChildren } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CustomHeaderProps {
  headerText?: string | number;
  isBackButton?: boolean;
  headerRightEl?: JSX.Element;
  onlyChildren?: boolean;
}
function CustomHeader({
  children,
  isBackButton,
  headerRightEl,
  onlyChildren,
}: PropsWithChildren<CustomHeaderProps>) {
  const { top } = useSafeAreaInsets();
  const isAndroid = Platform.OS === "android";
  console.log("top", top);
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {onlyChildren ? (
          children
        ) : (
          <>
            {children}
            {headerRightEl ? (
              headerRightEl
            ) : (
              <View style={{ width: 24, height: 24 }} />
            )}
          </>
        )}
      </View>
    </View>
  );
}

export function EmptyBox() {
  return <View style={{ width: 24, height: 24 }} />;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
});
export default CustomHeader;
