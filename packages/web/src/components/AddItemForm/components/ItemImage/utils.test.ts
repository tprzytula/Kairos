import { findItemIcon } from "./utils";

describe('Given the findItemIcon function', () => {
  describe('When the item name is not in the defaults', () => {
    it('should return undefined', () => {
      const result = findItemIcon('something', EXAMPLE_DEFAULTS);

      expect(result).toBeUndefined();
    });
  });

  describe('When the item name is in the defaults', () => {
    it('should return the item image', () => {
      const result = findItemIcon('test', EXAMPLE_DEFAULTS);

      expect(result).toBe("test-icon");
    });
  });

  describe('When there are no defaults', () => {
    it('should return undefined', () => {
      const result = findItemIcon('test', []);

      expect(result).toBeUndefined();
    });
  });

  describe('When the defaults are not an array', () => {
    it('should return undefined', () => {
      const result = findItemIcon('test', undefined);

      expect(result).toBeUndefined();
    });
  });
});

export const EXAMPLE_DEFAULTS = [
    { name: "test", icon: "test-icon" },
    { name: "generic", icon: "generic-icon" },
];