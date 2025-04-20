import { parseItems } from ".";

describe("Given the parseItems function", () => {
  it("should parse the items", () => {
    const parsedItems = parseItems([
      {
        id: { S: "1" },
        name: { S: "Item 1" },
        quantity: { N: "1" },
        imagePath: { S: "Image 1" },
        unit: { S: "kg" },
      },
    ]);

    expect(parsedItems).toEqual([
      {
        id: "1",
        name: "Item 1",
        quantity: 1,
        imagePath: "Image 1",
        unit: "kg"
      }
    ]);
  });

  it("should filter out invalid items", () => {
    const parsedItems = parseItems([
      {
        id: { S: "quantity is not a number" },
        name: { S: "quantity is not a number" },
        quantity: { S: "quantity is not a number" },
        imagePath: { S: "quantity is not a number" }, 
        unit: { S: "quantity is not a number" },
      },
      {
        id: { N: "id is a number" },
        name: { S: "id is a number" },
        quantity: { N: "id is a number" },
        imagePath: { S: "id is a number" },
        unit: { S: "id is a number" },
      },
      {
        id: { S: "1" },
        name: { S: "Item 1" },
        quantity: { N: "1" },
        imagePath: { S: "Image 1" },
        unit: { S: "kg" },
      },
      {
        id: { S: "name is missing" },
        quantity: { N: "name is missing" },
        imagePath: { S: "name is missing" },
        unit: { S: "kg" },
      },
      {
        id: { S: "imagePath is not a string" },
        name: { S: "imagePath is not a string" },
        quantity: { N: "imagePath is not a string" },
        imagePath: { N: "5" },
        unit: { S: "kg" },
      },
      {
        id: { S: "unit is missing" },
        name: { S: "unit is missing" },
        quantity: { N: "unit is missing" },
        imagePath: { S: "unit is missing" },
      },
    ]);

    expect(parsedItems).toEqual([
      {
        id: "1",
        name: "Item 1",
        quantity: 1,
        imagePath: "Image 1",
        unit: "kg",
      },
    ]);
  });
});
