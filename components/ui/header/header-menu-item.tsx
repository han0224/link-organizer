import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Icon } from "../icon/icon";
import type { IconName } from "../icon/icons";

export function HeaderMenuItem({
  name,
  icon,
  onPress,
  style,
  textStyle,
  isSelected,
  count,
  subFolderIndent = false,
}: {
  name: string;
  icon?: IconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isSelected?: boolean;
  count?: number;
  subFolderIndent?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isSelected && styles.selectedItemBg,
        subFolderIndent && styles.subFolderIndent,
        style,
      ]}
      onPress={onPress}
    >
      <View>
        {icon && (
          <View style={styles.iconContainer}>
            <Icon name={icon} size={24} color="#333" />
          </View>
        )}
      </View>
      <Text style={[styles.menuItemText, textStyle, ,]}>{name}</Text>
      {count !== undefined && count !== null && (
        <Text style={styles.countText}>{count.toString()}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 48, // 각 행의 높이 (터치 영역 확보)
    paddingHorizontal: 8, // 아이템 내부 좌우 간격
    gap: 10,
    marginVertical: 2, // 아이템 간의 미세한 상하 간격
    borderRadius: 10, // 모서리 곡률 (약간 둥글게)
    // backgroundColor: "red",
  },
  menuItemText: {
    flex: 1, // 가용한 공간 모두 차지 (숫자를 오른쪽으로 빎)
    fontSize: 15, // 글자 크기
    fontWeight: "600", // 일반 굵기
    // TODO: 다크모드 처리
    // color: "#FFFFFF", // 기본 흰색 글자
  },

  selectedItemBg: {
    // TODO: 다크모드 처리된 색상으로 변경
    backgroundColor: "#cecece", // 하이라이트 배경색
    // backgroundColor: "#2C2C2E", // 하이라이트 배경색
  },

  iconContainer: {
    width: 24, // 아이콘 영역 너비 고정
    marginRight: 12, // 아이콘과 글자 사이 간격
    justifyContent: "center",
    alignItems: "center",
  },

  countText: {
    fontSize: 13, // 메뉴보다 약간 작은 크기
    // TODO: 다크모드 처리
    color: "#636366", // 흐릿한 회색 (중요도 낮음 표시)
    marginLeft: 10,
  },

  subFolderIndent: {
    marginLeft: 32, // 상위 폴더 아이콘 시작점만큼 왼쪽 마진
  },

  // // 9. 베타 라벨 (공유 노트 옆)
  // betaBadge: {
  //   backgroundColor: "#3A3A3C",
  //   paddingHorizontal: 4,
  //   paddingVertical: 2,
  //   borderRadius: 4,
  //   marginLeft: 6,
  // },
  // betaText: {
  //   fontSize: 10,
  //   color: "#E5E5E7",
  //   fontWeight: "bold",
  // },
});
