import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async () => {
    const timestamp = Date.now();


    await putItem({
      tableName: DynamoDBTable.NOISE_TRACKING,
      item: {
        timestamp,
      },
    });

    return createResponse({
      statusCode: 201,
    });
  },
);
