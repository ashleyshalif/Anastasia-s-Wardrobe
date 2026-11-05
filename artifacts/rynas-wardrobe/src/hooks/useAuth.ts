"use client";

import { useState, useCallback } from "react";
import { useStore } from "@/lib/store";
import { authApi } from "@/lib/api/auth";
import { LoginCredentials, RegisterPayload } from "@/lib/api/types";
import { UserProfile } from "@/types/account";

export function useAuth() {
  const { user, login: storeLogin, logout: storeLogout, updateProfile: storeUpdateProfile } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<UserProfile> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authApi.login(credentials, () => ({
          token: "mock-jwt-token-maya-kapoor",
          user: {
            id: "usr-maya-892",
            firstName: "Maya",
            lastName: "Kapoor",
            email: credentials.email,
            phone: "+91 98200 12345",
            memberSince: "Autumn 2025",
            newsletterConsent: true,
            tier: "Privilege Member",
            preferredCurrency: "INR",
          },
        }));

        storeLogin(response.user);
        return response.user;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to sign in. Please verify your details.";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [storeLogin]
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<UserProfile> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authApi.register(payload);
        storeLogin(response.user);
        return response.user;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to create account.";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [storeLogin]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      storeLogout();
    } finally {
      setIsLoading(false);
    }
  }, [storeLogout]);

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>): Promise<UserProfile> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await authApi.updateProfile(data, () => {
          storeUpdateProfile(data);
          return {
            ...(user || {
              id: "usr-maya-892",
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              memberSince: "",
              newsletterConsent: true,
              tier: "Privilege Member",
              preferredCurrency: "INR",
            }),
            ...data,
          };
        });
        storeUpdateProfile(updated);
        return updated;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to update profile details.";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [storeUpdateProfile, user]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authApi.changePassword(currentPassword, newPassword);
        return res.success;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unable to change password.";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    token: authApi.getToken(),
  };
}
