import { isElectron } from "@/lib/electron-detector";

// Cache the Electron detection result since it only changes during app initialization
const IS_ELECTRON = isElectron();

/**
 * Utility class for handling URL operations across different routing environments.
 * Supports both BrowserRouter (web) and HashRouter (Electron) URL structures.
 */
export class UrlUtils {
  /**
   * Extract URLSearchParams from a URL string, handling both BrowserRouter and HashRouter.
   *
   * @param url - The URL string to parse
   * @returns URLSearchParams object containing the query parameters
   *
   * @example
   * // Web (BrowserRouter): https://example.com/app/palette-edit?colors=...
   * // Electron (HashRouter): file:///.../index.html#/app/palette-edit?colors=...
   */
  static getUrlParams(url: string): URLSearchParams {
    try {
      // Check if we're in Electron (HashRouter) or web (BrowserRouter)
      if (IS_ELECTRON) {
        // In Electron with HashRouter, parameters come after the hash
        // Example: file:///.../index.html#/app/palette-edit?colors=...
        const hashIndex = url.indexOf('#');
        if (hashIndex !== -1) {
          const hashPart = url.substring(hashIndex + 1);
          const queryIndex = hashPart.indexOf('?');
          if (queryIndex !== -1) {
            const queryString = hashPart.substring(queryIndex + 1);
            return new URLSearchParams(queryString);
          }
        }
        return new URLSearchParams();
      } else {
        // In web with BrowserRouter, use standard URL parsing
        const urlObject = new URL(url, window.location.origin);
        return urlObject.searchParams;
      }
    } catch (error) {
      console.error("Error parsing URL parameters:", error);
      return new URLSearchParams();
    }
  }

  /**
   * Get the current URL parameters from the browser's location.
   * Handles both BrowserRouter and HashRouter environments.
   *
   * @returns URLSearchParams object containing current URL parameters
   */
  static getCurrentUrlParams(): URLSearchParams {
    if (typeof window === 'undefined') {
      return new URLSearchParams();
    }

    return this.getUrlParams(window.location.href);
  }

  /**
   * Build a URL with parameters appropriate for the current routing environment.
   *
   * @param path - The path portion of the URL (e.g., '/app/palette-edit')
   * @param params - Object containing key-value pairs for URL parameters
   * @returns Complete URL string appropriate for current environment
   *
   * @example
   * // Web: /app/palette-edit?colors=red,blue,green
   * // Electron: #/app/palette-edit?colors=red,blue,green
   */
  static buildUrl(path: string, params: Record<string, string> = {}): string {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();

    if (IS_ELECTRON) {
      // HashRouter format
      return queryString ? `#${path}?${queryString}` : `#${path}`;
    } else {
      // BrowserRouter format
      return queryString ? `${path}?${queryString}` : path;
    }
  }

  /**
   * Extract the path portion from a URL, handling both routing environments.
   *
   * @param url - The URL to extract the path from
   * @returns The path portion of the URL
   *
   * @example
   * // Web: https://example.com/app/palette-edit?colors=... → /app/palette-edit
   * // Electron: file:///.../index.html#/app/palette-edit?colors=... → /app/palette-edit
   */
  static getPathFromUrl(url: string): string {
    try {
      if (IS_ELECTRON) {
        const hashIndex = url.indexOf('#');
        if (hashIndex !== -1) {
          const hashPart = url.substring(hashIndex + 1);
          const queryIndex = hashPart.indexOf('?');
          return queryIndex !== -1 ? hashPart.substring(0, queryIndex) : hashPart;
        }
        return '';
      } else {
        const urlObject = new URL(url, window.location.origin);
        return urlObject.pathname;
      }
    } catch (error) {
      console.error("Error extracting path from URL:", error);
      return '';
    }
  }
}
