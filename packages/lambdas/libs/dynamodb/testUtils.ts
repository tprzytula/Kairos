import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import * as Client from './client'

export const createMockDocumentClient = (
  sendResponse: unknown = 'send response',
): DynamoDBDocumentClient => {
  const mockClient = {
    send: vi.fn().mockResolvedValue(sendResponse),
  } as unknown as DynamoDBDocumentClient

  vi.spyOn(Client, "getDocumentClient").mockReturnValue(mockClient)

  return mockClient
}
