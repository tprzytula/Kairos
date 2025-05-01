import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { parseItems } from "./parser";
import { middleware } from "../../libs/middleware";
import { getItems } from "./database/index";
import { createResponse } from "@kairos-lambdas-libs/response";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async () => {
    const items = await getItems();
    const parsedItems = parseItems(items);

    console.info("Returning items", JSON.stringify(parsedItems));

    return createResponse({
      statusCode: 200,
      message: parsedItems,
    });
  },
);
