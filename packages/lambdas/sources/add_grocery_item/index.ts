import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { upsertItem } from "./database";
import { getBody } from "./body";
import { GroceryItemUnit } from "@kairos-lambdas-libs/dynamodb/enums";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    const body = getBody(event.body);

    if (!body) {
      return createResponse({
        statusCode: 400,
      });
    }

    const { name, quantity, unit, imagePath } = body; 
    const { id, statusCode } = await upsertItem({
      name,
      quantity,
      unit: unit as GroceryItemUnit,
      imagePath,
    });

    return createResponse({
      statusCode,
      message: {
        id,
      },
    });
  },
);
