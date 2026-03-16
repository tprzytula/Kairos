import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { getBody } from "./body";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const body = getBody(event.body);

    if (!body) {
      return createResponse({
        statusCode: 400,
        message: "Invalid request body. 'name' is required.",
      });
    }

    const { name, icon, unit, category } = body;

    await putItem({
      tableName: DynamoDBTable.GROCERY_ITEMS_DEFAULTS,
      item: {
        name: name.trim(),
        ...(icon && { icon }),
        ...(unit && { unit }),
        ...(category && { category }),
      },
    });

    return createResponse({
      statusCode: 201,
      message: { name: name.trim() },
    });
  },
);
