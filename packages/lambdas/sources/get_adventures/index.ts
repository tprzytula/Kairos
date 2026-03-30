import { createListHandler } from "@kairos-lambdas-libs/handler-factories"
import { DynamoDBTable, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb"

export const handler = createListHandler(DynamoDBTable.ADVENTURES, DynamoDBIndex.ADVENTURES_PROJECT)
