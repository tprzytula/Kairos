import { APIGatewayProxyEvent, Handler } from "aws-lambda"
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware"
import { createResponse } from "@kairos-lambdas-libs/response"
import { DynamoDBTable, getItem, verifyPrivateItemOwnership } from "@kairos-lambdas-libs/dynamodb"

interface CreateUpdateHandlerConfig<TBody extends { id: string }> {
  tableName: DynamoDBTable
  getBody: (body: string | null) => TBody | null
  update: (id: string, fields: Omit<TBody, 'id'> & { userId?: string }) => Promise<void>
}

export const createUpdateHandler = <TBody extends { id: string }>(
  config: CreateUpdateHandlerConfig<TBody>,
): Handler<APIGatewayProxyEvent> =>
  middleware(async (event: AuthenticatedEvent) => {
    const { projectId, userId } = event

    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      })
    }

    const body = config.getBody(event.body)

    if (!body) {
      return createResponse({
        statusCode: 400,
      })
    }

    const { id, ...fields } = body

    const existingItem = await getItem({
      tableName: config.tableName,
      item: { id },
    })

    if (existingItem && !verifyPrivateItemOwnership(existingItem, userId ?? '')) {
      return createResponse({
        statusCode: 403,
        message: "You do not have permission to modify this item",
      })
    }

    await config.update(id, { ...fields, userId } as Omit<TBody, 'id'> & { userId?: string })

    return createResponse({
      statusCode: 200,
      message: { id },
    })
  })
