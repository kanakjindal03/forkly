import { hashPassword, comparePassword } from "../utils/password";

describe("password utils", () => {
  it("hashes a password and can verify it against the original", async () => {
    const hash = await hashPassword("Sup3rSecret!");
    expect(hash).not.toEqual("Sup3rSecret!");
    await expect(comparePassword("Sup3rSecret!", hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("Sup3rSecret!");
    await expect(comparePassword("wrong-password", hash)).resolves.toBe(false);
  });
});
