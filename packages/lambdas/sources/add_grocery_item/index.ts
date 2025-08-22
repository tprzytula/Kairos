import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { upsertItem } from "./database";
import { getBody } from "./body";
import { GroceryItemUnit } from "@kairos-lambdas-libs/dynamodb/enums";
import { getCategoryForItem } from "./utils";

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

    const { name, quantity, unit, imagePath } = body; 
    
    const category = await getCategoryForItem(name);
    
    const { id, statusCode } = await upsertItem({
      projectId,
      name,
      quantity,
      unit: unit as GroceryItemUnit,
      imagePath,
      category,
    });

    return createResponse({
      statusCode,
      message: {
        id,
      },
    });
  },
);
