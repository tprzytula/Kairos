import { handler } from ".";
import { getBody } from "./body";
import { updateItem } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable, GroceryItemUnit } from "@kairos-lambdas-libs/dynamodb";

jest.mock("./body");
jest.mock("@kairos-lambdas-libs/dynamodb");

describe("Given the update_grocery_item lambda handler", () => {
  const runHandler = (event: any, includeProjectId: boolean = false) => {
    if (includeProjectId) {
      event.headers = { "X-Project-ID": "test-project" };
    }
    return handler(event, {} as any, {} as any);
  };

  const EXAMPLE_BODY = {
    id: "test-id",
    quantity: "5",
  };

  it("should require project ID", async () => {
    const result = await runHandler({ body: null });

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("Project ID is required");
  });

  describe("When the body is invalid", () => {
    it("should return status 400", async () => {
      jest.mocked(getBody).mockReturnValue(null);

      const result = await runHandler({ body: null }, true);

      expect(result.statusCode).toBe(400);
    });
  });

  describe("When the body is valid", () => {
    it("should update the item in the grocery list table with quantity only", async () => {
      jest.mocked(getBody).mockReturnValue(EXAMPLE_BODY);

      await runHandler({ body: JSON.stringify(EXAMPLE_BODY) }, true);

      expect(jest.mocked(updateItem)).toHaveBeenCalledWith({
        tableName: DynamoDBTable.GROCERY_LIST,
        key: { id: "test-id" },
        updatedFields: {
          quantity: "5",
        },
      });
    });

    it("should update the item with multiple fields", async () => {
      const multiFieldBody = {
        id: "test-id",
        quantity: "3",
        name: "Updated Item",
        unit: GroceryItemUnit.KILOGRAM,
        imagePath: "/updated.png",
      };
      
      jest.mocked(getBody).mockReturnValue(multiFieldBody);

      await runHandler({ body: JSON.stringify(multiFieldBody) }, true);

      expect(jest.mocked(updateItem)).toHaveBeenCalledWith({
        tableName: DynamoDBTable.GROCERY_LIST,
        key: { id: "test-id" },
        updatedFields: {
          quantity: "3",
          name: "Updated Item",
          unit: GroceryItemUnit.KILOGRAM,
          imagePath: "/updated.png",
        },
      });
    });

    it("should update the item with only name", async () => {
      const nameOnlyBody = {
        id: "test-id",
        name: "New Name",
      };
      
      jest.mocked(getBody).mockReturnValue(nameOnlyBody);

      await runHandler({ body: JSON.stringify(nameOnlyBody) }, true);

      expect(jest.mocked(updateItem)).toHaveBeenCalledWith({
        tableName: DynamoDBTable.GROCERY_LIST,
        key: { id: "test-id" },
        updatedFields: {
          name: "New Name",
        },
      });
    });

    describe("And the update succeeds", () => {
      it("should return status 200 with the updated item", async () => {
        jest.mocked(getBody).mockReturnValue(EXAMPLE_BODY);
        jest.mocked(updateItem).mockResolvedValue({
          $metadata: {
            httpStatusCode: 200,
          },
        });

        const result = await runHandler({ body: JSON.stringify(EXAMPLE_BODY) }, true);

        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify({
          id: "test-id",
          quantity: "5",
        }));
      });
    });

    describe("And the update fails", () => {
      it("should return status 500", async () => {
        jest.mocked(getBody).mockReturnValue(EXAMPLE_BODY);
        jest.mocked(updateItem).mockRejectedValue(new Error("Update failed"));

        const result = await runHandler({ body: JSON.stringify(EXAMPLE_BODY) }, true);

        expect(result.statusCode).toBe(500);
      });
    });
  });
}); 