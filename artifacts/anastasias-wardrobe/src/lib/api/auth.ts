import { apiClient } from "./client";
import { UserProfile } from "@/types/account";
import { LoginCredentials, RegisterPayload, AuthTokenResponse } from "./types";

export class AuthApiService {
  private static TOKEN_KEY = "aw_auth_token";
  private static REFRESH_KEY = "aw_refresh_token";

  public saveTokens(token: string, refreshToken?: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(AuthApiService.TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(AuthApiService.REFRESH_KEY, refreshToken);
    }
  }

  public clearTokens() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AuthApiService.TOKEN_KEY);
    localStorage.removeItem(AuthApiService.REFRESH_KEY);
  }

  public getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AuthApiService.TOKEN_KEY);
  }

  /**
   * Log in user with credentials, saving returned JWT tokens
   */
  public async login(
    credentials: LoginCredentials,
    mockFallback?: () => AuthTokenResponse
  ): Promise<AuthTokenResponse> {
    return apiClient.withMockFallback(
      async () => {
        const res = await apiClient.post<AuthTokenResponse>("/auth/login/", credentials);
        if (res.token) {
          this.saveTokens(res.token, res.refreshToken);
        }
        return res;
      },
      () => {
        const mock = mockFallback ? mockFallback() : {
          token: "mock-jwt-token-maya-kapoor",
          user: {
            id: "usr-maya-892",
            firstName: "Maya",
            lastName: "Kapoor",
            email: credentials.email,
            phone: "+91 98200 12345",
            memberSince: "Autumn 2025",
            newsletterConsent: true,
            tier: "Privilege Member" as const,
            preferredCurrency: "INR" as const,
          },
        };
        this.saveTokens(mock.token);
        return mock;
      },
      "auth.login"
    );
  }

  /**
   * Register a new user account
   */
  public async register(
    payload: RegisterPayload,
    mockFallback?: () => AuthTokenResponse
  ): Promise<AuthTokenResponse> {
    return apiClient.withMockFallback(
      async () => {
        const res = await apiClient.post<AuthTokenResponse>("/auth/register/", payload);
        if (res.token) {
          this.saveTokens(res.token, res.refreshToken);
        }
        return res;
      },
      () => {
        const mock = mockFallback ? mockFallback() : {
          token: "mock-jwt-token-registered-user",
          user: {
            id: `usr-${Date.now()}`,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone || "",
            memberSince: "Autumn 2026",
            newsletterConsent: payload.newsletterConsent ?? true,
            tier: "Atelier Patron" as const,
            preferredCurrency: "INR" as const,
          },
        };
        this.saveTokens(mock.token);
        return mock;
      },
      "auth.register"
    );
  }

  /**
   * Retrieve active user profile
   */
  public async getProfile(
    mockFallback?: () => UserProfile | null
  ): Promise<UserProfile | null> {
    return apiClient.withMockFallback(
      async () => {
        return await apiClient.get<UserProfile>("/auth/me/");
      },
      () => {
        if (mockFallback) return mockFallback();
        return null;
      },
      "auth.getProfile"
    );
  }

  /**
   * Update profile details
   */
  public async updateProfile(
    data: Partial<UserProfile>,
    mockFallback?: () => UserProfile
  ): Promise<UserProfile> {
    return apiClient.withMockFallback(
      async () => {
        return await apiClient.patch<UserProfile>("/auth/profile/", data);
      },
      () => {
        if (mockFallback) return mockFallback();
        throw new Error("Unable to update profile");
      },
      "auth.updateProfile"
    );
  }

  /**
   * Change user account password
   */
  public async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.withMockFallback(
      async () => {
        return await apiClient.post<{ success: boolean; message: string }>(
          "/auth/change-password/",
          { current_password: currentPassword, new_password: newPassword }
        );
      },
      () => ({
        success: true,
        message: "Password changed successfully (mock)",
      }),
      "auth.changePassword"
    );
  }

  /**
   * Log out session
   */
  public async logout(): Promise<void> {
    try {
      if (this.getToken()) {
        await apiClient.post("/auth/logout/");
      }
    } catch {
      // Ignore network errors during logout
    } finally {
      this.clearTokens();
    }
  }
}

export const authApi = new AuthApiService();
