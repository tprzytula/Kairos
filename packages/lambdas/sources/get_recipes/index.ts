import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, DynamoDBIndex, query, filterPrivateItems } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId, userId } = event;

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

    const visibleItems = filterPrivateItems(items, userId ?? '');

    const recipes = visibleItems.map((item) => ({
      ...item,
      ingredients: JSON.parse(item.ingredients || "[]"),
      instructions: item.instructions ? JSON.parse(item.instructions) : undefined,
      mealTypes: item.mealTypes ? JSON.parse(item.mealTypes) : undefined,
      dishTypes: item.dishTypes ? JSON.parse(item.dishTypes) : undefined,
    }));

    return createResponse({
      statusCode: 200,
      message: recipes,
    });
  },
);
