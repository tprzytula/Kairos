import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { upsertItem, queryProjectItems } from "./database";
import { getBody } from "./body";
import { GroceryItemUnit } from "@kairos-lambdas-libs/dynamodb/enums";
import { fetchDefaults, getCategoryForItem } from "./utils";

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

    const [projectItems, defaults] = await Promise.all([
      queryProjectItems(projectId),
      fetchDefaults(),
    ]);

    const results = [];
    let hasUpdates = false;

    for (const item of body.items) {
      const category = getCategoryForItem(item.name, defaults);

      const { id, statusCode } = await upsertItem({
        projectId,
        shopId: item.shopId,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit as GroceryItemUnit,
        imagePath: item.imagePath,
        category,
      }, projectItems);

      if (statusCode === 200) {
        hasUpdates = true;
      }

      results.push({ id });
    }

    return createResponse({
      statusCode: hasUpdates ? 200 : 201,
      message: {
        items: results,
      },
    });
  },
);
