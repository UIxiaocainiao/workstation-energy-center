import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { apiClient } from "@/lib/apiClient";

const AUTH_TOKEN_STORAGE_KEY = "wec.auth.token";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  acceptTerms: boolean;
  marketingOptIn?: boolean;
};

type LoginPayload = {
  emailOrUsername: string;
  password: string;
  keepLoggedIn?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
  isAuthenticated: boolean;
  providers: {
    google: { enabled: boolean };
    twitter: { enabled: boolean };
    facebook: { enabled: boolean };
  };
  loginWithPassword: (payload: LoginPayload) => Promise<AuthUser>;
  registerWithEmail: (payload: RegisterPayload) => Promise<string>;
  forgotPassword: (emailOrUsername: string) => Promise<{
    message: string;
    debugResetToken?: string;
    debugResetUrl?: string;
    debugEmailDelivery?: "sent" | "skipped" | "failed";
  }>;
  resetPassword: (payload: {
    token: string;
    password: string;
    repeatPassword: string;
  }) => Promise<string>;
  logout: () => Promise<void>;
  establishSessionFromToken: (nextToken: string) => Promise<AuthUser>;
  startGoogleLogin: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type LoginResponse = {
  token: string;
  user: AuthUser;
};

type RegisterResponse = { message: string };
type ForgotPasswordResponse = {
  message: string;
  debugResetToken?: string;
  debugResetUrl?: string;
  debugEmailDelivery?: "sent" | "skipped" | "failed";
};
type MeResponse = { user: AuthUser };
type GoogleAuthUrlResponse = { url: string };
type ResetPasswordResponse = { message: string };
type ProvidersResponse = {
  providers: {
    google: { enabled: boolean };
    twitter: { enabled: boolean };
    facebook: { enabled: boolean };
  };
};

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

function persistToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

function buildAuthHeaders(token: string | null) {
  if (!token) return undefined;
  return { Authorization: `Bearer ${token}` };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [providers, setProviders] = useState<ProvidersResponse["providers"]>({
    google: { enabled: false },
    twitter: { enabled: false },
    facebook: { enabled: false },
  });

  useEffect(() => {
    apiClient
      .get<ProvidersResponse>("/auth/providers")
      .then((result) => setProviders(result.providers))
      .catch(() => {
        // keep defaults
      });
  }, []);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setIsReady(true);
      return;
    }

    setToken(storedToken);
    apiClient
      .get<MeResponse>("/auth/me", undefined, {
        headers: buildAuthHeaders(storedToken),
      })
      .then((result) => {
        setUser(result.user);
      })
      .catch(() => {
        persistToken(null);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsReady(true);
      });
  }, []);

  const loginWithPassword = useCallback(async (payload: LoginPayload) => {
    const result = await apiClient.post<LoginResponse>("/auth/login", payload);
    persistToken(result.token);
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const registerWithEmail = useCallback(async (payload: RegisterPayload) => {
    const result = await apiClient.post<RegisterResponse>("/auth/register", payload);
    return result.message;
  }, []);

  const forgotPassword = useCallback(async (emailOrUsername: string) => {
    const result = await apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", {
      emailOrUsername,
    });
    return result;
  }, []);

  const resetPassword = useCallback(
    async (payload: { token: string; password: string; repeatPassword: string }) => {
      const result = await apiClient.post<ResetPasswordResponse>("/auth/reset-password", payload);
      return result.message;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post<{ ok: boolean }>(
        "/auth/logout",
        undefined,
        { headers: buildAuthHeaders(token) },
      );
    } finally {
      persistToken(null);
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const establishSessionFromToken = useCallback(async (nextToken: string) => {
    const result = await apiClient.get<MeResponse>("/auth/me", undefined, {
      headers: buildAuthHeaders(nextToken),
    });
    persistToken(nextToken);
    setToken(nextToken);
    setUser(result.user);
    return result.user;
  }, []);

  const startGoogleLogin = useCallback(async () => {
    const result = await apiClient.get<GoogleAuthUrlResponse>("/auth/google/url");
    if (typeof window !== "undefined") {
      window.location.assign(result.url);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isReady,
      isAuthenticated: Boolean(user && token),
      providers,
      loginWithPassword,
      registerWithEmail,
      forgotPassword,
      resetPassword,
      logout,
      establishSessionFromToken,
      startGoogleLogin,
    }),
    [
      establishSessionFromToken,
      forgotPassword,
      isReady,
      loginWithPassword,
      logout,
      registerWithEmail,
      resetPassword,
      startGoogleLogin,
      token,
      user,
      providers,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
