import { APIGatewayProxyEvent, Handler } from "aws-lambda"
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware"
import { createResponse } from "@kairos-lambdas-libs/response"
import { DynamoDBTable, deleteItems, getItem, verifyPrivateItemOwnership } from "@kairos-lambdas-libs/dynamodb"

export const createBatchDeleteHandler = (
  tableName: DynamoDBTable,
): Handler<APIGatewayProxyEvent> =>
  middleware(async (event: AuthenticatedEvent) => {
    const { projectId, userId } = event

    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      })
    }

    if (!event.body) {
      return createResponse({
        statusCode: 400,
      })
    }

    const { ids } = JSON.parse(event.body)

    if (!ids || !Array.isArray(ids)) {
      return createResponse({
        statusCode: 400,
      })
    }

    for (const id of ids) {
      const existingItem = await getItem({
        tableName,
        item: { id },
      })

      if (existingItem && !verifyPrivateItemOwnership(existingItem, userId ?? '')) {
        return createResponse({
          statusCode: 403,
          message: "You do not have permission to modify this item",
        })
      }
    }

    await deleteItems({
      ids,
      tableName,
    })

    return createResponse({
      statusCode: 200,
    })
  })
