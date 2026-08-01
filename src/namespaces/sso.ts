import type { HttpClient } from "../http.js";

export class SSONamespace {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    baseUrl: string
  ) {
    this.baseUrl = baseUrl;
  }

  /**
   * Build the URL to redirect a user to for Google SSO login.
   * Navigate the browser to this URL to start the OAuth flow.
   * GET /sso/google
   */
  buildGoogleLoginUrl(): string {
    const url = new URL("/sso/google", this.baseUrl);
    return url.toString();
  }
}
