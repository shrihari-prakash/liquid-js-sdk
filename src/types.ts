// ─────────────────────────────────────────────────────────────────────────────
// Shared primitive types
// ─────────────────────────────────────────────────────────────────────────────

export type GetAccessTokenFn = () => string | Promise<string>;

export interface LiquidClientOptions {
  /** Base URL of the Liquid deployment, e.g. https://auth.example.com */
  baseUrl: string;
  /**
   * A function (or async function) that returns a valid Bearer access token.
   * Called before every API request so you can always supply a fresh token.
   */
  getAccessToken: GetAccessTokenFn;
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic API response wrapper
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface LiquidResponse<T = any> {
  /** HTTP status code */
  status: number;
  /** Parsed JSON body (with Liquid server envelope automatically unwrapped) */
  data: T;
  /** True when the HTTP status is in the 2xx range */
  ok: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination — Liquid uses limit + offset (cursor-based), not page numbers
// ─────────────────────────────────────────────────────────────────────────────

export interface PaginationParams {
  /** Maximum number of records to return */
  limit?: number;
  /** Cursor offset (_id or ISO date string depending on the endpoint) */
  offset?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// User
// ─────────────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  username?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneCountryCode?: string;
  phone?: string;
  phoneVerified?: boolean;
  gender?: string;
  preferredLanguage?: string;
  bio?: string;
  customLink?: string;
  pronouns?: string;
  organization?: string;
  country?: string;
  isPrivate?: boolean;
  emailVerified?: boolean;
  secondaryEmail?: string;
  secondaryEmailVerified?: boolean;
  role?: string;
  scope?: string[];
  credits?: number;
  isSubscribed?: boolean;
  subscriptionTier?: string;
  subscriptionExpiry?: string;
  isBanned?: boolean;
  isRestricted?: boolean;
  isVerified?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customData?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneCountryCode?: string;
  phone?: string;
  /** Required when the server is configured for invite-only registration */
  inviteCode?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface UpdateMeParams {
  username?: string;
  /** New password. Send `currentPassword` too if server config requires it. */
  password?: string;
  /** Required when changing a protected field (e.g. password, email) */
  currentPassword?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneCountryCode?: string;
  phone?: string;
  gender?: string;
  preferredLanguage?: string;
  bio?: string;
  customLink?: string;
  pronouns?: string;
  organization?: string;
  country?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface LoginParams {
  /** Supply username OR email, not both */
  username?: string;
  email?: string;
  password: string;
  /** Optional — required when `user.login.require-user-agent` is enabled server-side */
  userAgent?: string;
}

export interface LoginResponse {
  "2faEnabled": boolean;
  userInfo?: User;
  /** Returned when 2FA is enabled — pass to `do2FA.sessionHash` */
  sessionHash?: string;
}

export interface UserSearchParams extends PaginationParams {
  query: string;
}

export interface FollowParams {
  /** Target user's _id */
  target: string;
}

export interface GetFollowStatusParams {
  /**
   * Target user's _id. Forwarded as a URL path segment.
   * GET /user/follow-status/:target
   */
  target: string;
}

export interface FollowRequestPatchParams {
  /** The follow document _id to accept */
  request: string;
}

export interface DeleteFollowEntryParams {
  /** The follow document _id to delete */
  entry: string;
}

export interface BlockParams {
  /** Target user's _id */
  target: string;
}

export interface SetPrivateParams {
  /** true = make private, false = make public (auto-accepts all pending requests) */
  state: boolean;
}

/**
 * Step 1: request a password-reset code.
 * GET /user/code?email=…
 * Returns { target: "<userId>" } — pass that `target` to resetPassword.
 */
export interface GetPasswordResetCodeParams {
  email: string;
}

/**
 * Step 2: set a new password using the code that was emailed.
 * POST /user/reset-password
 * Body: { target: "<userId>", code: "<emailed code>", password: "<new password>" }
 */
export interface ResetPasswordParams {
  /** User _id returned by getPasswordResetCode */
  target: string;
  /** The code emailed to the user */
  code: string;
  /** New password */
  password: string;
}

/**
 * Verify email address.
 * GET /user/verify-email?target=<userId>&code=<code>
 */
export interface VerifyEmailParams {
  /** User _id */
  target: string;
  /** Verification code from email */
  code: string;
}

/**
 * Resend verification email.
 * GET /user/resend-verification?target=<userId>
 */
export interface ResendVerificationParams {
  /** User _id */
  target: string;
}

export interface Setup2FAParams {
  /** true = enable 2FA, false = disable */
  state: boolean;
}

export interface Do2FAParams {
  /** User _id */
  target: string;
  /** OTP code emailed to the user */
  code: string;
  /** sessionHash returned by the login endpoint when 2FA is triggered */
  sessionHash: string;
}

export interface GetFollowersParams extends PaginationParams {
  /** Omit to get the authenticated user's followers/following */
  userId?: string;
}

export interface LoginHistoryEntry {
  ip?: string;
  ipAddress?: string;
  userAgent?: string;
  source?: string;
  success?: boolean;
  reason?: string;
  createdAt: string;
}

export interface InviteCode {
  code: string;
  sourceId?: string;
  targetId?: string;
  createdAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin / Client user management
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminCreateUserParams {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  scope?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface AdminUpdateUserParams {
  /** Target user's MongoDB _id */
  target: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface AdminUserSearchParams extends PaginationParams {
  query: string;
}

export interface BanParams {
  /** Target user's _id */
  target: string;
  /** true = ban, false = unban */
  state: boolean;
  reason?: string;
}

export interface RestrictParams {
  /** Target user's _id */
  target: string;
  /** true = restrict, false = unrestrict */
  state: boolean;
  reason?: string;
}

export type AccessOperation = "add" | "del" | "set";
export type AccessTargetType = "user" | "client" | "role";

export interface SetAccessParams {
  /** Array of user/client MongoDB _id values, or role id strings */
  targets: string[];
  targetType: AccessTargetType;
  scope: string[];
  operation: AccessOperation;
}

export type CreditOperation = "increment" | "decrement" | "set";

export interface SetCreditsParams {
  /** Target user's _id */
  target: string;
  type: CreditOperation;
  value: number;
}

export interface SetSubscriptionParams {
  /** Target user's _id */
  target: string;
  /** true = activate, false = deactivate */
  state: boolean;
  /** Required when state is true. ISO 8601 date string. */
  expiry?: string;
  tier?: string;
  subscriptionIdentifier?: string | number;
}

export interface FollowRecord {
  _id: string;
  targetId?: string;
  sourceId?: string;
  approved?: boolean;
  createdAt?: string;
  source?: User;
  target?: User;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface VerifyUserParams {
  /** Target user's _id */
  target: string;
  /** true = mark verified, false = mark unverified */
  state?: boolean;
}

export interface CancelSubscriptionParams {
  /** Target user's _id */
  target: string;
  /** true = cancel, false = un-cancel. Defaults to true if omitted. */
  cancelled?: boolean;
}

export interface RetrieveUserInfoParams {
  /** Array of identifiers to look up */
  targets: string[];
  /** Field to search by. Defaults to _id */
  field?: "_id" | "email" | "sanitizedEmail" | "secondaryEmail";
}

export interface SetCustomDataParams {
  /** Target user's _id */
  target: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customData: Record<string, any>;
}

export interface GenerateInviteCodesParams {
  /** Target user's _id */
  target: string;
  count?: number;
}

export interface GetAdminLoginHistoryParams extends PaginationParams {
  /** Target user's _id — sent as query param `?target=…` */
  target: string;
}

export interface GetInviteCodesParams {
  /** Target user's _id — sent as query param `?target=…` */
  target: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Client-API specific social params
// ─────────────────────────────────────────────────────────────────────────────

export interface ClientFollowStatusParams {
  /** Source user's _id */
  source: string;
  /** Target user's _id */
  target: string;
}

export interface ClientFollowersParams extends PaginationParams {
  /** Target user's _id — query param `?target=…` */
  target: string;
}

export interface ClientBlockStatusParams {
  /** Source user's _id */
  source: string;
  /** Target user's _id */
  target: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// OAuth / Clients
// ─────────────────────────────────────────────────────────────────────────────

export type OAuthGrant =
  | "client_credentials"
  | "authorization_code"
  | "refresh_token"
  | "password";

export type ClientRole = "internal_client" | "external_client";

export interface OAuthClient {
  _id?: string;
  id: string;
  displayName: string;
  role: ClientRole;
  grants: OAuthGrant[];
  redirectUris: string[];
  scope: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClientParams {
  /** Client string id (8–30 chars, alphanumeric) */
  id: string;
  displayName: string;
  role: ClientRole;
  grants: OAuthGrant[];
  redirectUris: string[];
  secret: string;
  scope?: string[];
}

export interface UpdateClientParams {
  /** MongoDB _id of the client to update */
  target: string;
  /** Client string id (the public identifier) */
  id: string;
  displayName?: string;
  role?: ClientRole;
  grants?: OAuthGrant[];
  redirectUris?: string[];
  secret?: string;
  scope?: string[];
}

export interface DeleteClientParams {
  /** MongoDB _id of the client to delete */
  target: string;
}

export interface GetClientParams {
  /** Omit to get the current authenticated client */
  clientId?: string;
}

export interface TokenParams {
  grantType: OAuthGrant;
  clientId?: string;
  clientSecret?: string;
  code?: string;
  redirectUri?: string;
  refreshToken?: string;
  username?: string;
  password?: string;
  scope?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface IntrospectParams {
  token: string;
}

export interface IntrospectResponse {
  tokenInfo: {
    accessToken: string;
    accessTokenExpiresAt: string;
    scope: string;
    user?: User;
    client?: Partial<OAuthClient>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  } | null;
}

export interface AuthorizeParams {
  responseType: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Roles
// ─────────────────────────────────────────────────────────────────────────────

export interface Role {
  _id?: string;
  id: string;
  displayName: string;
  ranking: number;
  description?: string;
  scope?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleParams {
  /** Role string id — alphanumeric + underscores, 1–128 chars */
  id: string;
  displayName: string;
  /** Must be >= 1 */
  ranking: number;
  description?: string;
}

export interface UpdateRoleParams {
  /** The existing role's string id — sent as body `target` */
  target: string;
  displayName?: string;
  ranking?: number;
  description?: string;
}

export interface DeleteRoleParams {
  /** The role's string id — sent as body `target` */
  target: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// System
// ─────────────────────────────────────────────────────────────────────────────

export interface SystemSettings {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface SystemStats {
  requestCount?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface SystemVersion {
  version: string;
}

export interface CountryEntry {
  code: string;
  name: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Health
// ─────────────────────────────────────────────────────────────────────────────

export interface HealthResponse {
  status: "UP" | "DOWN";
}
