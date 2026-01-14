import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  // divider: {
  //   height: 1,
  //   width: "100%",
  //   backgroundColor: "#eee",
  // },

  // 8. 중간 구분선 (점선 형태)
  divider: {
    height: 1, // 선 높이
    borderWidth: 0.5, // 선 굵기
    // TODO: 다크모드 처리
    borderColor: "#000000", // 구분선 색상
    // borderColor: "#3A3A3C", // 구분선 색상
    borderStyle: "dashed", // 점선 스타일 (iOS 지원, Android는 View 조합 필요)
    marginVertical: 16, // 위아래 메뉴와의 간격
    marginHorizontal: 8,
  },
});
