import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";
import { getBody } from "./body";
import { BirthdayItem, CreateBirthdayResponse } from "./types";

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
      return createResponse({ statusCode: 400 });
    }

    const { name, month, day, birthYear, notes } = body;
    const id = randomUUID();

    const birthdayItem: BirthdayItem = {
      id,
      projectId,
      name,
      month,
      day,
      ...(birthYear !== undefined && { birthYear }),
      ...(notes !== undefined && { notes }),
    };

    await putItem({
      tableName: DynamoDBTable.BIRTHDAYS,
      item: birthdayItem,
    });

    const response: CreateBirthdayResponse = { id };

    return createResponse({
      statusCode: 201,
      message: response,
    });
  },
);
