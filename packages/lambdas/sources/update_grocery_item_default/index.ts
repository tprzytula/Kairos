import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { DynamoDBTable, updateItem } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { name } = event.pathParameters ?? {};

    if (!name || typeof name !== "string") {
      return createResponse({
        statusCode: 400,
      });
    }

    const body = getBody(event.body);

    if (!body) {
      return createResponse({
        statusCode: 400,
      });
    }

    await updateItem({
      tableName: DynamoDBTable.GROCERY_ITEMS_DEFAULTS,
      key: { name },
      updatedFields: body,
    });

    return createResponse({
      statusCode: 200,
      message: {
        name,
        ...body,
      },
    });
  },
);
