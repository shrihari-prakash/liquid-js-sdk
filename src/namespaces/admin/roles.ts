import type { HttpClient } from "../../http.js";
import type {
  LiquidResponse,
  Role,
  CreateRoleParams,
  UpdateRoleParams,
  DeleteRoleParams,
} from "../../types.js";

export class AdminRolesNamespace {
  constructor(private readonly http: HttpClient) {}

  private get base() {
    return "/roles/admin-api";
  }

  /**
   * Create a new role.
   * Body: { id, displayName, ranking, description? }
   * POST /roles/admin-api/create
   */
  create(params: CreateRoleParams): Promise<LiquidResponse<{ role: Role }>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/create`,
      body: params,
    });
  }

  /**
   * Update an existing role.
   * Body: { target: "<roleIdString>", displayName?, ranking?, description? }
   * PATCH /roles/admin-api/update
   */
  update(params: UpdateRoleParams): Promise<LiquidResponse<{ role: Role }>> {
    return this.http.request({
      method: "PATCH",
      path: `${this.base}/update`,
      body: params,
    });
  }

  /**
   * Delete a role by its string ID.
   * Body: { target: "<roleIdString>" }
   * DELETE /roles/admin-api/delete
   */
  delete(params: DeleteRoleParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "DELETE",
      path: `${this.base}/delete`,
      body: params,
    });
  }
}
