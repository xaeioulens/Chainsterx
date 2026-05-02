import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the URL only if its scheme is http or https.
 * Blocks javascript:, data:, vbscript:, and any other scheme that
 * could execute code when used as an href or src attribute.
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return url
    }
    return null
  } catch {
    // Relative URLs have no protocol — allow them as-is (no XSS risk).
    // Anything that fails URL parsing and isn't a plain relative path is dropped.
    if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) {
      return url
    }
    return null
  }
}
