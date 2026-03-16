import { IRequestBody } from "./types";

const validateBody = (body: IRequestBody) => {
  const hasAtLeastOneField =
    body.icon !== undefined ||
    body.unit !== undefined ||
    body.category !== undefined;

  if (!hasAtLeastOneField) {
    return false;
  }

  if (body.icon !== undefined && body.icon !== null) {
    if (typeof body.icon !== "string" || body.icon.trim().length === 0) {
      return false;
    }
  }

  if (body.unit !== undefined && body.unit !== null) {
    if (typeof body.unit !== "string" || body.unit.trim().length === 0) {
      return false;
    }
  }

  if (body.category !== undefined && body.category !== null) {
    if (typeof body.category !== "string" || body.category.trim().length === 0) {
      return false;
    }
  }

  return true;
};

export const getBody = (rawBody: string | null): IRequestBody | null => {
  if (!rawBody) {
    return null;
  }

  try {
    const body = JSON.parse(rawBody);

    if (!validateBody(body)) {
      return null;
    }

    return body;
  } catch {
    return null;
  }
};
