import { handler } from ".";
import { getBody } from "./body";
import { updateItem } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable } from "@kairos-lambdas-libs/dynamodb";

jest.mock("./body");
jest.mock("@kairos-lambdas-libs/dynamodb");

describe("Given the update_todo_item lambda handler", () => {
  const runHandler = (event: any) => 
    handler(event, {} as any, {} as any);

  const EXAMPLE_BODY = {
    id: "test-id",
    name: "Updated Todo",
  };

  describe("When the body is invalid", () => {
    it("should return status 400", async () => {
      jest.mocked(getBody).mockReturnValue(null);

      const result = await runHandler({ body: null });

      expect(result.statusCode).toBe(400);
    });
  });

  describe("When the body is valid", () => {
    it("should update the item in the todo list table with name only", async () => {
      jest.mocked(getBody).mockReturnValue(EXAMPLE_BODY);

      await runHandler({ body: JSON.stringify(EXAMPLE_BODY) });

      expect(jest.mocked(updateItem)).toHaveBeenCalledWith({
        tableName: DynamoDBTable.TODO_LIST,
        key: { id: "test-id" },
        updatedFields: {
          name: "Updated Todo",
        },
      });
    });

    it("should update the item with multiple fields", async () => {
      const multiFieldBody = {
        id: "test-id",
        name: "Updated Todo",
        description: "Updated description",
        dueDate: 1234567890,
        isDone: true,
      };
      
      jest.mocked(getBody).mockReturnValue(multiFieldBody);

      await runHandler({ body: JSON.stringify(multiFieldBody) });

      expect(jest.mocked(updateItem)).toHaveBeenCalledWith({
        tableName: DynamoDBTable.TODO_LIST,
        key: { id: "test-id" },
        updatedFields: {
          name: "Updated Todo",
          description: "Updated description",
          dueDate: 1234567890,
          isDone: true,
        },
      });
    });

    it("should update the item with only isDone", async () => {
      const isDoneOnlyBody = {
        id: "test-id",
        isDone: false,
      };
      
      jest.mocked(getBody).mockReturnValue(isDoneOnlyBody);

      await runHandler({ body: JSON.stringify(isDoneOnlyBody) });

      expect(jest.mocked(updateItem)).toHaveBeenCalledWith({
        tableName: DynamoDBTable.TODO_LIST,
        key: { id: "test-id" },
        updatedFields: {
          isDone: false,
        },
      });
    });

    it("should update the item with only description", async () => {
      const descriptionOnlyBody = {
        id: "test-id",
        description: "New description",
      };
      
      jest.mocked(getBody).mockReturnValue(descriptionOnlyBody);

      await runHandler({ body: JSON.stringify(descriptionOnlyBody) });

      expect(jest.mocked(updateItem)).toHaveBeenCalledWith({
        tableName: DynamoDBTable.TODO_LIST,
        key: { id: "test-id" },
        updatedFields: {
          description: "New description",
        },
      });
    });

    it("should update the item with only dueDate", async () => {
      const dueDateOnlyBody = {
        id: "test-id",
        dueDate: 1234567890,
      };
      
      jest.mocked(getBody).mockReturnValue(dueDateOnlyBody);

      await runHandler({ body: JSON.stringify(dueDateOnlyBody) });

      expect(jest.mocked(updateItem)).toHaveBeenCalledWith({
        tableName: DynamoDBTable.TODO_LIST,
        key: { id: "test-id" },
        updatedFields: {
          dueDate: 1234567890,
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

        const result = await runHandler({ body: JSON.stringify(EXAMPLE_BODY) });

        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify({
          id: "test-id",
          name: "Updated Todo",
        }));
      });
    });

    describe("And the update fails", () => {
      it("should return status 500", async () => {
        jest.mocked(getBody).mockReturnValue(EXAMPLE_BODY);
        jest.mocked(updateItem).mockRejectedValue(new Error("Update failed"));

        const result = await runHandler({ body: JSON.stringify(EXAMPLE_BODY) });

        expect(result.statusCode).toBe(500);
      });
    });
  });
});