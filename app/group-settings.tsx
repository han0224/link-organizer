import { Icon } from "@/components/ui";
import { BaseColors } from "@/constants/theme";
import {
  getGroupById,
  getMockCurrentUserId,
  inviteGroupMember,
  updateGroup,
} from "@/lib/mock-api/group-api";
import { GroupSchema } from "@/storage/group-schema";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function GroupSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [group, setGroup] = useState<GroupSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(GROUP_COLORS[0]);
  const [description, setDescription] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const loadGroup = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const groupData = await getGroupById(id);
      setGroup(groupData);
      setName(groupData.name);
      setColor(groupData.color);
      setDescription(groupData.description);
    } catch (error: any) {
      Alert.alert("오류", error.message || "그룹 정보를 불러오지 못했습니다");
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadGroup();
    }, [loadGroup]),
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={BaseColors.primary[500]} />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.infoText}>그룹을 찾을 수 없습니다</Text>
      </View>
    );
  }

  const isOwner = group.ownerId === getMockCurrentUserId();

  const handleSave = async () => {
    if (!isOwner || !id) return;
    try {
      setSaving(true);
      const updated = await updateGroup(id, { name, color, description });
      setGroup(updated);
      Alert.alert("완료", "그룹 정보가 저장되었습니다");
    } catch (error: any) {
      Alert.alert("오류", error.message || "그룹 수정에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async () => {
    if (!isOwner || !id) return;
    try {
      setInviting(true);
      const updated = await inviteGroupMember(id, {
        name: inviteName,
        email: inviteEmail,
      });
      setGroup(updated);
      setInviteName("");
      setInviteEmail("");
      Alert.alert("완료", "멤버를 초대했습니다");
    } catch (error: any) {
      Alert.alert("오류", error.message || "멤버 초대에 실패했습니다");
    } finally {
      setInviting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Icon name="leftArrow" size={22} color="#121617" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>그룹 설정</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>그룹명</Text>
          <TextInput
            style={[styles.input, !isOwner && styles.readOnlyInput]}
            value={name}
            onChangeText={setName}
            editable={isOwner}
            placeholder="그룹명"
            placeholderTextColor={BaseColors.gray[400]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>색상</Text>
          <View style={styles.colorRow}>
            {GROUP_COLORS.map((candidate) => {
              const isSelected = color === candidate;
              return (
                <Pressable
                  key={candidate}
                  style={[
                    styles.colorButton,
                    { backgroundColor: candidate },
                    isSelected && styles.colorButtonSelected,
                    !isOwner && styles.disabledButton,
                  ]}
                  onPress={() => isOwner && setColor(candidate)}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>그룹 정보</Text>
          <TextInput
            style={[styles.input, styles.textarea, !isOwner && styles.readOnlyInput]}
            value={description}
            onChangeText={setDescription}
            editable={isOwner}
            multiline
            textAlignVertical="top"
            placeholder="그룹 소개"
            placeholderTextColor={BaseColors.gray[400]}
          />
        </View>

        {!isOwner && (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeText}>
              이 그룹은 현재 오너만 수정과 멤버 초대를 할 수 있습니다.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>멤버</Text>
          <View style={styles.memberList}>
            {group.members.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {member.name.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberContent}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                </View>
                <Text style={styles.memberRole}>
                  {member.role === "owner" ? "오너" : "멤버"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {isOwner && (
          <View style={styles.section}>
            <Text style={styles.label}>멤버 초대</Text>
            <TextInput
              style={styles.input}
              value={inviteName}
              onChangeText={setInviteName}
              placeholder="이름"
              placeholderTextColor={BaseColors.gray[400]}
            />
            <TextInput
              style={styles.input}
              value={inviteEmail}
              onChangeText={setInviteEmail}
              placeholder="이메일"
              placeholderTextColor={BaseColors.gray[400]}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleInvite}
              disabled={inviting}
            >
              <Text style={styles.secondaryButtonText}>
                {inviting ? "초대 중..." : "멤버 초대"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {isOwner && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.primaryButtonText}>
              {saving ? "저장 중..." : "변경사항 저장"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: BaseColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#121617",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 140,
    gap: 20,
  },
  section: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: BaseColors.gray[600],
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
  readOnlyInput: {
    color: BaseColors.gray[500],
    backgroundColor: BaseColors.gray[50],
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
    shadowOpacity: 0.14,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  noticeCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: `${BaseColors.primary[500]}10`,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 20,
    color: BaseColors.primary[500],
  },
  memberList: {
    gap: 10,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    backgroundColor: BaseColors.white,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${BaseColors.primary[500]}16`,
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: {
    fontSize: 15,
    fontWeight: "800",
    color: BaseColors.primary[500],
  },
  memberContent: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#121617",
  },
  memberEmail: {
    fontSize: 12,
    color: BaseColors.gray[500],
  },
  memberRole: {
    fontSize: 12,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  secondaryButton: {
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${BaseColors.primary[500]}12`,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: `${BaseColors.background}F2`,
    borderTopWidth: 1,
    borderTopColor: BaseColors.gray[100],
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BaseColors.primary[500],
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: BaseColors.white,
  },
  infoText: {
    fontSize: 14,
    color: BaseColors.gray[500],
  },
});
