import { IRequestBody } from "./types";

const validateBody = (body: IRequestBody) => {
  console.debug('Validating body', body);
  if (typeof body.isDone !== 'boolean') {
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
    console.error('Failed to parse body:', error);
  }

  return null;
};
