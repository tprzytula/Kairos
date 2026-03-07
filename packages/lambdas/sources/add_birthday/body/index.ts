import { IRequestBody } from "./types";

const validateBody = (body: IRequestBody) => {
  if (!body.name) {
    return false;
  }
  if (typeof body.month !== "number" || body.month < 1 || body.month > 12) {
    return false;
  }
  if (typeof body.day !== "number" || body.day < 1 || body.day > 31) {
    return false;
  }
  return true;
};

export const getBody = (body: string | null): IRequestBody | null => {
  if (!body) {
    return null;
  }

  try {
    const parsedBody = JSON.parse(body);
    const isValid = validateBody(parsedBody);

    if (isValid) {
      return parsedBody;
    }
  } catch (error) {
    console.error("Failed to parse body:", error);
  }

  return null;
};
