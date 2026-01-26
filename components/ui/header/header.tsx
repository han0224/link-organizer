import { useToggle } from "@/hooks/useToggle";
import { FolderSchema } from "@/storage/folder-schema";
import { getAllFolders } from "@/storage/folder-storage";
import {
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../button";
import { Divider } from "../divider";
import { Icon } from "../icon/icon";
import { HeaderMenuItem } from "./header-menu-item";

interface HeaderProps {
  title: string;
  isSearch?: boolean;
  cancelable?: boolean;
  rightAction?: React.ReactNode;
}

const SIDEBAR_WIDTH = 300;

export function Header({
  title,
  isSearch = true,
  cancelable = false,
}: HeaderProps) {
  const [isMenuOpen, toggleMenu] = useToggle();
  const insets = useSafeAreaInsets();
  const [folders, setFolders] = useState<FolderSchema[]>([]);
  const { height } = Dimensions.get("window");
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useLocalSearchParams<{ id: string }>();

  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, []),
  );

  const handleMenuPress = async () => {
    if (cancelable) {
      router.back();
    } else {
      // 메뉴를 열 때마다 폴더 목록 새로고침
      if (!isMenuOpen) {
        await loadFolders();
      }
      toggleMenu();
    }
  };

  const loadFolders = async () => {
    const folderList = await getAllFolders();
    setFolders(folderList);

    // // 각 폴더의 링크 개수와 썸네일 미리보기 로드
    // const linksMap: Record<string, Link[]> = {};
    // for (const folder of folderList) {
    //   const links = await getLinksByFolder(folder);
    //   linksMap[folder] = links;
    // }
    // setFolderLinks(linksMap);
  };

  const handleClickFolder = (folder: string) => {
    toggleMenu();
    if (id === folder) {
      return;
    }
    router.push({
      pathname: "/folder/[id]",
      params: { id: folder },
    });
  };

  const isSelectedFolder = (folder: string) => {
    return id === folder;
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleMenuPress}>
            <Icon name={cancelable ? "close" : "hamburger"} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>{title}</Text>

        {isSearch && (
          <TouchableOpacity onPress={() => router.push("/search-link")}>
            <Icon name="search" />
          </TouchableOpacity>
        )}
      </View>
      {/* Modal로 dim 처리 - SafeArea까지 포함 */}
      <Modal
        visible={isMenuOpen}
        transparent
        onRequestClose={toggleMenu}
        statusBarTranslucent={Platform.OS === "android"} // Android에서 StatusBar까지 덮기
      >
        <TouchableOpacity
          style={styles.dim}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <ScrollView
            style={[
              styles.menuContainer,
              {
                top: insets.top,
                height: height - insets.top - insets.bottom,
                maxHeight: height - insets.top - insets.bottom,
              },
            ]}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <HeaderMenuItem
              name="모든 링크"
              icon="folder"
              onPress={() => {
                toggleMenu();
                router.push("/");
              }}
              isSelected={pathname === "/"}
            />
            <HeaderMenuItem name="휴지통" icon="trashFull" onPress={() => {}} />
            <Divider style={{ marginVertical: 10 }} />
            <HeaderMenuItem name="공유 폴더" icon="cloud" onPress={() => {}} />
            <Divider style={{ marginVertical: 10 }} />
            <HeaderMenuItem name="폴더" icon="folders" onPress={() => {}} />

            {folders.map((folder) => {
              const isSelected = isSelectedFolder(folder.id);
              return (
                <HeaderMenuItem
                  key={folder.id}
                  name={folder.name}
                  icon={isSelected ? "folderFilled" : "folder"}
                  iconColor={folder.color}
                  count={folder.links.length}
                  onPress={() => handleClickFolder(folder.id)}
                  isSelected={isSelected}
                  subFolderIndent
                />
              );
            })}
            <Button
              title="폴더 관리"
              onPress={() => {
                toggleMenu();
                router.push("/folders");
              }}
            />
          </ScrollView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 105 / 2,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerDark: {
    backgroundColor: "#000", // 검정색
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  menuContainer: {
    position: "absolute",
    // top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    // height: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 8, // 오른쪽 상단
    borderBottomRightRadius: 8, // 오른쪽 하단
    shadowColor: "#454545",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    zIndex: 1001,
  },
  dim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 검정색
    zIndex: 1000, // 메뉴보다는 아래, 다른 콘텐츠보다는 위
  },
});
