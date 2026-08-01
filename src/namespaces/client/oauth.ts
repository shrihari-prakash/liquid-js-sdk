import type { HttpClient } from "../../http.js";
import type { LiquidResponse, OAuthClient, GetClientParams } from "../../types.js";

export class ClientOAuthNamespace {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get OAuth client info. Omit clientId to get the current authenticated client's info.
   * GET /client  or  GET /client/:clientId
   */
  getClient(params?: GetClientParams): Promise<LiquidResponse<{ client: OAuthClient }>> {
    const path = params?.clientId ? `/client/${params.clientId}` : "/client";
    return this.http.request({ path });
  }
}
