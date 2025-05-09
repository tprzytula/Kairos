import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { DynamoDBTable, updateItems } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    const { items } = getBody(event.body) ?? {};

    if (!items) {
      return createResponse({
        statusCode: 400,
      });
    }

    await updateItems({
      tableName: DynamoDBTable.TODO_LIST,
      items: items.map(({ id, isDone }) => ({
        id,
        fieldsToUpdate: {
          isDone,
        },
      })),
    });
  
    return createResponse({
      statusCode: 200,
      message: {
        items,
      },
    });
  },
);
