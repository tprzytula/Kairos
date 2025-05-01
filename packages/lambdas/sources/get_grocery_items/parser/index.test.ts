import { parseItems } from ".";

describe("Given the parseItems function", () => {
  it("should parse the items", () => {
    const parsedItems = parseItems([
      {
        id: { S: "1" },
        name: { S: "Item 1" },
        quantity: { N: "1" },
      },
    ]);

    expect(parsedItems).toEqual([{ id: "1", name: "Item 1", quantity: 1 }]);
  });

  it("should filter out invalid items", () => {
    const parsedItems = parseItems([
      {
        id: { S: "quantity is not a number" },
        name: { S: "quantity is not a number" },
        quantity: { S: "quantity is not a number" },
      },
      {
        id: { N: "id is a number" },
        name: { S: "id is a number" },
        quantity: { N: "id is a number" },
      },
      {
        id: { S: "1" },
        name: { S: "Item 1" },
        quantity: { N: "1" },
      },
      {
        id: { S: "name is missing" },
        quantity: { N: "name is missing" },
      },
    ]);

    expect(parsedItems).toEqual([
      {
        id: "1",
        name: "Item 1",
        quantity: 1,
      },
    ]);
  });
});
