import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-2" });

const deleteItem = async (id: string) => {
  const command = new DeleteItemCommand({
    TableName: "items",
    Key: {
      id: {
        S: id,
      },
    },
  });

  return await client.send(command);
};

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  console.info("Event received", event);

  const { id } = event.pathParameters ?? {};

  try {
    await deleteItem(id as string);

    return {
      body: "OK",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 200,
    };
  } catch (error) {
    console.log("Encountered error:", error);

    return { body: "Internal Server Error", statusCode: 500 };
  }
};
