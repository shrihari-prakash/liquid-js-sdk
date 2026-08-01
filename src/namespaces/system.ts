import type { HttpClient } from "../http.js";
import type {
  LiquidResponse,
  SystemSettings,
  SystemVersion,
  CountryEntry,
} from "../types.js";

export class SystemNamespace {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get system settings (requires delegated auth).
   * GET /system/settings
   */
  getSettings(): Promise<LiquidResponse<{ settings: SystemSettings }>> {
    return this.http.request({ path: "/system/settings" });
  }

  /**
   * Get public system settings without authentication.
   * GET /system/settings-insecure
   */
  getSettingsInsecure(): Promise<LiquidResponse<{ settings: Partial<SystemSettings> }>> {
    return this.http.request({ path: "/system/settings-insecure", unauthenticated: true });
  }

  /**
   * Get the Liquid server version.
   * GET /system/version
   */
  getVersion(): Promise<LiquidResponse<SystemVersion>> {
    return this.http.request({ path: "/system/version", unauthenticated: true });
  }

  /**
   * Get the list of supported countries without authentication.
   * GET /system/countries-insecure
   */
  getCountriesInsecure(): Promise<LiquidResponse<{ countries: CountryEntry[] }>> {
    return this.http.request({ path: "/system/countries-insecure", unauthenticated: true });
  }
}
