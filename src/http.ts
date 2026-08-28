import type { GetAccessTokenFn, OnUnauthorizedFn, LiquidResponse } from "./types.js";

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  /** URL path relative to baseUrl, e.g. /user/me */
  path: string;
  body?: unknown;
  /** Query string params — accepts any object whose values are string-coercible */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: Record<string, any> | object;
  /** Send request without an Authorization header */
  unauthenticated?: boolean;
  /** Custom Content-Type header */
  contentType?: string;
}

export interface HttpClientOptions {
  baseUrl: string;
  getAccessToken: GetAccessTokenFn;
  onUnauthorized?: OnUnauthorizedFn;
}

function buildUrl(
  baseUrl: string,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: Record<string, any> | object
): string {
  // Ensure exactly one slash between base and path
  const normalized = baseUrl.replace(/\/$/, "") + (path.startsWith("/") ? path : `/${path}`);
  const url = new URL(normalized);
  if (query) {
    Object.entries(query as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

export class HttpClient {
  constructor(private readonly options: HttpClientOptions) {}

  async request<T = unknown>(opts: RequestOptions): Promise<LiquidResponse<T>> {
    const { method = "GET", path, body, query, unauthenticated = false, contentType } = opts;

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (contentType) {
      headers["Content-Type"] = contentType;
    } else if (body instanceof URLSearchParams) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (!unauthenticated) {
      const token = await this.options.getAccessToken();
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = buildUrl(this.options.baseUrl, path, query);

    const executeFetch = (authHeader?: string) => {
      const reqHeaders = authHeader !== undefined ? { ...headers, Authorization: `Bearer ${authHeader}` } : headers;
      return fetch(url, {
        method,
        headers: reqHeaders,
        body:
          body instanceof FormData || body instanceof URLSearchParams || typeof body === "string"
            ? body
            : body !== undefined
            ? JSON.stringify(body)
            : undefined,
      });
    };

    let response = await executeFetch();

    if (response.status === 401 && !unauthenticated && this.options.onUnauthorized) {
      const refreshedToken = await this.options.onUnauthorized();
      if (refreshedToken) {
        response = await executeFetch(refreshedToken);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawJson: any;
    try {
      rawJson = await response.json();
    } catch {
      rawJson = undefined;
    }

    // Automatically unwrap Liquid server's { ok: 1, data: { ... } } response envelope
    let data: T;
    if (
      rawJson &&
      typeof rawJson === "object" &&
      "data" in rawJson &&
      (rawJson.ok === 1 || rawJson.ok === true || rawJson.status === "SUCCESS")
    ) {
      data = rawJson.data as T;
    } else {
      data = rawJson as T;
    }

    return {
      status: response.status,
      data,
      ok: response.ok,
    };
  }
}
