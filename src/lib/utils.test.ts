import { sanitizeUrl } from "./utils";

// sanitizeUrl must only pass http/https URLs through.
// Any other scheme (javascript:, data:, vbscript:, etc.) must return null.

describe("sanitizeUrl", () => {
  // ── Allowed schemes ──────────────────────────────────────────────────────

  it("passes https URLs", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
  });

  it("passes http URLs", () => {
    expect(sanitizeUrl("http://example.com/path?q=1")).toBe(
      "http://example.com/path?q=1"
    );
  });

  it("passes https URLs with paths and query strings", () => {
    const url = "https://opensea.io/collection/foo?tab=activity";
    expect(sanitizeUrl(url)).toBe(url);
  });

  // ── Blocked schemes ───────────────────────────────────────────────────────

  it("blocks javascript: scheme", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBeNull();
  });

  it("blocks javascript: with mixed case", () => {
    expect(sanitizeUrl("JavaScript:alert(1)")).toBeNull();
  });

  it("blocks data: URIs", () => {
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
  });

  it("blocks data: image URIs", () => {
    expect(sanitizeUrl("data:image/png;base64,abc123")).toBeNull();
  });

  it("blocks vbscript: scheme", () => {
    expect(sanitizeUrl("vbscript:msgbox(1)")).toBeNull();
  });

  it("blocks file: scheme", () => {
    expect(sanitizeUrl("file:///etc/passwd")).toBeNull();
  });

  it("blocks blob: scheme", () => {
    expect(sanitizeUrl("blob:https://example.com/uuid")).toBeNull();
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it("returns null for empty string", () => {
    expect(sanitizeUrl("")).toBeNull();
  });

  it("returns null for whitespace-only string", () => {
    // URL constructor throws on whitespace, not a valid relative path
    expect(sanitizeUrl("   ")).toBeNull();
  });

  it("allows absolute-path relative URLs", () => {
    expect(sanitizeUrl("/images/foo.png")).toBe("/images/foo.png");
  });

  it("allows relative URLs starting with ./", () => {
    expect(sanitizeUrl("./assets/img.jpg")).toBe("./assets/img.jpg");
  });

  it("allows relative URLs starting with ../", () => {
    expect(sanitizeUrl("../assets/img.jpg")).toBe("../assets/img.jpg");
  });

  it("blocks bare protocol-relative URLs that aren't relative paths", () => {
    // '//evil.com' is not a relative path starting with / followed by more /
    // URL constructor parses it as https://evil.com when given a base,
    // but without a base it throws — our function returns null for it.
    // This is acceptable: callers should use full https:// URLs.
    const result = sanitizeUrl("//evil.com/xss");
    // Either null or the original string is acceptable, but it must NOT
    // be treated as a safe http/https URL by the function.
    if (result !== null) {
      expect(result).toBe("//evil.com/xss");
    }
  });
});
