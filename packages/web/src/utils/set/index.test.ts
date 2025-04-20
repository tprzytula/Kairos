import { addToSet, removeFromSet } from ".";

describe("Given the addToSet function", () => {
  it("should add an item to the set", () => {
    const set = new Set<string>();
    const result = addToSet(set, "item");
    expect(result.has("item")).toBe(true);
  });
});

describe("Given the removeFromSet function", () => {
  it("should remove an item from the set", () => {
    const set = new Set<string>();
    const setWithItem = addToSet(set, "item");
    const result = removeFromSet(setWithItem, "item");
    expect(result.has("item")).toBe(false);
  });
});