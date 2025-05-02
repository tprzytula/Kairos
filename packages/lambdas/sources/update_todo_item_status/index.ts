import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { DynamoDBTable, updateItem } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    const { id } = event.pathParameters ?? {};
    const { isDone } = getBody(event.body) ?? {};

    if (!id || typeof isDone !== 'boolean') {
      return createResponse({
        statusCode: 400,
      });
    }

    await updateItem({
      tableName: DynamoDBTable.TODO_LIST,
      key: {
        id,
      },
      updatedFields: {
        isDone,
      },
    });
  
    return createResponse({
      statusCode: 200,
      message: {
        id,
      },
    });
  },
);
