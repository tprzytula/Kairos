import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { parseItems } from "./parser";
import { middleware } from "../../libs/middleware";
import { getItems } from "./database/index";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    console.info("Event received", JSON.stringify(event));

    const items = await getItems();
    const parsedItems = parseItems(items);

    console.info("Returning items", JSON.stringify(parsedItems));

    return {
      statusCode: 200,
      body: JSON.stringify(parsedItems),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  },
);
