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

    console.info("odd", DynamoDBTables.GROCERY_LIST);
    console.info("odd", JSON.stringify({
      tableName: DynamoDBTables.GROCERY_LIST,
      item: {
        id,
        name,
        quantity,
      },
    }));

    await putItem({
      tableName: DynamoDBTables.GROCERY_LIST,
      item: {
        id,
        name,
        quantity,
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
