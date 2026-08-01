import type { HttpClient } from "../../http.js";
import type { LiquidResponse, SystemStats } from "../../types.js";

export class AdminSystemNamespace {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get system-wide request and usage statistics.
   * GET /system/admin-api/stats
   */
  getStats(): Promise<LiquidResponse<{ stats: SystemStats }>> {
    return this.http.request({ path: "/system/admin-api/stats" });
  }
}
