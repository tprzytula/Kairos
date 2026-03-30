import { createListHandler } from "@kairos-lambdas-libs/handler-factories"
import { DynamoDBTable, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb"

export const handler = createListHandler(DynamoDBTable.MEAL_PLANS, DynamoDBIndex.MEAL_PLANS_PROJECT)
