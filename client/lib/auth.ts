/**
 * JWT Token Management Utilities
 * Simple localStorage-based token storage and retrieval for hackathon project
 */

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

export function getUserRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userRole");
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
}

/**
 * Create fetch options with JWT authorization header
 * Usage: fetch(url, createAuthHeaders({ method: 'GET' }))
 */
export function createAuthHeaders(
  options: RequestInit = {}
): RequestInit {
  const token = getAuthToken();
  return {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };
}

/**
 * Make authenticated fetch request
 * Usage: authenticatedFetch('/api/endpoint', { method: 'POST', body: {...} })
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const fullUrl = url.startsWith("http") ? url : `${apiUrl}${url}`;
  return fetch(fullUrl, createAuthHeaders(options));
}
