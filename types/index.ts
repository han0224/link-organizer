// types/index.ts
export type LinkType = "youtube" | "blog" | "article" | "video" | "other";

export interface Link {
  id: string;
  url: string;
  title: string;
  type: LinkType;
  tags: string[];
  memo: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  folder: string;
}
