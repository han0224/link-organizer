import BottomNavigation from "@/components/bottom-navigation";
import FloatingButton from "@/components/floating-button";
import { Icon } from "@/components/ui";
import { BaseColors } from "@/constants/theme";
import { createGroup, listGroups } from "@/lib/mock-api/group-api";
import { GroupSchema } from "@/storage/group-schema";
import { getLinksByGroupId } from "@/storage/link-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GROUP_COLORS = ["#34626f", "#ef4444", "#f59e0b", "#10b981", "#3b82f6"];

function GroupCard({
  group,
  linkCount,
  onPress,
}: {
  group: GroupSchema;
  linkCount: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.groupCard,
        pressed && styles.groupCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.groupColor, { backgroundColor: group.color }]} />
      <View style={styles.groupCardBody}>
        <View style={styles.groupCardTop}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupMeta}>{group.members.length}명</Text>
        </View>
        <Text style={styles.groupDescription} numberOfLines={2}>
          {group.description || "그룹 설명이 아직 없습니다"}
        </Text>
        <Text style={styles.groupSubtext}>공유 링크 {linkCount}개</Text>
      </View>
    </Pressable>
  );
}

export default function GroupsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [groups, setGroups] = useState<GroupSchema[]>([]);
  const [linkCounts, setLinkCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState(GROUP_COLORS[0]);
  const [newGroupDescription, setNewGroupDescription] = useState("");

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const groupList = await listGroups();
      setGroups(groupList);

      const counts = await Promise.all(
        groupList.map(async (group) => {
          const links = await getLinksByGroupId(group.id);
          return [group.id, links.length] as const;
        }),
      );
      setLinkCounts(Object.fromEntries(counts));
    } catch (error: any) {
      Alert.alert("오류", error.message || "그룹 목록을 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [loadGroups]),
  );

  const resetCreateForm = () => {
    setNewGroupName("");
    setNewGroupColor(GROUP_COLORS[0]);
    setNewGroupDescription("");
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert("오류", "그룹명을 입력해주세요");
      return;
    }

    try {
      setCreating(true);
      const group = await createGroup({
        name: newGroupName,
        color: newGroupColor,
        description: newGroupDescription,
      });
      setShowCreateModal(false);
      resetCreateForm();
      await loadGroups();
      router.push(`/group/${group.id}`);
    } catch (error: any) {
      Alert.alert("오류", error.message || "그룹 생성에 실패했습니다");
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>그룹</Text>
        <Text style={styles.headerSubtitle}>
          팀 링크를 한 곳에 모으고 멤버와 같이 관리하세요.
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color={BaseColors.primary[500]} />
          </View>
        ) : groups.length === 0 ? (
          <Pressable
            style={({ pressed }) => [
              styles.emptyCreateCard,
              pressed && styles.groupCardPressed,
            ]}
            onPress={() => setShowCreateModal(true)}
          >
            <View style={styles.emptyCreateIcon}>
              <Icon name="add" size={28} color={BaseColors.primary[500]} />
            </View>
            <Text style={styles.emptyCreateTitle}>첫 그룹 만들기</Text>
            <Text style={styles.emptyCreateText}>
              그룹명, 색상, 소개를 정하고 멤버와 링크를 모아보세요.
            </Text>
          </Pressable>
        ) : (
          <View style={styles.groupList}>
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                linkCount={linkCounts[group.id] ?? 0}
                onPress={() => router.push(`/group/${group.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {groups.length > 0 && (
        <FloatingButton
          onPress={() => setShowCreateModal(true)}
          icon="add"
          style={styles.fab}
        />
      )}

      <BottomNavigation />

      <Modal
        transparent
        visible={showCreateModal}
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>그룹 추가</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Icon name="close" size={22} color={BaseColors.gray[500]} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="그룹명"
              placeholderTextColor={BaseColors.gray[400]}
            />

            <View style={styles.colorRow}>
              {GROUP_COLORS.map((color) => {
                const isSelected = newGroupColor === color;
                return (
                  <Pressable
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      isSelected && styles.colorButtonSelected,
                    ]}
                    onPress={() => setNewGroupColor(color)}
                  />
                );
              })}
            </View>

            <TextInput
              style={[styles.input, styles.textarea]}
              value={newGroupDescription}
              onChangeText={setNewGroupDescription}
              placeholder="그룹 정보"
              placeholderTextColor={BaseColors.gray[400]}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCreateGroup}
              disabled={creating}
            >
              <Text style={styles.primaryButtonText}>
                {creating ? "추가 중..." : "그룹 추가"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#121617",
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: BaseColors.gray[500],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  groupList: {
    gap: 12,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: BaseColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    overflow: "hidden",
  },
  groupCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  groupColor: {
    width: 10,
  },
  groupCardBody: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  groupCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  groupName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#121617",
  },
  groupMeta: {
    fontSize: 12,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  groupDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: BaseColors.gray[600],
  },
  groupSubtext: {
    fontSize: 12,
    color: BaseColors.gray[400],
  },
  stateBox: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCreateCard: {
    backgroundColor: BaseColors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: BaseColors.primary[500],
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 12,
  },
  emptyCreateIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${BaseColors.primary[500]}14`,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCreateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#121617",
  },
  emptyCreateText: {
    fontSize: 14,
    lineHeight: 21,
    color: BaseColors.gray[500],
    textAlign: "center",
  },
  fab: {
    bottom: 96,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.28)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: BaseColors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 14,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#121617",
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    backgroundColor: BaseColors.white,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#121617",
  },
  textarea: {
    minHeight: 120,
    paddingTop: 16,
  },
  colorRow: {
    flexDirection: "row",
    gap: 10,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorButtonSelected: {
    borderWidth: 3,
    borderColor: BaseColors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: BaseColors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: BaseColors.white,
  },
});
