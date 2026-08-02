import type { HttpClient } from "../../http.js";
import type {
  LiquidResponse,
  User,
  AdminCreateUserParams,
  AdminUpdateUserParams,
  AdminUserSearchParams,
  BanParams,
  RestrictParams,
  SetAccessParams,
  SetCreditsParams,
  SetSubscriptionParams,
  VerifyUserParams,
  RetrieveUserInfoParams,
  SetCustomDataParams,
  GenerateInviteCodesParams,
  GetAdminLoginHistoryParams,
  GetInviteCodesParams,
  LoginHistoryEntry,
  InviteCode,
  PaginationParams,
} from "../../types.js";

export class AdminUsersNamespace {
  constructor(private readonly http: HttpClient) {}

  private get base() {
    return "/user/admin-api";
  }

  /**
   * List all users (paginated).
   * Query: ?limit=…&offset=…
   * GET /user/admin-api/list
   */
  list(params?: PaginationParams): Promise<LiquidResponse<{ users: User[]; totalUsers: number }>> {
    return this.http.request({ path: `${this.base}/list`, query: params });
  }

  /**
   * Create a user as an admin (bypasses invite restrictions).
   * POST /user/admin-api/create
   */
  create(params: AdminCreateUserParams): Promise<LiquidResponse<{ insertedCount: number; user?: User }>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/create`,
      body: params,
    });
  }

  /**
   * Update any field of a user.
   * Body: { target: "<userId>", ...fields }
   * PATCH /user/admin-api/update
   */
  update(params: AdminUpdateUserParams): Promise<LiquidResponse<{ user: User }>> {
    return this.http.request({
      method: "PATCH",
      path: `${this.base}/update`,
      body: params,
    });
  }

  /**
   * Search users by query.
   * POST /user/admin-api/search
   */
  search(params: AdminUserSearchParams): Promise<LiquidResponse<{ results: User[] }>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/search`,
      body: params,
    });
  }

  /**
   * Retrieve full user info for multiple users by _id, email, etc.
   * Body: { targets: ["<id1>", ...], field?: "_id" | "email" | … }
   * POST /user/admin-api/retrieve-user-info
   */
  retrieveInfo(params: RetrieveUserInfoParams): Promise<LiquidResponse<{ users: User[] }>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/retrieve-user-info`,
      body: params,
    });
  }

  /**
   * Get the list of editable user profile fields per configuration.
   * GET /user/admin-api/editable-fields
   */
  getEditableFields(): Promise<LiquidResponse<{ editableFields: string[] }>> {
    return this.http.request({ path: `${this.base}/editable-fields` });
  }

  // ── Moderation ───────────────────────────────────────────────────────────────

  /**
   * Ban or unban a user.
   * Body: { target: "<userId>", state: true | false, reason?: "…" }
   * POST /user/admin-api/ban
   */
  ban(params: BanParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/ban`,
      body: params,
    });
  }

  /**
   * Restrict or unrestrict a user.
   * Body: { target: "<userId>", state: true | false, reason?: "…" }
   * POST /user/admin-api/restrict
   */
  restrict(params: RestrictParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/restrict`,
      body: params,
    });
  }

  /**
   * Mark a user's account as verified (email-verified badge).
   * Body: { target: "<userId>" }
   * POST /user/admin-api/verify
   */
  verify(params: VerifyUserParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/verify`,
      body: params,
    });
  }

  /**
   * Add/remove/set OAuth scopes for users, clients, or roles.
   * Body: { targets: ["…"], targetType: "user"|"client"|"role", scope: ["…"], operation: "add"|"del"|"set" }
   * POST /user/admin-api/access
   */
  setAccess(params: SetAccessParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/access`,
      body: params,
    });
  }

  // ── Credits ──────────────────────────────────────────────────────────────────

  /**
   * Increment, decrement, or set a user's credit balance.
   * Body: { target: "<userId>", type: "increment"|"decrement"|"set", value: <number> }
   * POST /user/admin-api/credits
   */
  setCredits(params: SetCreditsParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/credits`,
      body: params,
    });
  }

  // ── Subscriptions ─────────────────────────────────────────────────────────────

  /**
   * Activate or cancel a user's subscription.
   * Body: { target: "<userId>", state: true|false, expiry?: "ISO8601", tier?: "…" }
   * POST /user/admin-api/subscription
   */
  setSubscription(params: SetSubscriptionParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/subscription`,
      body: params,
    });
  }

  /**
   * Cancel a user's subscription.
   * POST /user/admin-api/subscription-cancel
   */
  cancelSubscription(params: { target: string }): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/subscription-cancel`,
      body: params,
    });
  }

  /**
   * Get the list of available subscription tiers from server config.
   * GET /user/admin-api/subscription-tiers
   */
  getSubscriptionTiers(): Promise<LiquidResponse<{ subscriptionTiers: string[] }>> {
    return this.http.request({ path: `${this.base}/subscription-tiers` });
  }

  // ── Custom Data ──────────────────────────────────────────────────────────────

  /**
   * Set arbitrary custom data for a user.
   * Body: { target: "<userId>", customData: { … } }
   * PUT /user/admin-api/custom-data
   */
  setCustomData(params: SetCustomDataParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "PUT",
      path: `${this.base}/custom-data`,
      body: params,
    });
  }

  // ── Login History ────────────────────────────────────────────────────────────

  /**
   * Get login history for any user.
   * Query: ?target=<userId>&limit=…&offset=…
   * GET /user/admin-api/login-history
   */
  getLoginHistory(params: GetAdminLoginHistoryParams): Promise<LiquidResponse<{ records: LoginHistoryEntry[] }>> {
    return this.http.request({
      path: `${this.base}/login-history`,
      query: params,
    });
  }

  // ── Invite Codes ─────────────────────────────────────────────────────────────

  /**
   * Get invite codes for a specific user.
   * Query: ?target=<userId>
   * GET /user/admin-api/invite-codes
   */
  getInviteCodes(params: GetInviteCodesParams): Promise<LiquidResponse<{ inviteCodes: InviteCode[] }>> {
    return this.http.request({
      path: `${this.base}/invite-codes`,
      query: params,
    });
  }

  /**
   * Generate invite codes for a specific user.
   * Body: { target: "<userId>", count?: <number> }
   * POST /user/admin-api/invite-codes
   */
  generateInviteCodes(params: GenerateInviteCodesParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/invite-codes`,
      body: params,
    });
  }
}
