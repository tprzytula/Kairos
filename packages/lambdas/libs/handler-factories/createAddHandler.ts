import { APIGatewayProxyEvent, Handler } from "aws-lambda"
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware"
import { createResponse } from "@kairos-lambdas-libs/response"

interface CreateAddHandlerConfig<TBody> {
  getBody: (body: string | null) => TBody | null
  create: (params: TBody & { projectId: string; userId?: string }) => Promise<string>
}

export const createAddHandler = <TBody extends Record<string, unknown>>(
  config: CreateAddHandlerConfig<TBody>,
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

    const id = await config.create({ ...body, projectId, userId })

    return createResponse({
      statusCode: 201,
      message: { id },
    })
  })
