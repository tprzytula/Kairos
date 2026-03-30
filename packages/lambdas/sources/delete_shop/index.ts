import { createDeleteHandler } from "@kairos-lambdas-libs/handler-factories"
import { DynamoDBTable } from "@kairos-lambdas-libs/dynamodb"

export const handler = createDeleteHandler(DynamoDBTable.SHOPS)
