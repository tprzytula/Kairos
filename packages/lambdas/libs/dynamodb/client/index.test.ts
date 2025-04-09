import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

jest.mock('@aws-sdk/client-dynamodb');

describe('Given the client', () => {
  it('should be created', async () => {
    const { client } = await import('.');

    expect(DynamoDBClient).toHaveBeenCalledWith({ region: "eu-west-2" });
    expect(client).toBeDefined();
  });
});
