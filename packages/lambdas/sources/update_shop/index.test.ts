import { handler } from "./index";
import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";
import * as body from "./body";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    updateItem: jest.fn(),
}));

jest.mock("./body");

const { DynamoDBTable } = DynamoDB;

describe("Given the update_shop lambda handler", () => {
  const runHandler = (event: any, includeProjectId: boolean = false) =>
    handler(
      includeProjectId ? { ...event, headers: { "X-Project-ID": "test-project" } } : event,
      {} as any,
      {} as any,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When the project ID is missing", () => {
    it("should return status code 400", async () => {
      const result = await runHandler({});

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe("Project ID is required");
    });
  });

  describe("When the body is invalid", () => {
    it("should return status code 400", async () => {
      jest.mocked(body.getBody).mockReturnValue(null);

      const result = await runHandler({ body: null }, true);

      expect(result.statusCode).toBe(400);
    });
  });

  describe("When the body is valid", () => {
    it("should update the shop in the shops table with name only", async () => {
      const updateBody = { id: "test-id", name: "Updated Shop" };
      jest.mocked(body.getBody).mockReturnValue(updateBody);

      await runHandler({ body: JSON.stringify(updateBody) }, true);

      expect(jest.mocked(DynamoDB.updateItem)).toHaveBeenCalledWith({
        tableName: DynamoDBTable.SHOPS,
        key: { id: "test-id" },
        updatedFields: {
          name: "Updated Shop",
          updatedAt: expect.any(String),
        },
      });
    });

    it("should update the shop with multiple fields", async () => {
      const updateBody = {
        id: "test-id",
        name: "Updated Shop",
        icon: "/assets/icons/updated.png",
      };
      
      jest.mocked(body.getBody).mockReturnValue(updateBody);

      await runHandler({ body: JSON.stringify(updateBody) }, true);

      expect(jest.mocked(DynamoDB.updateItem)).toHaveBeenCalledWith({
        tableName: DynamoDBTable.SHOPS,
        key: { id: "test-id" },
        updatedFields: {
          name: "Updated Shop",
          icon: "/assets/icons/updated.png",
          updatedAt: expect.any(String),
        },
      });
    });

    describe("And the update succeeds", () => {
      it("should return status code 200 with the updated fields", async () => {
        const updateBody = { id: "test-id", name: "Updated Shop" };
        jest.mocked(body.getBody).mockReturnValue(updateBody);

        const result = await runHandler({ body: JSON.stringify(updateBody) }, true);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify({ id: "test-id", name: "Updated Shop" }));
      });
    });

    describe("And the update fails", () => {
      it("should return status code 500", async () => {
        const updateBody = { id: "test-id", name: "Updated Shop" };
        jest.mocked(body.getBody).mockReturnValue(updateBody);
        jest.mocked(DynamoDB.updateItem).mockRejectedValue(new Error("Update failed"));

        const result = await runHandler({ body: JSON.stringify(updateBody) }, true);

        expect(result).toEqual({
          body: "Internal Server Error",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
          statusCode: 500,
        });
      });
    });
  });
});
