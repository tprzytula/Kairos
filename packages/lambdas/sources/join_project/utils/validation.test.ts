import {
  validateProjectJoinability,
  validateUserProjectLimit,
  validateProjectCapacity,
  validateExistingMembership,
} from "./validation";

describe("validation utilities", () => {
  describe("validateProjectJoinability", () => {
    it("should return error for personal projects", () => {
      const project = { isPersonal: true } as any;
      const result = validateProjectJoinability(project);
      expect(result).toBe("Cannot join personal projects.");
    });

    it("should return null for shared projects", () => {
      const project = { isPersonal: false } as any;
      const result = validateProjectJoinability(project);
      expect(result).toBe(null);
    });
  });

  describe("validateUserProjectLimit", () => {
    it("should return error when user has 5 projects", () => {
      const userProjects = Array(5).fill({});
      const result = validateUserProjectLimit(userProjects);
      expect(result).toBe("Maximum number of projects reached (5 projects per user).");
    });

    it("should return null when user has less than 5 projects", () => {
      const userProjects = Array(3).fill({});
      const result = validateUserProjectLimit(userProjects);
      expect(result).toBe(null);
    });
  });

  describe("validateProjectCapacity", () => {
    it("should return error when project is at capacity", () => {
      const project = { maxMembers: 3 } as any;
      const members = Array(3).fill({});
      const result = validateProjectCapacity(project, members);
      expect(result).toBe("Project is at maximum capacity.");
    });

    it("should use default capacity of 5", () => {
      const project = {} as any;
      const members = Array(5).fill({});
      const result = validateProjectCapacity(project, members);
      expect(result).toBe("Project is at maximum capacity.");
    });

    it("should return null when project has space", () => {
      const project = { maxMembers: 5 } as any;
      const members = Array(3).fill({});
      const result = validateProjectCapacity(project, members);
      expect(result).toBe(null);
    });
  });

  describe("validateExistingMembership", () => {
    it("should return error when membership exists", () => {
      const membership = { userId: "user-123" } as any;
      const result = validateExistingMembership(membership);
      expect(result).toBe("You are already a member of this project.");
    });

    it("should return null when no membership exists", () => {
      const result = validateExistingMembership(null);
      expect(result).toBe(null);
    });
  });
});
