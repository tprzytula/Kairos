import { handler } from ".";
import { getBody } from "./body";
import { updateItem, getItem } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable, GroceryItemUnit } from "@kairos-lambdas-libs/dynamodb";

vi.mock("./body");
vi.mock("@kairos-lambdas-libs/dynamodb");

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 403 when user does not own the item", async () => {
    vi.mocked(getBody).mockReturnValue(EXAMPLE_BODY);
    vi.mocked(getItem).mockResolvedValueOnce({ visibility: "private", ownerId: "other-user" });

    const result = await runHandler({ body: JSON.stringify(EXAMPLE_BODY) }, true);

    expect(result.statusCode).toBe(403);
  });

  it("should require project ID", async () => {
    const result = await runHandler({ body: null });

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("Project ID is required");
  });

  describe("When the body is invalid", () => {
    it("should return status 400", async () => {
      vi.mocked(getBody).mockReturnValue(null);

      const result = await runHandler({ body: null }, true);

      expect(result.statusCode).toBe(400);
    });
  });

  describe("When the body is valid", () => {
    it("should update the item in the grocery list table with quantity only", async () => {
      vi.mocked(getBody).mockReturnValue(EXAMPLE_BODY);

      await runHandler({ body: JSON.stringify(EXAMPLE_BODY) }, true);

      expect(vi.mocked(updateItem)).toHaveBeenCalledWith({
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
      
      vi.mocked(getBody).mockReturnValue(multiFieldBody);

      await runHandler({ body: JSON.stringify(multiFieldBody) }, true);

      expect(vi.mocked(updateItem)).toHaveBeenCalledWith({
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
      
      vi.mocked(getBody).mockReturnValue(nameOnlyBody);

      await runHandler({ body: JSON.stringify(nameOnlyBody) }, true);

      expect(vi.mocked(updateItem)).toHaveBeenCalledWith({
        tableName: DynamoDBTable.GROCERY_LIST,
        key: { id: "test-id" },
        updatedFields: {
          name: "New Name",
        },
      });
    });

    it("should set visibility to private when isPrivate is true", async () => {
      const isPrivateBody = { id: "test-id", name: "Item", isPrivate: true };
      vi.mocked(getBody).mockReturnValue(isPrivateBody);

      await runHandler({ body: JSON.stringify(isPrivateBody) }, true);

      expect(vi.mocked(updateItem)).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedFields: expect.objectContaining({
            visibility: "private",
          }),
        }),
      );
    });

    it("should clear visibility when isPrivate is false", async () => {
      const isPrivateBody = { id: "test-id", name: "Item", isPrivate: false };
      vi.mocked(getBody).mockReturnValue(isPrivateBody);

      await runHandler({ body: JSON.stringify(isPrivateBody) }, true);

      expect(vi.mocked(updateItem)).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedFields: expect.objectContaining({
            visibility: null,
            ownerId: null,
          }),
        }),
      );
    });

    describe("And the update succeeds", () => {
      it("should return status 200 with the updated item", async () => {
        vi.mocked(getBody).mockReturnValue(EXAMPLE_BODY);
        vi.mocked(updateItem).mockResolvedValue({
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
        vi.mocked(getBody).mockReturnValue(EXAMPLE_BODY);
        vi.mocked(updateItem).mockRejectedValue(new Error("Update failed"));

        const result = await runHandler({ body: JSON.stringify(EXAMPLE_BODY) }, true);

        expect(result.statusCode).toBe(500);
      });
    });
  });
}); 