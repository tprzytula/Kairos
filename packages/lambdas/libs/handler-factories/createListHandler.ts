import { APIGatewayProxyEvent, Handler } from "aws-lambda"
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware"
import { createResponse } from "@kairos-lambdas-libs/response"
import { DynamoDBTable, DynamoDBIndex, query, filterPrivateItems } from "@kairos-lambdas-libs/dynamodb"

export const createListHandler = (
  tableName: DynamoDBTable,
  indexName: DynamoDBIndex,
): Handler<APIGatewayProxyEvent> =>
  middleware(async (event: AuthenticatedEvent) => {
    const { projectId, userId } = event

    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      })
    }

    const items = await query({
      tableName,
      indexName,
      attributes: { projectId },
    })

    const visibleItems = filterPrivateItems(items, userId ?? '')

    return createResponse({
      statusCode: 200,
      message: visibleItems,
    })
  })
