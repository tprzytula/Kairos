import { logResponse, sortItems } from ".";

describe("Given the logResponse function", () => {
  it("should log the response", () => {
    const consoleSpy = jest.spyOn(console, "info");
    const items = [{ id: "1", name: "Item 1", quantity: 1 }];

    logResponse(items);

    expect(consoleSpy).toHaveBeenCalledWith("Returning items", {
      count: 1,
      items: JSON.stringify(items),
    });
  });
});

describe("Given the sortItems function", () => {
  it("should sort the items by timestamp in ascending order", () => {
    const items = [
      { timestamp: 1714003200000 },
      { timestamp: 1814003200000 },
      { timestamp: 1614003200000 },
    ];

    const sortedItems = sortItems(items);

    expect(sortedItems).toEqual([
      { timestamp: 1614003200000 },
      { timestamp: 1714003200000 },
      { timestamp: 1814003200000 },
    ]);
  });
});