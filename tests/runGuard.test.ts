import { describe, expect, test } from "bun:test";
import { shouldGuardNavigation } from "../src/lib/runGuard.js";

describe("run guard", () => {
  test("guards normal navigation while a run is active", () => {
    expect(shouldGuardNavigation({ href: "/teams/", active: true })).toBe(true);
    expect(
      shouldGuardNavigation({ href: "https://example.com", active: true }),
    ).toBe(true);
  });

  test("does not guard when no run is active", () => {
    expect(shouldGuardNavigation({ href: "/teams/", active: false })).toBe(
      false,
    );
  });

  test("ignores non-navigation links", () => {
    expect(shouldGuardNavigation({ href: "#main", active: true })).toBe(false);
    expect(shouldGuardNavigation({ href: "mailto:a@b.c", active: true })).toBe(
      false,
    );
    expect(shouldGuardNavigation({ href: "tel:+123", active: true })).toBe(
      false,
    );
    expect(
      shouldGuardNavigation({ href: "javascript:void(0)", active: true }),
    ).toBe(false);
  });

  test("allows clicks that keep the current page alive", () => {
    expect(
      shouldGuardNavigation({
        href: "/teams/",
        active: true,
        target: "_blank",
      }),
    ).toBe(false);
    expect(
      shouldGuardNavigation({
        href: "/teams/",
        active: true,
        download: true,
      }),
    ).toBe(false);
    expect(
      shouldGuardNavigation({
        href: "/teams/",
        active: true,
        modifier: true,
      }),
    ).toBe(false);
    expect(
      shouldGuardNavigation({ href: "/teams/", active: true, help: true }),
    ).toBe(false);
  });
});
