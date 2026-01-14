export type FolderStatus = "active" | "archived" | "deleted";

export interface FolderSchema {
  id: string; // uuid
  // 이름은 중복 안되도록?? 고민
  name: string; // 폴더 이름
  createdAt: Date; // 생성일
  updatedAt: Date; // 수정일
  status: FolderStatus; // 폴더 상태
  color: string; // 폴더 색상
  links: string[]; // 링크 ID 배열

  parent?: string; // 부모 폴더 ID (default: null) 추후 계층 구조 구현 시 사용
}

export const DefaultFolderSchema: Omit<FolderSchema, "name" | "id"> = {
  createdAt: new Date(),
  updatedAt: new Date(),
  status: "active",
  color: "#000000",
  links: [],
};
