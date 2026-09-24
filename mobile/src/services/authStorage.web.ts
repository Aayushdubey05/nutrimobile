const ACCESS_TOKEN_KEY = "nutrivision_access_token";
const REFRESH_TOKEN_KEY = "nutrivision_refresh_token";

export const authStorage = {
  async getAccessToken(): Promise<string | null> {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async setAccessToken(token: string): Promise<void> {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<void> {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  async clearTokens(): Promise<void> {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
};