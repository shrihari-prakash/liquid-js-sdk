import { HttpClient } from "./http.js";
import type { LiquidClientOptions } from "./types.js";

import { UserNamespace } from "./namespaces/user.js";
import { OAuthNamespace } from "./namespaces/oauth.js";
import { SystemNamespace } from "./namespaces/system.js";
import { RolesNamespace } from "./namespaces/roles.js";
import { HealthNamespace } from "./namespaces/health.js";
import { SSONamespace } from "./namespaces/sso.js";
import { AdminNamespace } from "./namespaces/admin/index.js";
import { ClientNamespace } from "./namespaces/client/index.js";

/**
 * The fully-initialized Liquid SDK client.
 * Obtain one via `createLiquidClient()`.
 */
export class LiquidClient {
  /**
   * Delegated (user-scoped) endpoints.
   * Use these when calling on behalf of an authenticated end-user.
   *
   * @example
   * await liquid.user.getMe();
   * await liquid.user.follow({ targetUserId: 'user_123' });
   */
  readonly user: UserNamespace;

  /**
   * Machine-to-machine (client credentials) endpoints.
   * Use these for server-side operations that don't need a user context.
   *
   * @example
   * await liquid.client.users.list();
   * await liquid.client.users.ban({ userId: 'user_123', reason: 'spam' });
   */
  readonly client: ClientNamespace;

  /**
   * Admin (delegated admin-token) endpoints.
   * Use these for privileged operations such as creating OAuth apps or managing roles.
   *
   * @example
   * await liquid.admin.users.verify({ userId: 'user_123' });
   * await liquid.admin.oauth.createClient({ id: 'my-app', ... });
   */
  readonly admin: AdminNamespace;

  /**
   * OAuth token and introspect endpoints, plus an authorization URL builder.
   *
   * @example
   * await liquid.oauth.introspect({ token: 'some-token' });
   * const authUrl = liquid.oauth.buildAuthorizeUrl(baseUrl, { clientId, redirectUri, ... });
   */
  readonly oauth: OAuthNamespace;

  /**
   * System-level endpoints: settings, version, countries.
   *
   * @example
   * await liquid.system.getVersion();
   * await liquid.system.getCountriesInsecure();
   */
  readonly system: SystemNamespace;

  /**
   * Role listing endpoint.
   *
   * @example
   * await liquid.roles.list();
   */
  readonly roles: RolesNamespace;

  /**
   * Server health check.
   *
   * @example
   * await liquid.health.check();
   */
  readonly health: HealthNamespace;

  /**
   * Single sign-on URL builders.
   *
   * @example
   * window.location.href = liquid.sso.buildGoogleLoginUrl();
   */
  readonly sso: SSONamespace;

  constructor(options: LiquidClientOptions) {
    const { baseUrl, getAccessToken } = options;

    // Normalize baseUrl — strip trailing slash
    const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

    const http = new HttpClient({ baseUrl: normalizedBaseUrl, getAccessToken });

    this.user = new UserNamespace(http);
    this.client = new ClientNamespace(http);
    this.admin = new AdminNamespace(http);
    this.oauth = new OAuthNamespace(http);
    this.system = new SystemNamespace(http);
    this.roles = new RolesNamespace(http);
    this.health = new HealthNamespace(http);
    this.sso = new SSONamespace(http, normalizedBaseUrl);
  }
}
