import { GroceryItemUnit } from "@kairos-lambdas-libs/dynamodb/enums";
import { logResponse, sortItems } from ".";

describe("Given the logResponse function", () => {
  it("should log the response", () => {
    const consoleSpy = jest.spyOn(console, "info");
    const items = [{ id: "1", name: "Item 1", quantity: "1", imagePath: "Image 1", unit: GroceryItemUnit.KILOGRAM }];

    logResponse(items);

    expect(consoleSpy).toHaveBeenCalledWith("Returning items", {
      count: 1,
      items: JSON.stringify(items),
    });
  });
});


describe("Given the sortItems function", () => {
  it("should sort the items by name", () => {
    const items = [
      { 
        id: "1", 
        name: "Banana", 
        quantity: "1", 
        imagePath: "Image 1", 
        unit: GroceryItemUnit.KILOGRAM 
      },
      { 
        id: "2", 
        name: "Apple", 
        quantity: "2", 
        imagePath: "Image 2", 
        unit: GroceryItemUnit.KILOGRAM 
      }
    ];

    const sortedItems = sortItems(items);

    expect(sortedItems).toEqual([
      { 
        id: "2", 
        name: "Apple", 
        quantity: "2", 
        imagePath: "Image 2", 
        unit: GroceryItemUnit.KILOGRAM 
      },
      { 
        id: "1", 
        name: "Banana", 
        quantity: "1", 
        imagePath: "Image 1", 
        unit: GroceryItemUnit.KILOGRAM 
      }
    ]);
  });
});
