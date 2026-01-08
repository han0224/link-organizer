// utils/storage.ts
import { DEFAULT_FOLDER } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "../types";

const LAST_TAB_KEY = "lastTab";
const FOLDERS_KEY = "folders";

// 초기화 플래그 (메모리 캐시)
let isInitialized = false;

export async function getLastTab(): Promise<string> {
  const tab = await AsyncStorage.getItem(LAST_TAB_KEY);
  return tab || "all"; // 기본값은 "all"
}

export async function saveLastTab(tab: string): Promise<void> {
  await AsyncStorage.setItem(LAST_TAB_KEY, tab);
}

const LINKS_KEY = "links";

export async function getLinks(): Promise<Link[]> {
  const data = await AsyncStorage.getItem(LINKS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveLink(link: Link): Promise<void> {
  const links = await getLinks();
  const index = links.findIndex((l) => l.id === link.id);

  if (index >= 0) {
    links[index] = link;
  } else {
    links.unshift(link);
  }

  await AsyncStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

export async function deleteLink(id: string): Promise<void> {
  const links = await getLinks();
  const filtered = links.filter((l) => l.id !== id);
  await AsyncStorage.setItem(LINKS_KEY, JSON.stringify(filtered));
}

export async function getAllTags(): Promise<string[]> {
  const links = await getLinks();
  const tagSet = new Set<string>();

  links.forEach((link) => {
    link.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export async function getFolders(): Promise<string[]> {
  const data = await AsyncStorage.getItem(FOLDERS_KEY);
  return data ? JSON.parse(data) : [];
}
export async function saveFolder(folder: string): Promise<void> {
  const folders = await getFolders();
  folders.push(folder);
  await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}
export async function createFolder(folder: string): Promise<void> {
  const folders = await getFolders();
  folders.push(folder);
  await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}
// TODO: 폴더 삭제할 경우 내부 링크는 ??
export async function deleteFolder(folder: string): Promise<void> {
  const folders = await getFolders();
  const filtered = folders.filter((f) => f !== folder);
  await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(filtered));
}
// 특정 폴더에 속한 링크들만 가져오는 함수
export async function getLinksByFolder(folderName: string): Promise<Link[]> {
  const links = await getLinks();
  return links.filter((link) => link.folder === folderName);
}

// 기본 폴더가 존재하는지 확인하고 없으면 생성
async function ensureDefaultFolder(): Promise<void> {
  const folders = await getFolders();
  if (!folders.includes(DEFAULT_FOLDER)) {
    folders.unshift(DEFAULT_FOLDER);
    await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  }
}
// 폴더 초기화 함수 (앱 시작 시 한 번만 호출)
export async function initializeFolders(): Promise<void> {
  if (isInitialized) return;

  const data = await AsyncStorage.getItem(FOLDERS_KEY);
  const folders = data ? JSON.parse(data) : [];

  // 기본 폴더가 없으면 추가
  if (!folders.includes(DEFAULT_FOLDER)) {
    folders.unshift(DEFAULT_FOLDER);
    await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  }

  isInitialized = true;
}
