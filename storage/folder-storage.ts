// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { FolderAlreadyExistsError, FolderNotFoundError } from "./folder-error";
import { DefaultFolderSchema, FolderSchema } from "./folder-schema";

const FOLDERS_KEY = "folder-storage";

export async function getAllFolders(): Promise<FolderSchema[]> {
  const data = await AsyncStorage.getItem(FOLDERS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getFolderById(id: string): Promise<FolderSchema | null> {
  const folders = await getAllFolders();
  const findFolder = folders.find((f) => f.id === id);
  if (!findFolder) {
    throw new FolderNotFoundError(id);
  }
  return findFolder;
}

// 업데이트 함수: 기존 폴더가 있으면 업데이트, 없으면 추가
export async function updateFolder(folder: FolderSchema): Promise<void> {
  const folders = await getAllFolders();
  const index = folders.findIndex((f) => f.id === folder.id);

  if (index >= 0) {
    // 기존 폴더 업데이트
    folders[index] = {
      ...folder,
      updatedAt: new Date(),
    };
  } else {
    // 새 폴더 추가
    folders.push(folder);
  }

  await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

// 새 폴더 생성 함수: 중복 체크 후 생성
export async function createFolder(
  folder: { name: string } & Partial<Omit<FolderSchema, "name">>
): Promise<void> {
  const folders = await getAllFolders();
  const id = uuidv4();
  if (folders.some((f) => f.id === id)) {
    throw new FolderAlreadyExistsError(id);
  }

  //   TODO: 만들때 한번 확인할 수 있게
  // 같은 이름이 이미 있는지 확인
  if (folders.some((f) => f.name === folder.name)) {
    throw new FolderAlreadyExistsError(folder.name);
  }

  folders.push({ ...DefaultFolderSchema, ...folder, id });
  await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}
// TODO: 폴더 삭제할 경우 내부 링크는 ??
export async function deleteFolder(folderId: string): Promise<void> {
  const folders = await getAllFolders();
  const filtered = folders.filter((f) => f.id !== folderId);

  if (filtered.length === folders.length) {
    throw new FolderNotFoundError(folderId);
  }

  await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(filtered));
}
