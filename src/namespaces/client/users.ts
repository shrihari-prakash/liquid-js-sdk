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
  RetrieveUserInfoParams,
  SetCustomDataParams,
  GenerateInviteCodesParams,
  GetAdminLoginHistoryParams,
  GetInviteCodesParams,
  LoginHistoryEntry,
  InviteCode,
  PaginationParams,
  ClientFollowStatusParams,
  ClientFollowersParams,
  ClientBlockStatusParams,
  FollowRecord,
} from "../../types.js";

export class ClientUsersNamespace {
  constructor(private readonly http: HttpClient) {}

  private get base() {
    return "/user/client-api";
  }

  /**
   * List all users (paginated).
   * Query: ?limit=…&offset=…
   * GET /user/client-api/list
   */
  list(params?: PaginationParams): Promise<LiquidResponse<{ users: User[]; totalUsers: number }>> {
    return this.http.request({ path: `${this.base}/list`, query: params });
  }

  /**
   * Create a user via client credentials.
   * POST /user/client-api/create
   */
  create(params: AdminCreateUserParams): Promise<LiquidResponse<{ user: User }>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/create`,
      body: params,
    });
  }

  /**
   * Update a user via client credentials.
   * Body: { target: "<userId>", ...fields }
   * PATCH /user/client-api/update
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
   * POST /user/client-api/search
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
   * POST /user/client-api/retrieve-user-info
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
   * GET /user/client-api/editable-fields
   */
  getEditableFields(): Promise<LiquidResponse<{ editableFields: string[] }>> {
    return this.http.request({ path: `${this.base}/editable-fields` });
  }

  // ── Moderation ───────────────────────────────────────────────────────────────

  /**
   * Ban or unban a user.
   * Body: { target: "<userId>", state: true | false, reason?: "…" }
   * POST /user/client-api/ban
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
   * POST /user/client-api/restrict
   */
  restrict(params: RestrictParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/restrict`,
      body: params,
    });
  }

  /**
   * Add/remove/set OAuth scopes for users, clients, or roles.
   * Body: { targets: ["…"], targetType: "user"|"client"|"role", scope: ["…"], operation: "add"|"del"|"set" }
   * POST /user/client-api/access
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
   * POST /user/client-api/credits
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
   * POST /user/client-api/subscription
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
   * POST /user/client-api/subscription-cancel
   */
  cancelSubscription(params: { target: string }): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/subscription-cancel`,
      body: params,
    });
  }

  // ── Follow & Block Status ────────────────────────────────────────────────────

  /**
   * Check follow status between two users.
   * Query: ?source=<userId>&target=<userId>
   * GET /user/client-api/follow-status
   */
  getFollowStatus(params: ClientFollowStatusParams): Promise<LiquidResponse<{ following: boolean }>> {
    return this.http.request({ path: `${this.base}/follow-status`, query: params });
  }

  /**
   * Get followers for a specific user.
   * Query: ?target=<userId>&limit=…&offset=…
   * GET /user/client-api/user-followers
   */
  getUserFollowers(params: ClientFollowersParams): Promise<LiquidResponse<{ records: FollowRecord[] }>> {
    return this.http.request({ path: `${this.base}/user-followers`, query: params });
  }

  /**
   * Get users that a specific user is following.
   * Query: ?target=<userId>&limit=…&offset=…
   * GET /user/client-api/user-following
   */
  getUserFollowing(params: ClientFollowersParams): Promise<LiquidResponse<{ records: FollowRecord[] }>> {
    return this.http.request({ path: `${this.base}/user-following`, query: params });
  }

  /**
   * Check block status between two users.
   * Query: ?source=<userId>&target=<userId>
   * GET /user/client-api/block-status
   */
  getBlockStatus(params: ClientBlockStatusParams): Promise<LiquidResponse<{ blocked: boolean }>> {
    return this.http.request({ path: `${this.base}/block-status`, query: params });
  }

  // ── Custom Data ──────────────────────────────────────────────────────────────

  /**
   * Set arbitrary custom data for a user.
   * Body: { target: "<userId>", customData: { … } }
   * PUT /user/client-api/custom-data
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
   * GET /user/client-api/login-history
   */
  getLoginHistory(params: GetAdminLoginHistoryParams): Promise<LiquidResponse<{ records: LoginHistoryEntry[] }>> {
    return this.http.request({ path: `${this.base}/login-history`, query: params });
  }

  // ── Invite Codes ─────────────────────────────────────────────────────────────

  /**
   * Get invite codes for a specific user.
   * Query: ?target=<userId>
   * GET /user/client-api/invite-codes
   */
  getInviteCodes(params: GetInviteCodesParams): Promise<LiquidResponse<{ inviteCodes: InviteCode[] }>> {
    return this.http.request({ path: `${this.base}/invite-codes`, query: params });
  }

  /**
   * Generate invite codes for a specific user.
   * Body: { target: "<userId>", count?: <number> }
   * POST /user/client-api/invite-codes
   */
  generateInviteCodes(params: GenerateInviteCodesParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: `${this.base}/invite-codes`,
      body: params,
    });
  }
}
