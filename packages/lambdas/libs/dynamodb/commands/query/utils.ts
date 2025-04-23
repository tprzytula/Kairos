export const getKeyConditionExpression = (attributes: Record<string, string>): string =>
  Object.keys(attributes)
    .map((key) => `#${key} = :${key}`)
    .join(" AND ");

export const getExpressionAttributeValues = (attributes: Record<string, string>): Record<string, string> =>
  Object.entries(attributes).reduce(
    (acc, [key, value]) => ({ ...acc, [`:${key}`]: value }),
    {}
  );

export const getExpressionAttributeNames = (attributes: Record<string, string>): Record<string, string> =>
  Object.keys(attributes).reduce(
    (acc, key) => ({ ...acc, [`#${key}`]: key }),
    {}
  );
