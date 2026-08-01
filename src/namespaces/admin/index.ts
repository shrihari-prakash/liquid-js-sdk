export { AdminUsersNamespace } from "./users.js";
export { AdminOAuthNamespace } from "./oauth.js";
export { AdminRolesNamespace } from "./roles.js";
export { AdminSystemNamespace } from "./system.js";

import type { HttpClient } from "../../http.js";
import { AdminUsersNamespace } from "./users.js";
import { AdminOAuthNamespace } from "./oauth.js";
import { AdminRolesNamespace } from "./roles.js";
import { AdminSystemNamespace } from "./system.js";

/**
 * Admin namespace — requires a delegated token with admin-level scopes.
 *
 * @example
 * const liquid = createLiquidClient({ baseUrl, getAccessToken });
 * await liquid.admin.users.list();
 * await liquid.admin.oauth.createClient({ id: 'my-app', ... });
 */
export class AdminNamespace {
  /** Manage users: list, create, update, ban, restrict, credits, subscriptions, etc. */
  readonly users: AdminUsersNamespace;
  /** Manage OAuth clients: create, list, update, delete. */
  readonly oauth: AdminOAuthNamespace;
  /** Manage roles: create, update, delete. */
  readonly roles: AdminRolesNamespace;
  /** System administration: stats. */
  readonly system: AdminSystemNamespace;

  constructor(http: HttpClient) {
    this.users = new AdminUsersNamespace(http);
    this.oauth = new AdminOAuthNamespace(http);
    this.roles = new AdminRolesNamespace(http);
    this.system = new AdminSystemNamespace(http);
  }
}
