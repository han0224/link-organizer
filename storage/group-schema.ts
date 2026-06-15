export type GroupMemberRole = "owner" | "member";

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  role: GroupMemberRole;
  joinedAt: string;
}

export interface GroupSchema {
  id: string;
  name: string;
  color: string;
  description: string;
  ownerId: string;
  members: GroupMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupInput {
  name: string;
  color: string;
  description: string;
}

export interface UpdateGroupInput {
  name: string;
  color: string;
  description: string;
}

export interface InviteGroupMemberInput {
  name: string;
  email: string;
}
