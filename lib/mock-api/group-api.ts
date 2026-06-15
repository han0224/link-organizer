import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import {
  CreateGroupInput,
  GroupMember,
  GroupSchema,
  InviteGroupMemberInput,
  UpdateGroupInput,
} from "@/storage/group-schema";

const GROUPS_KEY = "mock-group-storage";
const MOCK_DELAY_MS = 180;
const CURRENT_USER_ID = "mock-user-me";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeGroups(raw: string | null): GroupSchema[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as GroupSchema[];
  } catch {
    return [];
  }
}

async function readGroups(): Promise<GroupSchema[]> {
  const raw = await AsyncStorage.getItem(GROUPS_KEY);
  const groups = normalizeGroups(raw);
  return groups.sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

async function writeGroups(groups: GroupSchema[]) {
  await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

function assertOwner(group: GroupSchema) {
  if (group.ownerId !== CURRENT_USER_ID) {
    throw new Error("이 그룹을 수정할 권한이 없습니다");
  }
}

export function getMockCurrentUserId() {
  return CURRENT_USER_ID;
}

export async function listGroups(): Promise<GroupSchema[]> {
  await wait(MOCK_DELAY_MS);
  return readGroups();
}

export async function getGroupById(groupId: string): Promise<GroupSchema> {
  await wait(MOCK_DELAY_MS);
  const groups = await readGroups();
  const group = groups.find((item) => item.id === groupId);
  if (!group) {
    throw new Error("그룹을 찾을 수 없습니다");
  }
  return group;
}

export async function createGroup(
  input: CreateGroupInput,
): Promise<GroupSchema> {
  await wait(MOCK_DELAY_MS);
  const trimmedName = input.name.trim();
  if (!trimmedName) {
    throw new Error("그룹명을 입력해주세요");
  }

  const groups = await readGroups();
  const now = new Date().toISOString();
  const ownerMember: GroupMember = {
    id: CURRENT_USER_ID,
    name: "나",
    email: "me@example.com",
    role: "owner",
    joinedAt: now,
  };

  const group: GroupSchema = {
    id: uuidv4(),
    name: trimmedName,
    color: input.color,
    description: input.description.trim(),
    ownerId: CURRENT_USER_ID,
    members: [ownerMember],
    createdAt: now,
    updatedAt: now,
  };

  groups.unshift(group);
  await writeGroups(groups);
  return group;
}

export async function updateGroup(
  groupId: string,
  input: UpdateGroupInput,
): Promise<GroupSchema> {
  await wait(MOCK_DELAY_MS);
  const groups = await readGroups();
  const index = groups.findIndex((item) => item.id === groupId);
  if (index < 0) {
    throw new Error("그룹을 찾을 수 없습니다");
  }

  assertOwner(groups[index]);

  const updatedGroup: GroupSchema = {
    ...groups[index],
    name: input.name.trim(),
    color: input.color,
    description: input.description.trim(),
    updatedAt: new Date().toISOString(),
  };
  groups[index] = updatedGroup;
  await writeGroups(groups);
  return updatedGroup;
}

export async function inviteGroupMember(
  groupId: string,
  input: InviteGroupMemberInput,
): Promise<GroupSchema> {
  await wait(MOCK_DELAY_MS);
  const groups = await readGroups();
  const index = groups.findIndex((item) => item.id === groupId);
  if (index < 0) {
    throw new Error("그룹을 찾을 수 없습니다");
  }

  const group = groups[index];
  assertOwner(group);

  const normalizedEmail = input.email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error("이메일을 입력해주세요");
  }

  const alreadyJoined = group.members.some(
    (member) => member.email.toLowerCase() === normalizedEmail,
  );
  if (alreadyJoined) {
    throw new Error("이미 참여 중인 멤버입니다");
  }

  const nextGroup: GroupSchema = {
    ...group,
    members: [
      ...group.members,
      {
        id: uuidv4(),
        name: input.name.trim() || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        role: "member",
        joinedAt: new Date().toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  groups[index] = nextGroup;
  await writeGroups(groups);
  return nextGroup;
}
