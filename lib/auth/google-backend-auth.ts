import { apiUrl } from "@/constants/api";

export type GoogleAuthSuccessResponse = {
  accessToken: string;
  refreshToken: string;
};

/**
 * POST /api/auth/google?idToken=… — Spring에서 idToken 검증 후 JWT 발급.
 */
export async function exchangeGoogleIdTokenForJwt(
  idToken: string
): Promise<GoogleAuthSuccessResponse> {
  const url = new URL(apiUrl("/auth/google"));
  url.searchParams.set("idToken", idToken);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { Accept: "application/json" },
  });

  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = { _raw: text };
    }
  }

  console.log("[api/auth/google] 서버 응답", {
    url,
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    body,
  });

  if (!res.ok) {
    const msg = getErrorMessage(body, res.status);
    throw new Error(msg);
  }

  const tokens = extractTokens(body);
  if (!tokens.accessToken || !tokens.refreshToken) {
    throw new Error(
      "서버 응답에 accessToken·refreshToken이 없습니다. (중첩 data/result 객체도 지원 — 콘솔 body 확인)"
    );
  }
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

/** Spring이 평면 JSON 또는 { data: { accessToken, refreshToken } } 등으로 줄 때 */
function extractTokens(body: unknown): {
  accessToken?: string;
  refreshToken?: string;
} {
  if (!body || typeof body !== "object") return {};
  const root = body as Record<string, unknown>;
  const direct = {
    accessToken: pickString(root, "accessToken", "access_token"),
    refreshToken: pickString(root, "refreshToken", "refresh_token"),
  };
  if (direct.accessToken && direct.refreshToken) return direct;

  const nested = (
    o: unknown
  ): { accessToken?: string; refreshToken?: string } | null => {
    if (!o || typeof o !== "object") return null;
    const r = o as Record<string, unknown>;
    return {
      accessToken: pickString(r, "accessToken", "access_token"),
      refreshToken: pickString(r, "refreshToken", "refresh_token"),
    };
  };

  for (const key of ["data", "result", "body", "payload"] as const) {
    if (!(key in root)) continue;
    const t = nested(root[key]);
    if (t?.accessToken && t?.refreshToken) return t;
  }
  return direct;
}

function pickString(
  obj: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return undefined;
}

function getErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    const m = o.message ?? o.error ?? o.detail;
    if (typeof m === "string" && m.length > 0) return m;
    if (Array.isArray(m) && typeof m[0] === "string") return m[0];
  }
  return `로그인 요청 실패 (${status})`;
}
