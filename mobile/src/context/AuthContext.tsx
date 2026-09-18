import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authStorage } from "../services/authStorage";
import { authService } from "../features/auth/services/authService";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserInfo,
} from "../features/auth/types";

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (request: LoginRequest) => Promise<AuthResponse>;
  register: (request: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const accessToken = await authStorage.getAccessToken();

      if (!accessToken) {
        setUser(null);
        return;
      }

      // User information is stored in the auth response,
      // but we will later call /users/me here.
      //
      // For now, access-token existence means a session
      // may exist. The first authenticated API call will
      // validate it.
    } catch (error) {
      console.error("Failed to restore session:", error);
      await authStorage.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(
    request: LoginRequest
  ): Promise<AuthResponse> {
    const response = await authService.login(request);

    await authStorage.saveTokens(
      response.accessToken,
      response.refreshToken
    );

    setUser(response.user);

    return response;
  }

  async function register(
    request: RegisterRequest
  ): Promise<AuthResponse> {
    const response = await authService.register(request);

    await authStorage.saveTokens(
      response.accessToken,
      response.refreshToken
    );

    setUser(response.user);

    return response;
  }

  async function logout() {
    await authStorage.clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}