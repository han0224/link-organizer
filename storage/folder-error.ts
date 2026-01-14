// errors/storage-errors.ts
export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}

export class FolderNotFoundError extends StorageError {
  constructor(folderId?: string) {
    super(
      folderId
        ? `폴더를 찾을 수 없습니다: ${folderId}`
        : "폴더를 찾을 수 없습니다"
    );
    this.name = "FolderNotFoundError";
    Object.setPrototypeOf(this, FolderNotFoundError.prototype);
  }
}

export class FolderAlreadyExistsError extends StorageError {
  constructor(folderId?: string) {
    super(
      folderId
        ? `이미 존재하는 폴더입니다: ${folderId}`
        : "이미 존재하는 폴더입니다"
    );
    this.name = "FolderAlreadyExistsError";
    Object.setPrototypeOf(this, FolderAlreadyExistsError.prototype);
  }
}

export class InvalidFolderNameError extends StorageError {
  constructor() {
    super("폴더 이름을 입력해주세요");
    this.name = "InvalidFolderNameError";
    Object.setPrototypeOf(this, InvalidFolderNameError.prototype);
  }
}
