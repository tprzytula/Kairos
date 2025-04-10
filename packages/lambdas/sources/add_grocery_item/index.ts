import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTables, putItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    if (!event.body) {
      return createResponse({
        statusCode: 400,
      });
    }

    const id = randomUUID();
    const { name, quantity } = JSON.parse(event.body);

    await putItem({
      tableName: DynamoDBTables.GROCERY_LIST,
      item: {
        id: { S: id },
        name: { S: name },
        quantity: { N: `${quantity}` },
      },
    });

    return createResponse({
      statusCode: 201,
      message: {
        id,
      },
    });
  },
);
