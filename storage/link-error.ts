import { StorageError } from "./folder-error";

export class LinkNotFoundError extends StorageError {
  constructor(linkId?: string) {
    super(
      linkId ? `링크를 찾을 수 없습니다: ${linkId}` : "링크를 찾을 수 없습니다"
    );
    this.name = "LinkNotFoundError";
    Object.setPrototypeOf(this, LinkNotFoundError.prototype);
  }
}

export class LinkAlreadyExistsError extends StorageError {
  constructor(linkId?: string) {
    super(
      linkId
        ? `이미 존재하는 링크입니다: ${linkId}`
        : "이미 존재하는 링크입니다"
    );
    this.name = "LinkAlreadyExistsError";
    Object.setPrototypeOf(this, LinkAlreadyExistsError.prototype);
  }
}

export class InvalidLinkUrlError extends StorageError {
  constructor() {
    super("링크 URL을 입력해주세요");
    this.name = "InvalidLinkUrlError";
    Object.setPrototypeOf(this, InvalidLinkUrlError.prototype);
  }
}
