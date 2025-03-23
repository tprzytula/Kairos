import { randomUUID } from "crypto";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-2" });

const addItemDynamoDB = async ({ name, quantity }) => {
  const id = randomUUID();
  const command = new PutItemCommand({
    TableName: "items",
    Item: {
      id: { S: id },
      name: { S: name },
      quantity: { N: `${quantity}` },
    },
  });

  await client.send(command);

  return {
    id,
    name,
    quantity,
  };
};

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  console.info("Event received", event);

  const { name, quantity } = JSON.parse(event.body as any);

  console.info("Adding name: ", name, "quantity:", quantity);

  try {
    const addedItem = await addItemDynamoDB({
      name,
      quantity,
    });

    return {
      statusCode: 201,
      body: JSON.stringify(addedItem),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.log("Encountered error:", error);

    return {
      body: "Internal Server Error",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 500,
    };
  }
};
