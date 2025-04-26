import { logResponse } from ".";

describe("Given the logResponse function", () => {
  it("should log the response", () => {
    const consoleSpy = jest.spyOn(console, "info");
    const items = [{ id: "1", name: "Item 1", unit: "unit(s)", icon: "/assets/images/apple.png" }];

    logResponse(items);

    expect(consoleSpy).toHaveBeenCalledWith("Returning items", {
      count: 1,
      items: JSON.stringify(items),
    });
  });
});
