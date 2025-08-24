import { IRequestBody } from "./types";
import { validateBody } from "./validate";

export const getBody = (bodyAsString: string | null): IRequestBody | null => {
  try {
    if (!bodyAsString) {
      return null;
    }

    const body = JSON.parse(bodyAsString);
    
    const isValid = validateBody(body);
    if (!isValid) {
      return null;
    }

    return {
      endpoint: body.endpoint,
      keys: body.keys,
    };
  } catch {
    return null;
  }
};
