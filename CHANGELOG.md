# Changelog

## 0.0.3-beta

- Automatically unwrap Liquid server's `{ status: "SUCCESS", data: { ... } }` response envelope in `HttpClient`, eliminating double `.data.data` access across all SDK methods.

## 0.0.2-beta

- Fixed `/oauth/token` request body encoding to send `application/x-www-form-urlencoded` (`URLSearchParams`) instead of `application/json`.

## 0.0.1-beta

- Initial beta release of `liquid-js-sdk`.
