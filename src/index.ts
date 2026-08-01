export { LiquidClient } from "./client.js";
export type { LiquidClientOptions, GetAccessTokenFn, LiquidResponse } from "./types.js";

// Entity types
export type {
  User,
  OAuthClient,
  Role,
  InviteCode,
  LoginHistoryEntry,
  CountryEntry,
  HealthResponse,
  SystemSettings,
  SystemStats,
  SystemVersion,
} from "./types.js";

// Request param types — User
export type {
  CreateUserParams,
  UpdateMeParams,
  LoginParams,
  LoginResponse,
  UserSearchParams,
  FollowParams,
  GetFollowStatusParams,
  FollowRequestPatchParams,
  DeleteFollowEntryParams,
  BlockParams,
  SetPrivateParams,
  GetPasswordResetCodeParams,
  ResetPasswordParams,
  VerifyEmailParams,
  ResendVerificationParams,
  Setup2FAParams,
  Do2FAParams,
  GetFollowersParams,
} from "./types.js";

// Request param types — Admin / Client
export type {
  AdminCreateUserParams,
  AdminUpdateUserParams,
  AdminUserSearchParams,
  BanParams,
  RestrictParams,
  SetAccessParams,
  AccessOperation,
  AccessTargetType,
  SetCreditsParams,
  CreditOperation,
  SetSubscriptionParams,
  VerifyUserParams,
  RetrieveUserInfoParams,
  SetCustomDataParams,
  GenerateInviteCodesParams,
  GetAdminLoginHistoryParams,
  GetInviteCodesParams,
  ClientFollowStatusParams,
  ClientFollowersParams,
  ClientBlockStatusParams,
} from "./types.js";

// Request param types — OAuth
export type {
  OAuthGrant,
  ClientRole,
  CreateClientParams,
  UpdateClientParams,
  DeleteClientParams,
  GetClientParams,
  TokenParams,
  TokenResponse,
  IntrospectParams,
  IntrospectResponse,
  AuthorizeParams,
} from "./types.js";

// Request param types — Roles
export type {
  CreateRoleParams,
  UpdateRoleParams,
  DeleteRoleParams,
} from "./types.js";

// Shared
export type { PaginationParams } from "./types.js";

// Namespace classes
export { UserNamespace } from "./namespaces/user.js";
export { OAuthNamespace } from "./namespaces/oauth.js";
export { SystemNamespace } from "./namespaces/system.js";
export { RolesNamespace } from "./namespaces/roles.js";
export { HealthNamespace } from "./namespaces/health.js";
export { SSONamespace } from "./namespaces/sso.js";
export { AdminNamespace } from "./namespaces/admin/index.js";
export { AdminUsersNamespace } from "./namespaces/admin/index.js";
export { AdminOAuthNamespace } from "./namespaces/admin/index.js";
export { AdminRolesNamespace } from "./namespaces/admin/index.js";
export { AdminSystemNamespace } from "./namespaces/admin/index.js";
export { ClientNamespace } from "./namespaces/client/index.js";
export { ClientUsersNamespace } from "./namespaces/client/index.js";
export { ClientOAuthNamespace } from "./namespaces/client/index.js";
export { ClientRolesNamespace } from "./namespaces/client/index.js";
export { ClientSystemNamespace } from "./namespaces/client/index.js";

import { LiquidClient } from "./client.js";
import type { LiquidClientOptions } from "./types.js";

/**
 * Create a new Liquid SDK client instance.
 *
 * @param options.baseUrl - The base URL of your Liquid deployment (e.g. `https://auth.example.com`).
 * @param options.getAccessToken - A function (sync or async) that returns a valid Bearer access token.
 *   Called before every authenticated request so tokens are always fresh.
 */
export function createLiquidClient(options: LiquidClientOptions): LiquidClient {
  return new LiquidClient(options);
}
