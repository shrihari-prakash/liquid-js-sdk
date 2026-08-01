import type { HttpClient } from "../../http.js";
import type {
  LiquidResponse,
  OAuthClient,
  CreateClientParams,
  UpdateClientParams,
  DeleteClientParams,
  PaginationParams,
} from "../../types.js";

export class AdminOAuthNamespace {
  constructor(private readonly http: HttpClient) {}

  private get base() {
    return "/client/admin-api";
  }

  /**
   * List all OAuth clients (paginated).
   * GET /client/admin-api/list
   */
  listClients(params?: PaginationParams): Promise<LiquidResponse<{ clients: OAuthClient[]; total: number }>> {
    return this.http.request({ path: `${this.base}/list`, query: params });
  }

  /**
   * Create a new OAuth client application.
   * Body: { id, displayName, role, grants, redirectUris, secret, scope? }
   * POST /client/admin-api/create
   */
  createClient(params: CreateClientParams): Promise<LiquidResponse<{ client: OAuthClient }>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/create`,
      body: params,
    });
  }

  /**
   * Update an existing OAuth client application.
   * Body: { target: "<clientMongoDBId>", id: "<clientIdString>", ...fields }
   * PATCH /client/admin-api/update
   */
  updateClient(params: UpdateClientParams): Promise<LiquidResponse<unknown>> {
    return this.http.request({
      method: "PATCH",
      path: `${this.base}/update`,
      body: params,
    });
  }

  /**
   * Delete an OAuth client application by its MongoDB _id.
   * Body: { target: "<clientMongoDBId>" }
   * DELETE /client/admin-api/delete
   */
  deleteClient(params: DeleteClientParams): Promise<LiquidResponse<unknown>> {
    return this.http.request({
      method: "DELETE",
      path: `${this.base}/delete`,
      body: params,
    });
  }
}
