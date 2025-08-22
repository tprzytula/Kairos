import { getBody } from "./index";

describe("Given the join project body parser", () => {
  describe("When body is null", () => {
    it("should return null", () => {
      const result = getBody(null);
      expect(result).toBeNull();
    });
  });

  describe("When body is invalid JSON", () => {
    it("should return null", () => {
      const result = getBody("invalid json");
      expect(result).toBeNull();
    });
  });

  describe("When inviteCode is missing", () => {
    it("should return null", () => {
      const body = JSON.stringify({});
      const result = getBody(body);
      expect(result).toBeNull();
    });
  });

  describe("When inviteCode is not a string", () => {
    it("should return null", () => {
      const body = JSON.stringify({ inviteCode: 123456 });
      const result = getBody(body);
      expect(result).toBeNull();
    });
  });

  describe("When inviteCode has wrong length", () => {
    it("should return null for too short code", () => {
      const body = JSON.stringify({ inviteCode: "ABC12" });
      const result = getBody(body);
      expect(result).toBeNull();
    });

    it("should return null for too long code", () => {
      const body = JSON.stringify({ inviteCode: "ABC1234" });
      const result = getBody(body);
      expect(result).toBeNull();
    });
  });

  describe("When inviteCode contains invalid characters", () => {
    it("should return null for special characters", () => {
      const body = JSON.stringify({ inviteCode: "ABC-12" });
      const result = getBody(body);
      expect(result).toBeNull();
    });

    it("should return null for spaces", () => {
      const body = JSON.stringify({ inviteCode: "ABC 12" });
      const result = getBody(body);
      expect(result).toBeNull();
    });
  });

  describe("When inviteCode is valid", () => {
    it("should return uppercase code for all uppercase input", () => {
      const body = JSON.stringify({ inviteCode: "ABC123" });
      const result = getBody(body);
      
      expect(result).toEqual({
        inviteCode: "ABC123",
      });
    });

    it("should handle mixed case by converting to uppercase", () => {
      // The function converts to uppercase before validation, so this should work
      const body = JSON.stringify({ inviteCode: "aBc123" });
      const result = getBody(body);
      
      expect(result).toEqual({
        inviteCode: "ABC123",
      });
    });

    it("should accept all numbers", () => {
      const body = JSON.stringify({ inviteCode: "123456" });
      const result = getBody(body);
      
      expect(result).toEqual({
        inviteCode: "123456",
      });
    });

    it("should accept mixed alphanumeric", () => {
      const body = JSON.stringify({ inviteCode: "A1B2C3" });
      const result = getBody(body);
      
      expect(result).toEqual({
        inviteCode: "A1B2C3",
      });
    });
  });
});
