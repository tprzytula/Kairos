import { createListHandler } from "@kairos-lambdas-libs/handler-factories"
import { DynamoDBTable, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb"

export const handler = createListHandler(DynamoDBTable.BIRTHDAYS, DynamoDBIndex.BIRTHDAYS_PROJECT)
