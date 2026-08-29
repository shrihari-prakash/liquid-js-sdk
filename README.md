# liquid-js-sdk

A universal (browser + Node.js) TypeScript SDK for the [Liquid](https://github.com/shrihari-prakash/liquid) authentication platform. Built with zero runtime dependencies using native `fetch`.

## Installation

```bash
npm install liquid-js-sdk
```

## Quick Start

```ts
import { createLiquidClient } from "liquid-js-sdk";

const liquid = createLiquidClient({
  baseUrl: "https://auth.example.com",
  getAccessToken: () => localStorage.getItem("access_token") ?? "",
});

// Get the logged-in user's profile
const { data } = await liquid.users.getMe();
console.log(data.user);
```

## Automatic Token Refresh (`onUnauthorized`)

The SDK supports seamless automatic token refresh when authenticated requests receive a `401 Unauthorized`.

Pass the `onUnauthorized` callback in client options:

```ts
import { createLiquidClient } from "liquid-js-sdk";
import oauthManager from "./oauth-manager";

const liquid = createLiquidClient({
  baseUrl: "https://auth.example.com",
  getAccessToken: async () => oauthManager.getAccessToken(),
  onUnauthorized: async () => {
    // Perform token refresh (e.g. via refresh_token) and return the fresh access token
    const freshToken = await oauthManager.refreshAccessToken();
    return freshToken; // returning string retries the request; null/undefined aborts retry
  },
});
```

### Features:
- **Single-Flight Mutex (Promise Sharing)**: When multiple API calls hit `401` concurrently, `onUnauthorized` is executed **only once**. All concurrent in-flight requests await the same refresh promise and retry in parallel with the new access token.
- **Transparent Retry**: If `onUnauthorized` returns a new token string, the failed request is retried once with the new Bearer header and resolves cleanly.

## API Namespaces Summary

| Namespace                | Auth Context       | Example Usage                                                 |
| ------------------------ | ------------------ | ------------------------------------------------------------- |
| `liquid.users.*`         | User (Delegated Auth) | `liquid.users.getMe()` (Alias: `liquid.user`)                |
| `liquid.admin.users.*`   | Admin Delegated    | `liquid.admin.users.ban({ target: 'user_123', state: true })` |
| `liquid.admin.oauth.*`   | Admin Delegated    | `liquid.admin.oauth.createClient(...)`                        |
| `liquid.admin.roles.*`   | Admin Delegated    | `liquid.admin.roles.create({ id: 'editor', ... })`            |
| `liquid.admin.system.*`  | Admin Delegated    | `liquid.admin.system.getStats()`                              |
| `liquid.client.users.*`  | Client Credentials | `liquid.client.users.list({ limit: 10 })`                     |
| `liquid.client.oauth.*`  | Client Credentials | `liquid.client.oauth.getClient()`                             |
| `liquid.client.roles.*`  | Client Credentials | `liquid.client.roles.create(...)`                             |
| `liquid.client.system.*` | Client Credentials | `liquid.client.system.getStats()`                             |
| `liquid.oauth.*`         | Public / Client    | `liquid.oauth.token(...)`                                     |
| `liquid.system.*`        | Delegated / Public | `liquid.system.getVersion()`                                  |
| `liquid.roles.*`         | Delegated          | `liquid.roles.list()`                                         |
| `liquid.health.*`        | Public             | `liquid.health.check()`                                       |
| `liquid.sso.*`           | Public             | `liquid.sso.buildGoogleLoginUrl()`                            |

## Response Format

All SDK calls return a `Promise<LiquidResponse<T>>`:

```ts
interface LiquidResponse<T> {
  status: number; // HTTP Status Code (e.g. 200, 201)
  data: T; // Response payload
  ok: boolean; // true if 2xx HTTP response
}
```

## License

MIT © Shrihari Prakasam
