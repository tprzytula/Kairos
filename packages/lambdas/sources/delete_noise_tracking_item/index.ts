import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, deleteItem } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    const { timestamp } = event.pathParameters ?? {};

    if (!timestamp) {
      return createResponse({
        statusCode: 400,
      });
    }

    await deleteItem({
      key: {
        timestamp: parseInt(timestamp, 10),
      },
      tableName: DynamoDBTable.NOISE_TRACKING,
    });

    return createResponse({
      statusCode: 200,
    });
  },
);
