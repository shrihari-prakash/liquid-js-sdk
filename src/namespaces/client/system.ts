import type { HttpClient } from "../../http.js";
import type { LiquidResponse, SystemStats } from "../../types.js";

export class ClientSystemNamespace {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get system-wide request and usage statistics via client credentials.
   * GET /system/client-api/stats
   */
  getStats(): Promise<LiquidResponse<{ stats: SystemStats }>> {
    return this.http.request({ path: "/system/client-api/stats" });
  }
}
