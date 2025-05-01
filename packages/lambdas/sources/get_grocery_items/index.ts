import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-2" });

const getItems = async () => {
  const command = new ScanCommand({
    TableName: "grocery_list",
  });

  const { Items } = (await client.send(command)) ?? {};

  return Items;
};

const parseItems = (Items) => {
  return Items.map(({ quantity, id, name }) => ({
    quantity: parseInt(quantity.N, 10),
    id: id.S,
    name: name.S,
  }));
};

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  console.info("Event received", event);

  try {
    const items = (await getItems()) ?? [];
    const parsedItems = parseItems(items);

    console.info("Returning items", parsedItems);

    return {
      statusCode: 200,
      body: JSON.stringify(parsedItems),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.log("Encountered error:", error);

    return { body: "Internal Server Error", statusCode: 500 };
  }
};
