import { generateInviteCode, validateProjectLimit } from "./index";

describe("Utility functions", () => {
  describe("generateInviteCode", () => {
    it("should generate a 6-character code", () => {
      const code = generateInviteCode();
      expect(code).toHaveLength(6);
    });

    it("should generate code with only uppercase letters and numbers", () => {
      const code = generateInviteCode();
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
    });

    it("should generate different codes on multiple calls", () => {
      const codes = new Set();
      
      // Generate 100 codes and check they're mostly unique
      for (let i = 0; i < 100; i++) {
        codes.add(generateInviteCode());
      }
      
      // Should have high uniqueness (allowing for some collisions due to randomness)
      expect(codes.size).toBeGreaterThan(90);
    });
  });

  describe("validateProjectLimit", () => {
    it("should return true when project count is below limit", async () => {
      const result = await validateProjectLimit(3);
      expect(result).toBe(true);
    });

    it("should return true when project count equals limit minus 1", async () => {
      const result = await validateProjectLimit( 4);
      expect(result).toBe(true);
    });

    it("should return false when project count equals limit", async () => {
      const result = await validateProjectLimit( 5);
      expect(result).toBe(false);
    });

    it("should return false when project count exceeds limit", async () => {
      const result = await validateProjectLimit( 6);
      expect(result).toBe(false);
    });

    it("should return true for zero projects", async () => {
      const result = await validateProjectLimit( 0);
      expect(result).toBe(true);
    });
  });
});
