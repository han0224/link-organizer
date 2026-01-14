// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { getAllFolders, updateFolder } from "./folder-storage";
import { LinkAlreadyExistsError, LinkNotFoundError } from "./link-error";
import { CreateLinkSchema, LinkSchema } from "./link-schema";

const LINKS_KEY = "link-storage";

// 폴더의 links 배열 업데이트 헬퍼 함수
async function updateFolderLinks(
  folderId: string,
  linkId: string,
  action: "add" | "remove"
): Promise<void> {
  if (!folderId) return; // 폴더가 없으면 스킵

  const folders = await getAllFolders();
  const folder = folders.find((f) => f.id === folderId);

  if (!folder) return; // 폴더를 찾을 수 없으면 스킵

  if (action === "add") {
    // 링크 ID가 이미 있으면 추가하지 않음
    if (!folder.links.includes(linkId)) {
      folder.links.push(linkId);
    }
  } else if (action === "remove") {
    folder.links = folder.links.filter((id) => id !== linkId);
  }

  // 폴더 업데이트
  await updateFolder(folder);
}

export async function getAllLinks(): Promise<LinkSchema[]> {
  const data = await AsyncStorage.getItem(LINKS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getLinksByFolderId(
  folderId: string
): Promise<LinkSchema[]> {
  const links = await getAllLinks();
  console.log("links", links);
  return links.filter((l) => l.folder === folderId);
}

export async function updateLink(link: LinkSchema): Promise<void> {
  const links = await getAllLinks();
  const index = links.findIndex((l) => l.id === link.id);

  if (index < 0) {
    throw new LinkNotFoundError(link.id);
  }
  const oldLink = links[index];
  const oldFolderId = oldLink.folder;
  const newFolderId = link.folder;
  links[index] = {
    ...link,
    updatedAt: new Date(),
  };
  await AsyncStorage.setItem(LINKS_KEY, JSON.stringify(links));

  if (oldFolderId === newFolderId) {
    newFolderId && (await updateFolderLinks(newFolderId, link.id, "add"));
    return;
  }
  if (oldFolderId) {
    await updateFolderLinks(oldFolderId, link.id, "remove");
  }
  if (newFolderId) {
    await updateFolderLinks(newFolderId, link.id, "add");
  }
}

export async function createLink(link: CreateLinkSchema): Promise<void> {
  const links = await getAllLinks();
  const id = uuidv4();
  if (links.some((l) => l.id === id)) {
    throw new LinkAlreadyExistsError(id);
  }
  const createdLink: LinkSchema = {
    ...link,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  };
  links.push(createdLink);
  await AsyncStorage.setItem(LINKS_KEY, JSON.stringify(links));
  createdLink.folder &&
    (await updateFolderLinks(createdLink.folder, id, "add"));
}

export async function deleteLink(id: string): Promise<void> {
  const links = await getAllLinks();
  const linkToDelete = links.find((l) => l.id === id);

  if (!linkToDelete) {
    throw new LinkNotFoundError(id);
  }

  const filtered = links.filter((l) => l.id !== id);
  await AsyncStorage.setItem(LINKS_KEY, JSON.stringify(filtered));

  linkToDelete.folder &&
    (await updateFolderLinks(linkToDelete.folder, id, "remove"));
}

export async function getAllTags(): Promise<string[]> {
  const links = await getAllLinks();
  const tagSet = new Set<string>();

  links.forEach((link) => {
    link.tags?.forEach((tag) => tag && tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
