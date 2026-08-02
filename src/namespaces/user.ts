import type { HttpClient } from "../http.js";
import type {
  LiquidResponse,
  User,
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
  FollowRecord,
  LoginHistoryEntry,
  InviteCode,
  PaginationParams,
} from "../types.js";

export class UserNamespace {
  constructor(private readonly http: HttpClient) {}

  // ── Auth ────────────────────────────────────────────────────────────────────

  /**
   * Create a new user account.
   * POST /user/create
   */
  create(params: CreateUserParams): Promise<LiquidResponse<{ user: User }>> {
    return this.http.request({
      method: "POST",
      path: "/user/create",
      body: params,
      unauthenticated: true,
    });
  }

  /**
   * Log in with username or email and password.
   * Body: { username? | email?, password, userAgent? }
   * POST /user/login
   */
  login(params: LoginParams): Promise<LiquidResponse<LoginResponse>> {
    return this.http.request({
      method: "POST",
      path: "/user/login",
      body: params,
      unauthenticated: true,
    });
  }

  /**
   * Log out the current session.
   * GET /user/logout
   */
  logout(): Promise<LiquidResponse<void>> {
    return this.http.request({ path: "/user/logout" });
  }

  /**
   * Log out ALL sessions for the current user.
   * GET /user/logout-all
   */
  logoutAll(): Promise<LiquidResponse<void>> {
    return this.http.request({ path: "/user/logout-all" });
  }

  /**
   * Check whether the current session is active.
   * GET /user/session-state
   */
  getSessionState(): Promise<LiquidResponse<{ isLoggedIn: boolean; user?: User }>> {
    return this.http.request({ path: "/user/session-state", unauthenticated: true });
  }

  // ── Email verification ───────────────────────────────────────────────────────

  /**
   * Verify an email address.
   * Query: ?target=<userId>&code=<verificationCode>
   * GET /user/verify-email
   */
  verifyEmail(params: VerifyEmailParams): Promise<LiquidResponse<{ message?: string }>> {
    return this.http.request({
      path: "/user/verify-email",
      query: params,
      unauthenticated: true,
    });
  }

  /**
   * Resend the verification email.
   * Query: ?target=<userId>
   * GET /user/resend-verification
   */
  resendVerification(params: ResendVerificationParams): Promise<LiquidResponse<{ message?: string }>> {
    return this.http.request({
      path: "/user/resend-verification",
      query: params,
      unauthenticated: true,
    });
  }

  // ── Password reset ───────────────────────────────────────────────────────────

  /**
   * Step 1 – request a password-reset code (emailed to the user).
   * Query: ?email=<email>
   * GET /user/code
   * Returns: { target: "<userId>" }  ← pass this to resetPassword
   */
  getPasswordResetCode(params: GetPasswordResetCodeParams): Promise<LiquidResponse<{ target: string }>> {
    return this.http.request({
      path: "/user/code",
      query: params,
      unauthenticated: true,
    });
  }

