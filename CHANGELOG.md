# Changelog

## 0.0.14-beta

- Added `onUnauthorized` callback support to `HttpClientOptions` and `LiquidClientOptions`.
- Implemented automatic 401 interception and single request retry on authenticated requests using refreshed tokens.

## 0.0.13-beta

- Added PKCE support for OAuth authorization code grant flow:
  - Supported `code_verifier` / `codeVerifier` in `TokenParams` and `OAuthNamespace.token()`.
  - Supported `code_challenge` / `code_challenge_method` in `AuthorizeParams` and `OAuthNamespace.buildAuthorizeUrl()`.

## 0.0.12-beta

- Published PKCE support parameters to npm registry.

## 0.0.11-beta

- Extended `SystemStats` interface with detailed memory, hardware, and system load properties:
  - Memory: `heapLimit`, `rss`, `systemTotalMemory`, `systemFreeMemory`.
  - CPU & Host: `cpuCount`, `arch`, `loadAvg`.

## 0.0.10-beta

- Removed `liquid.delegated` in favor of `liquid.users` (with `liquid.user` available as alias).

## 0.0.9-beta

- Audited all liquid handlers and corrected return type signatures:
  - `getMe()` returns `{ user: User; editableFields?: string[] }`.
  - `getSessionState()` returns `{ isLoggedIn?: boolean; userInfo: User }`.
  - `admin.users.create()` & `client.users.create()` return `{ insertedCount: number; user?: User }`.

## 0.0.8-beta

- Updated `updateProfilePicture` return type signature to `Promise<LiquidResponse<{ signedUrl: string }>>`.

## 0.0.7-beta

- Version bump for Nitrogen integration.

## 0.0.5-beta

- Eliminated `unknown` response types across all namespaces (`user`, `admin`, `client`).
- Replaced `unknown` void actions with `Promise<LiquidResponse<void>>` or `{ message?: string }`.
- Added `FollowRecord` interface for followers/following/follow-requests responses (`{ records: FollowRecord[] }`).
- Updated index signatures from `[key: string]: unknown` to `[key: string]: any` for flexible property access.

## 0.0.4-beta

- Fixed response unwrapping condition to check for `ok: 1` or `ok: true` as returned by Liquid's `SuccessResponse` class (`{ ok: 1, data: { ... } }`).

## 0.0.3-beta

- Automatically unwrap Liquid server's `{ status: "SUCCESS", data: { ... } }` response envelope in `HttpClient`.

## 0.0.2-beta

- Fixed `/oauth/token` request body encoding to send `application/x-www-form-urlencoded` (`URLSearchParams`) instead of `application/json`.

## 0.0.1-beta

- Initial beta release of `liquid-js-sdk`.
