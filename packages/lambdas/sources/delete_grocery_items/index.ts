import { createBatchDeleteHandler } from "@kairos-lambdas-libs/handler-factories"
import { DynamoDBTable } from "@kairos-lambdas-libs/dynamodb"

export const handler = createBatchDeleteHandler(DynamoDBTable.GROCERY_LIST)
