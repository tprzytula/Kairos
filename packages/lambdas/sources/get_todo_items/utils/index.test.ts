import { logResponse, sortItems } from ".";

describe("Given the logResponse function", () => {
  it("should log the response", () => {
    const consoleSpy = vi.spyOn(console, "info");
    const items = [{ id: "1", name: "Item 1", isDone: false }];

    logResponse(items);

    expect(consoleSpy).toHaveBeenCalledWith("Returning items", {
      count: 1,
      items: JSON.stringify(items),
    });
  });
});

describe("Given the sortItems function", () => {
  it("should sort the items by due date ascending", () => {
    const items = [
      {
        id: "1",
        name: "Later Task",
        dueDate: 1609545800000,
        isDone: false
      },
      {
        id: "2",
        name: "Earlier Task",
        dueDate: 1609545600000,
        isDone: false
      },
      {
        id: "3",
        name: "Middle Task",
        dueDate: 1609545700000,
        isDone: false
      }
    ];

    const sortedItems = sortItems(items);

    expect(sortedItems.map(i => i.id)).toEqual(["2", "3", "1"]);
  });

  it("should return 0 when both items have the same due date", () => {
    const items = [
      {
        id: "1",
        name: "Task A",
        dueDate: 1609545600000,
        isDone: false
      },
      {
        id: "2",
        name: "Task B",
        dueDate: 1609545600000,
        isDone: false
      }
    ];

    const sortedItems = sortItems(items);

    expect(sortedItems[0].id).toBe("1");
    expect(sortedItems[1].id).toBe("2");
  });

  it("should handle items without due dates by keeping original order", () => {
    const items = [
      {
        id: "1",
        name: "No Date Task",
        isDone: false
      },
      {
        id: "2",
        name: "Also No Date",
        isDone: false
      }
    ];

    const sortedItems = sortItems(items);

    expect(sortedItems[0].id).toBe("1");
    expect(sortedItems[1].id).toBe("2");
  });

  it("should keep original order when only one item has a due date", () => {
    const items = [
      {
        id: "1",
        name: "Task With Date",
        dueDate: 1609545600000,
        isDone: false
      },
      {
        id: "2",
        name: "Task Without Date",
        isDone: false
      }
    ];

    const sortedItems = sortItems(items);

    expect(sortedItems[0].id).toBe("1");
    expect(sortedItems[1].id).toBe("2");
  });

  it("should keep original order when second item has due date but first does not", () => {
    const items = [
      {
        id: "1",
        name: "Task Without Date",
        isDone: false
      },
      {
        id: "2",
        name: "Task With Date",
        dueDate: 1609545600000,
        isDone: false
      }
    ];

    const sortedItems = sortItems(items);

    expect(sortedItems[0].id).toBe("1");
    expect(sortedItems[1].id).toBe("2");
  });
});