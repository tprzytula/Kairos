export const getKeyConditionExpression = (attributes: Record<string, string>): string =>
  Object.keys(attributes)
    .map((key) => `${key} = :${key}`)
    .join(" AND ");

export const getExpressionAttributeValues = (attributes: Record<string, string>): Record<string, string> =>
  Object.entries(attributes).reduce(
    (acc, [key, value]) => ({ ...acc, [`:${key}`]: value }),
    {}
  );
