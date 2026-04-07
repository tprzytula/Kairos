import { createAddHandler } from "@kairos-lambdas-libs/handler-factories";
import { getBody } from "./body";
import { createAdventure } from "./database";
import { IRequestBody } from "./body/types";

export const handler = createAddHandler<IRequestBody>({
  getBody,
  create: createAdventure,
});
