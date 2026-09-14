// Thin fetch wrapper around the backend documented in auth_company_product.md.
// Every endpoint replies { success, message, data } on success or
// { success: false, message, errors } on failure — this file normalizes
// both shapes into either a returned `data` or a thrown ApiError.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const TOKENS_KEY = "paperdesk.tokens";

export class ApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors ?? null;
  }
}

export function getTokens() {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(TOKENS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setTokens(tokens) {
  if (typeof localStorage === "undefined") return;
  if (!tokens) {
    localStorage.removeItem(TOKENS_KEY);
    return;
  }
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

let refreshPromise = null;

async function refreshAccessToken() {
  const tokens = getTokens();
  if (!tokens?.refreshToken)
    throw new ApiError("Refresh token is invalid or expired. Please login again.", { status: 401 });

  if (!refreshPromise) {
    refreshPromise = rawRequest("/auth/refresh-token", {
      method: "POST",
      body: { refreshToken: tokens.refreshToken },
    })
      .then((data) => {
        setTokens({ ...tokens, accessToken: data.newAccessToken });
        return data.newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function rawRequest(path, { method = "GET", body, headers = {}, auth = false } = {}) {
  const finalHeaders = { ...headers };
  let payload = body;

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (auth) {
    const tokens = getTokens();
    if (tokens?.accessToken) finalHeaders["Authorization"] = `Bearer ${tokens.accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: payload,
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    // no body — e.g. a 204 No Content
  }

  if (!res.ok || (json && !json.success)) {
    const message = json?.message || `Request failed with status ${res.status}`;
    throw new ApiError(message, { status: res.status, errors: json?.errors ?? null });
  }

  return json?.data ?? null;
}

/**
 * Authenticated request that retries once through refresh-token on a 401,
 * per the doc's "Refresh token is invalid or expired" flow.
 */
export async function apiRequest(path, options = {}) {
  if (!options.auth) return rawRequest(path, options);

  try {
    return await rawRequest(path, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      await refreshAccessToken();
      return rawRequest(path, options);
    }
    throw err;
  }
}

export { rawRequest, BASE_URL };
