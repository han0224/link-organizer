export type LinkType = "youtube" | "blog" | "article" | "video" | "other";
export type LinkStatus = "active" | "archived" | "deleted";

export interface LinkSchema {
  id: string; // uuid
  url: string; // 링크 주소
  title: string; // 화면에 보일 제목
  type: LinkType; // 링크 타입
  tags?: string[]; // 태그
  memo?: string; // 메모
  thumbnail?: string; // 썸네일
  createdAt: Date; // 생성일
  updatedAt: Date; // 수정일
  folder?: string; // 폴더 ID
  status: LinkStatus; // 폴더 상태
}

export interface CreateLinkSchema {
  url: string;
  title: string;
  type: LinkType;
  memo?: string;
  tags?: string[];
  thumbnail?: string;
  folder?: string; // 폴더 ID
}
