import { logResponse, sortItems } from ".";

describe("Given the logResponse function", () => {
  it("should log the response", () => {
    const consoleSpy = jest.spyOn(console, "info");
    const items = [{ id: "1", name: "Item 1", isDone: false }];

    logResponse(items);

    expect(consoleSpy).toHaveBeenCalledWith("Returning items", {
      count: 1,
      items: JSON.stringify(items),
    });
  });
});

describe("Given the sortItems function", () => {
  it("should sort the items by due date", () => {
    const items = [
      { 
        id: "1", 
        name: "Dentist Appointment", 
        dueDate: 1609545800000, 
        isDone: false 
      },
      { 
        id: "2", 
        name: "Doctor Appointment", 
        dueDate: 1609545600000, 
        isDone: false 
      }
    ];

    const sortedItems = sortItems(items);

    expect(sortedItems).toEqual([
      { 
        id: "2", 
        name: "Doctor Appointment", 
        dueDate: 1609545600000, 
        isDone: false 
      },
      { 
        id: "1", 
        name: "Dentist Appointment", 
        dueDate: 1609545800000, 
        isDone: false 
      }
    ]);
  });
});