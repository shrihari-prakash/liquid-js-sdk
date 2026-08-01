export { ClientUsersNamespace } from "./users.js";
export { ClientOAuthNamespace } from "./oauth.js";
export { ClientRolesNamespace } from "./roles.js";
export { ClientSystemNamespace } from "./system.js";

import type { HttpClient } from "../../http.js";
import { ClientUsersNamespace } from "./users.js";
import { ClientOAuthNamespace } from "./oauth.js";
import { ClientRolesNamespace } from "./roles.js";
import { ClientSystemNamespace } from "./system.js";

/**
 * Client namespace — uses a machine-to-machine client credentials token.
 * Suitable for server-to-server calls where no end-user context is needed.
 *
 * @example
 * const liquid = createLiquidClient({ baseUrl, getAccessToken });
 * await liquid.client.users.list();
 * await liquid.client.users.ban({ userId: 'user_123', reason: 'spam' });
 */
export class ClientNamespace {
  /** Manage users: list, create, update, ban, restrict, credits, subscriptions, etc. */
  readonly users: ClientUsersNamespace;
  /** Query OAuth client info. */
  readonly oauth: ClientOAuthNamespace;
  /** Manage roles via client credentials. */
  readonly roles: ClientRolesNamespace;
  /** System stats via client credentials. */
  readonly system: ClientSystemNamespace;

  constructor(http: HttpClient) {
    this.users = new ClientUsersNamespace(http);
    this.oauth = new ClientOAuthNamespace(http);
    this.roles = new ClientRolesNamespace(http);
    this.system = new ClientSystemNamespace(http);
  }
}
