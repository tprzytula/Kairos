import { DynamoDBTable } from "@kairos-lambdas-libs/dynamodb";
import { createUpdateHandler } from "@kairos-lambdas-libs/handler-factories";
import { getBody } from "./body";
import { updateAdventure } from "./database";
import { IRequestBody } from "./body/types";

export const handler = createUpdateHandler<IRequestBody>({
  tableName: DynamoDBTable.ADVENTURES,
  getBody,
  update: updateAdventure,
});
