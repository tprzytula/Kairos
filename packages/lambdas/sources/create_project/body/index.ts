import { ICreateProjectRequestBody } from "./types";

const validateBody = (body: ICreateProjectRequestBody) => {
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return false;
  }

  if (body.name.trim().length > 50) {
    return false;
  }

  if (body.isPersonal !== undefined && typeof body.isPersonal !== 'boolean') {
    return false;
  }

  return true;
};

export const getBody = (body: string | null): ICreateProjectRequestBody | null => {
  if (!body) {
    return null;
  } 

  try {
    const parsedBody = JSON.parse(body);
    const isValid = validateBody(parsedBody);

    if (isValid) {
      return {
        name: parsedBody.name.trim(),
        isPersonal: parsedBody.isPersonal || false,
      };
    }
  } catch (error) {
    console.error('Failed to parse body:', error);
  }

  return null;
};
