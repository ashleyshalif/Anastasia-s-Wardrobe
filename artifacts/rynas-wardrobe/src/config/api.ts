/**
 * Centralized API configuration for Ryna's Wardrobe
 * Normalizes host and provides bulletproof URL construction.
 */

// 1. Get raw base URL from environment or fallback
const rawEnvUrl = (
  typeof process !== "undefined"
    ? process.env?.NEXT_PUBLIC_API_URL
    : ""
) || "http://127.0.0.1:8000";

// 2. Base host without any trailing /api or slash
export const API_HOST = rawEnvUrl
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "") || "http://127.0.0.1:8000";

// 3. Normalized API_BASE_URL that always ends with /api (without duplicates)
export const API_BASE_URL = `${API_HOST}/api`;

/**
 * Helper to build an exact API endpoint URL safely.
 * Strips duplicate '/api/' or leading slashes.
 * e.g. apiUrl("/auth/login/") -> "http://127.0.0.1:8000/api/auth/login/"
 * e.g. apiUrl("/api/auth/login/") -> "http://127.0.0.1:8000/api/auth/login/"
 */
export function apiUrl(path: string): string {
  const cleanPath = path.replace(/^\/?(api\/)?/, "").replace(/^\/+/, "");
  if (typeof window !== "undefined") {
    return `/api/${cleanPath}`;
  }
  return `${API_BASE_URL}/${cleanPath}`;
}

export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("aw_auth_token");
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
  }
  return headers;
}

/**
 * Safe JSON fetch wrapper that gracefully handles non-JSON / HTML error pages
 * avoiding "SyntaxError: Unexpected token '<'".
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";
    let data: any;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = {
        error: res.ok
          ? text
          : `Server returned status ${res.status}. Please check that the Django backend is active.`,
      };
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: { error: err?.message || "Network request failed. Is the backend server running?" } as any,
    };
  }
}
