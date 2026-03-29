import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, updateItem, getItem, verifyPrivateItemOwnership } from "@kairos-lambdas-libs/dynamodb";
import { getBody } from "./body";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId, userId } = event;

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

    const { id, ...updatedFields } = body;

    // Extract isPrivate and convert to visibility fields
    const { isPrivate, ...fieldsToUpdate } = updatedFields;
    let visibilityFields: Record<string, any> = {};
    if (isPrivate === true) {
      visibilityFields = { visibility: "private", ownerId: userId };
    } else if (isPrivate === false) {
      visibilityFields = { visibility: null, ownerId: null };
    }
    const finalFields = { ...fieldsToUpdate, ...visibilityFields };

    const existingItem = await getItem({
      tableName: DynamoDBTable.BIRTHDAYS,
      item: { id },
    });

    if (existingItem && !verifyPrivateItemOwnership(existingItem, userId ?? '')) {
      return createResponse({
        statusCode: 403,
        message: "You do not have permission to modify this item",
      });
    }

    await updateItem({
      tableName: DynamoDBTable.BIRTHDAYS,
      key: { id },
      updatedFields: finalFields,
    });

    return createResponse({
      statusCode: 200,
      message: { id, ...finalFields },
    });
  },
);
