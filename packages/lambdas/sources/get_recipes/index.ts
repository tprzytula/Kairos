import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, DynamoDBIndex, query } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId } = event;

    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    const items = await query({
      tableName: DynamoDBTable.RECIPES,
      indexName: DynamoDBIndex.RECIPES_PROJECT,
      attributes: { projectId },
    });

    const recipes = items.map((item) => ({
      ...item,
      ingredients: JSON.parse(item.ingredients || "[]"),
    }));

    return createResponse({
      statusCode: 200,
      message: recipes,
    });
  },
);
