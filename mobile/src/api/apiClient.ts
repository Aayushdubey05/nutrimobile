import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { API_BASE_URL, API_TIMEOUT } from "../constants/config";
import { authStorage } from "../services/authStorage";
import type { ApiErrorResponse } from "./types";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await authStorage.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
);

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      (originalRequest as any)._retry
    ) {
      return Promise.reject(error);
    }

    (originalRequest as any)._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshAccessToken();
      }

      const newAccessToken = await refreshPromise;

      if (!newAccessToken) {
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      await authStorage.clearTokens();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  },
);

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await authStorage.getRefreshToken();

  if (!refreshToken) {
    await authStorage.clearTokens();
    return null;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      {
        timeout: API_TIMEOUT,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const authResponse = response.data?.data;

    if (!authResponse?.accessToken || !authResponse?.refreshToken) {
      throw new Error("Invalid refresh response");
    }

    await authStorage.saveTokens(
      authResponse.accessToken,
      authResponse.refreshToken,
    );

    return authResponse.accessToken;
  } catch (error) {
    await authStorage.clearTokens();
    throw error;
  }
}

export { apiClient };
