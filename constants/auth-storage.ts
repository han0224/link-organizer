/** JWT from Spring after Google idToken exchange */
export const AUTH_ACCESS_TOKEN_KEY = "authAccessToken";
export const AUTH_REFRESH_TOKEN_KEY = "authRefreshToken";

/** @deprecated Prefer AUTH_* — legacy Google OAuth access token from device */
export const GOOGLE_ACCESS_TOKEN_KEY = "googleAccessToken";
/** @deprecated Userinfo from Google API (legacy) */
export const GOOGLE_USER_KEY = "googleUser";

export type GoogleUserInfo = {
  id?: string;
  email?: string;
  name?: string;
  picture?: string;
  verified_email?: boolean;
};
