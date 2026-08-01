import type { LiquidResponse, HealthResponse } from "../types.js";
import type { HttpClient } from "../http.js";

export class HealthNamespace {
  constructor(private readonly http: HttpClient) {}

  /**
   * Check whether the Liquid server is up.
   * GET /health
   */
  check(): Promise<LiquidResponse<HealthResponse>> {
    return this.http.request({ path: "/health", unauthenticated: true });
  }
}
