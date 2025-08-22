import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";

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

    const { name, description, dueDate } = body; 
    const id = randomUUID();

    await putItem({
      tableName: DynamoDBTable.TODO_LIST,
      item: {
        id,
        projectId,
        name,
        description,
        dueDate,
        isDone: false,
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
