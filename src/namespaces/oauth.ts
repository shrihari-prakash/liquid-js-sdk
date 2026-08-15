import type { HttpClient } from "../http.js";
import type {
  LiquidResponse,
  TokenParams,
  TokenResponse,
  IntrospectParams,
  IntrospectResponse,
  AuthorizeParams,
} from "../types.js";

export class OAuthNamespace {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get an OAuth token (client_credentials, authorization_code, refresh_token, password).
   * POST /oauth/token
   * Note: The server requires `application/x-www-form-urlencoded`.
   */
  token(params: TokenParams): Promise<LiquidResponse<TokenResponse>> {
    const searchParams = new URLSearchParams();
    searchParams.set("grant_type", params.grantType);
    if (params.clientId) searchParams.set("client_id", params.clientId);
    if (params.clientSecret)
      searchParams.set("client_secret", params.clientSecret);
    if (params.code) searchParams.set("code", params.code);
    const codeVerifier = params.codeVerifier || params.code_verifier;
    if (codeVerifier) searchParams.set("code_verifier", codeVerifier);
    if (params.redirectUri)
      searchParams.set("redirect_uri", params.redirectUri);
    if (params.refreshToken)
      searchParams.set("refresh_token", params.refreshToken);
    if (params.username) searchParams.set("username", params.username);
    if (params.password) searchParams.set("password", params.password);
    if (params.scope) searchParams.set("scope", params.scope);

    return this.http.request({
      method: "POST",
      path: "/oauth/token",
      body: searchParams,
      unauthenticated: true,
    });
  }

  /**
   * Introspect an access token to check validity and retrieve token metadata.
   * POST /oauth/introspect
   */
  introspect(
    params: IntrospectParams,
  ): Promise<LiquidResponse<IntrospectResponse>> {
    return this.http.request({
      method: "POST",
      path: "/oauth/introspect",
      body: params,
    });
  }

  /**
   * Build the authorization URL to redirect a user to for an OAuth authorization code flow.
   * Returns the full URL string — navigate the browser to it.
   * GET /oauth/authorize (redirect URL builder)
   */
  buildAuthorizeUrl(baseUrl: string, params: AuthorizeParams): string {
    const url = new URL("/oauth/authorize", baseUrl);
    url.searchParams.set("response_type", params.responseType);
    url.searchParams.set("client_id", params.clientId);
    url.searchParams.set("redirect_uri", params.redirectUri);
    if (params.scope) url.searchParams.set("scope", params.scope);
    if (params.state) url.searchParams.set("state", params.state);
    const codeChallenge = params.codeChallenge || params.code_challenge;
    if (codeChallenge) url.searchParams.set("code_challenge", codeChallenge);
    const codeChallengeMethod =
      params.codeChallengeMethod ||
      params.code_challenge_method ||
      (codeChallenge ? "S256" : undefined);
    if (codeChallengeMethod)
      url.searchParams.set("code_challenge_method", codeChallengeMethod);
    return url.toString();
  }
}
