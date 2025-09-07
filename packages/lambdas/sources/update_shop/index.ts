import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { DynamoDBTable, updateItem } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId } = event;
    
    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    const body = getBody(event.body);

    if (!body) {
      return createResponse({
        statusCode: 400,
      });
    }

    const { id, ...updatedFields } = body;

    const updateFieldsWithTimestamp = {
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    await updateItem({
      tableName: DynamoDBTable.SHOPS,
      key: { id },
      updatedFields: updateFieldsWithTimestamp,
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
