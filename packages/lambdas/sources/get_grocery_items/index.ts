import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, DynamoDBIndex, query, filterPrivateItems } from "@kairos-lambdas-libs/dynamodb";
import { logResponse, sortItems } from "./utils";

export const handler: Handler<APIGatewayProxyEvent> = middleware(async (event: AuthenticatedEvent) => {
  const { projectId, userId } = event;
  
  if (!projectId) {
    return createResponse({
      statusCode: 400,
      message: "Project ID is required",
    });
  }

  const { shopId } = event.queryStringParameters ?? {};

  const items = await query({
    tableName: DynamoDBTable.GROCERY_LIST,
    indexName: DynamoDBIndex.GROCERY_LIST_PROJECT,
    attributes: {
      projectId,
    },
  });

  const visibleItems = filterPrivateItems(items, userId ?? '');
  let filteredItems = visibleItems;
  if (shopId) {
    filteredItems = visibleItems.filter(item => item.shopId === shopId);
  }

  const sortedItems = sortItems(filteredItems);

  logResponse(sortedItems);

  return createResponse({
    statusCode: 200,
    message: sortedItems,
  });
});