  /**
   * Step 2 – set a new password using the emailed code.
   * Body: { target: "<userId>", code: "<emailed code>", password: "<new password>" }
   * POST /user/reset-password
   */
  resetPassword(params: ResetPasswordParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: "/user/reset-password",
      body: params,
      unauthenticated: true,
    });
  }

  // ── Profile ─────────────────────────────────────────────────────────────────

  /**
   * Get the authenticated user's profile.
   * GET /user/me
   */
  getMe(): Promise<LiquidResponse<{ user: User }>> {
    return this.http.request({ path: "/user/me" });
  }

  /**
   * Update the authenticated user's profile.
   * PATCH /user/me
   */
  updateMe(params: UpdateMeParams): Promise<LiquidResponse<{ user: User }>> {
    return this.http.request({
      method: "PATCH",
      path: "/user/me",
      body: params,
    });
  }

  /**
   * Get a user's public profile by their _id.
   * GET /user/:userId  (alias: /user/info/:userId)
   */
  getById(userId: string): Promise<LiquidResponse<{ user: User }>> {
    return this.http.request({ path: `/user/${userId}` });
  }

  /**
   * Search for users (delegated auth required).
   * POST /user/search
   */
  search(params: UserSearchParams): Promise<LiquidResponse<{ results: User[] }>> {
    return this.http.request({
      method: "POST",
      path: "/user/search",
      body: params,
    });
  }

  /**
   * Get the full list of available OAuth scopes (no auth required).
   * GET /user/scopes
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getScopes(): Promise<LiquidResponse<{ scopes: Record<string, any> }>> {
    return this.http.request({ path: "/user/scopes", unauthenticated: true });
  }

  /**
   * Get the authenticated user's invite codes.
   * GET /user/invite-codes
   */
  getInviteCodes(): Promise<LiquidResponse<{ inviteCodes: InviteCode[] }>> {
    return this.http.request({ path: "/user/invite-codes" });
  }

  /**
   * Get the authenticated user's own login history.
   * GET /user/login-history
   */
  getLoginHistory(): Promise<LiquidResponse<{ records: LoginHistoryEntry[] }>> {
    return this.http.request({ path: "/user/login-history" });
  }

  /**
   * Upload/replace the authenticated user's profile picture.
   * PATCH /user/profile-picture
   * Pass a FormData containing the image file field.
   */
  updateProfilePicture(formData: FormData): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "PATCH",
      path: "/user/profile-picture",
      body: formData,
    });
  }

  /**
   * Delete the authenticated user's profile picture.
   * DELETE /user/profile-picture
   */
  deleteProfilePicture(): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "DELETE",
      path: "/user/profile-picture",
    });
  }

  // ── Privacy ─────────────────────────────────────────────────────────────────

  /**
   * Toggle the authenticated user's private mode.
   * Body: { state: true | false }
   * Going public auto-accepts all pending follow requests.
   * POST /user/private
   */
  setPrivate(params: SetPrivateParams): Promise<LiquidResponse<{ acceptedCount?: number }>> {
    return this.http.request({
      method: "POST",
      path: "/user/private",
      body: params,
    });
  }

  // ── Follow ──────────────────────────────────────────────────────────────────

  /**
   * Follow a user.
   * Body: { target: "<userId>" }
   * POST /user/follow
   */
  follow(params: FollowParams): Promise<LiquidResponse<{ status: string }>> {
    return this.http.request({
      method: "POST",
      path: "/user/follow",
      body: params,
    });
  }

  /**
   * Unfollow a user.
   * Body: { target: "<userId>" }
   * POST /user/unfollow
   */
  unfollow(params: FollowParams): Promise<LiquidResponse<{ status: string }>> {
    return this.http.request({
      method: "POST",
      path: "/user/unfollow",
      body: params,
    });
  }

  /**
   * Get followers of the authenticated user (or a specific user).
   * GET /user/followers  |  GET /user/:userId/followers
   */
  getFollowers(params?: GetFollowersParams): Promise<LiquidResponse<{ records: FollowRecord[] }>> {
    const { userId, ...rest } = params ?? {};
    const path = userId ? `/user/${userId}/followers` : "/user/followers";
    return this.http.request({ path, query: rest });
  }

  /**
   * Get users the authenticated user (or a specific user) is following.
   * GET /user/following  |  GET /user/:userId/following
   */
  getFollowing(params?: GetFollowersParams): Promise<LiquidResponse<{ records: FollowRecord[] }>> {
    const { userId, ...rest } = params ?? {};
    const path = userId ? `/user/${userId}/following` : "/user/following";
    return this.http.request({ path, query: rest });
  }

  /**
   * Get pending incoming follow requests for the authenticated user.
   * GET /user/follow-requests
   */
  getFollowRequests(params?: PaginationParams): Promise<LiquidResponse<{ records: FollowRecord[] }>> {
    return this.http.request({ path: "/user/follow-requests", query: params });
  }

  /**
   * Check follow status between the authenticated user and a target.
   * GET /user/follow-status/:target
   */
  getFollowStatus(params: GetFollowStatusParams): Promise<LiquidResponse<{ following: boolean; requested?: boolean }>> {
    return this.http.request({ path: `/user/follow-status/${params.target}` });
  }

  /**
   * Accept a pending follow request.
   * Body: { request: "<followDocument._id>" }
   * PATCH /user/follow-request
   */
  acceptFollowRequest(params: FollowRequestPatchParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "PATCH",
      path: "/user/follow-request",
      body: params,
    });
  }

  /**
   * Remove a follow entry (delete a follow relationship by its document _id).
   * Body: { entry: "<followDocument._id>" }
   * DELETE /user/follow-entry
   */
  deleteFollowEntry(params: DeleteFollowEntryParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "DELETE",
      path: "/user/follow-entry",
      body: params,
    });
  }

  // ── Block ───────────────────────────────────────────────────────────────────

  /**
   * Block a user.
   * Body: { target: "<userId>" }
   * POST /user/block
   */
  block(params: BlockParams): Promise<LiquidResponse<{ status: string }>> {
    return this.http.request({
      method: "POST",
      path: "/user/block",
      body: params,
    });
  }

  /**
   * Unblock a user.
   * Body: { target: "<userId>" }
   * POST /user/unblock
   */
  unblock(params: BlockParams): Promise<LiquidResponse<{ status: string }>> {
    return this.http.request({
      method: "POST",
      path: "/user/unblock",
      body: params,
    });
  }

  // ── 2FA ─────────────────────────────────────────────────────────────────────

  /**
   * Enable or disable email 2FA for the authenticated user.
   * Body: { state: true | false }
   * POST /user/2fa
   */
  setup2FA(params: Setup2FAParams): Promise<LiquidResponse<void>> {
    return this.http.request({
      method: "POST",
      path: "/user/2fa",
      body: params,
    });
  }

  /**
   * Complete a 2FA challenge during login.
   * Body: { target: "<userId>", code: "<OTP>", sessionHash: "<fromLogin>" }
   * POST /user/do-2fa
   *
   * Get `target` and `sessionHash` from the `login()` response when `2faEnabled` is true.
   */
  do2FA(params: Do2FAParams): Promise<LiquidResponse<{ userInfo: User }>> {
    return this.http.request({
      method: "POST",
      path: "/user/do-2fa",
      body: params,
      unauthenticated: true,
    });
  }
}
