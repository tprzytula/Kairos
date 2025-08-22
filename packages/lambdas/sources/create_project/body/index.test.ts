import { getBody } from "./index";

describe("Given the create project body parser", () => {
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

  describe("When name is missing", () => {
    it("should return null", () => {
      const body = JSON.stringify({});
      const result = getBody(body);
      expect(result).toBeNull();
    });
  });

  describe("When name is empty", () => {
    it("should return null", () => {
      const body = JSON.stringify({ name: "" });
      const result = getBody(body);
      expect(result).toBeNull();
    });
  });

  describe("When name is only whitespace", () => {
    it("should return null", () => {
      const body = JSON.stringify({ name: "   " });
      const result = getBody(body);
      expect(result).toBeNull();
    });
  });

  describe("When name is too long", () => {
    it("should return null", () => {
      const longName = "a".repeat(51);
      const body = JSON.stringify({ name: longName });
      const result = getBody(body);
      expect(result).toBeNull();
    });
  });

  describe("When isPersonal is not a boolean", () => {
    it("should return null", () => {
      const body = JSON.stringify({ name: "Valid Name", isPersonal: "true" });
      const result = getBody(body);
      expect(result).toBeNull();
    });
  });

  describe("When body is valid", () => {
    it("should return parsed and trimmed body", () => {
      const body = JSON.stringify({ name: "  My Project  ", isPersonal: true });
      const result = getBody(body);
      
      expect(result).toEqual({
        name: "My Project",
        isPersonal: true,
      });
    });

    it("should default isPersonal to false", () => {
      const body = JSON.stringify({ name: "My Project" });
      const result = getBody(body);
      
      expect(result).toEqual({
        name: "My Project",
        isPersonal: false,
      });
    });

    it("should handle maximum length name", () => {
      const maxName = "a".repeat(50);
      const body = JSON.stringify({ name: maxName });
      const result = getBody(body);
      
      expect(result).toEqual({
        name: maxName,
        isPersonal: false,
      });
    });
  });
});
