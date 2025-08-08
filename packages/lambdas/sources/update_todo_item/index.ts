import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { DynamoDBTable, updateItem } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    const body = getBody(event.body);

    if (!body) {
      return createResponse({
        statusCode: 400,
      });
    }

    const { id, ...updatedFields } = body;

    await updateItem({
      tableName: DynamoDBTable.TODO_LIST,
      key: { id },
      updatedFields,
    });
  
    return createResponse({
      statusCode: 200,
      message: {
        id,
        ...updatedFields,
      },
    });
  },
);