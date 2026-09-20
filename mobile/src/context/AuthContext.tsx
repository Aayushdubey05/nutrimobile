import { createContext, useEffect, useState, type ReactNode } from "react";

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
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
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

      const user = await authService.getCurrentUser();

      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toString(),
      });
    } catch (error) {
      console.log("Session restore failed:", error);

      await authStorage.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshUser() {
    const currentUser = await authService.getCurrentUser();

    setUser({
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role.toString(),
    });
  }

  async function login(request: LoginRequest): Promise<AuthResponse> {
    const response = await authService.login(request);

    await authStorage.saveTokens(response.accessToken, response.refreshToken);

    setUser(response.user);

    return response;
  }

  async function register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await authService.register(request);

    await authStorage.saveTokens(response.accessToken, response.refreshToken);

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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
