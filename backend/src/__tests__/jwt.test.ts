import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";

describe("jwt utils", () => {
  it("signs and verifies an access token round-trip", () => {
    const token = signAccessToken({ sub: "user-1", role: "CUSTOMER" });
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe("user-1");
    expect(payload.role).toBe("CUSTOMER");
  });

  it("signs and verifies a refresh token round-trip", () => {
    const token = signRefreshToken({ sub: "user-2", role: "ADMIN" });
    const payload = verifyRefreshToken(token);
    expect(payload.sub).toBe("user-2");
    expect(payload.role).toBe("ADMIN");
  });

  it("throws when verifying a tampered token", () => {
    const token = signAccessToken({ sub: "user-3", role: "CUSTOMER" });
    expect(() => verifyAccessToken(token + "tampered")).toThrow();
  });

  it("does not accept an access token as a refresh token", () => {
    const token = signAccessToken({ sub: "user-4", role: "CUSTOMER" });
    expect(() => verifyRefreshToken(token)).toThrow();
  });
});
