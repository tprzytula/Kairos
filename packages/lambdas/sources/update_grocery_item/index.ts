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

    const { id, quantity } = body;

    await updateItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      key: { id },
      updatedFields: {
        quantity,
      },
    });
  
    return createResponse({
      statusCode: 200,
      message: {
        id,
        quantity,
      },
    });
  },
); 