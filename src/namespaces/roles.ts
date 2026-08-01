import type { HttpClient } from "../http.js";
import type {
  LiquidResponse,
  Role,
  PaginationParams,
} from "../types.js";

export class RolesNamespace {
  constructor(private readonly http: HttpClient) {}

  /**
   * List all roles (requires delegated auth).
   * GET /roles/list
   */
  list(params?: PaginationParams): Promise<LiquidResponse<{ roles: Role[]; total: number }>> {
    return this.http.request({ path: "/roles/list", query: params });
  }
}
