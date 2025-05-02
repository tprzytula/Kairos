export const getUpdateExpression = (fields: Record<string, string | boolean>) => 
  `set ${Object.keys(fields).map(k => `${k} = :${k}`).join(', ')}`;

export const getExpressionAttributeValues = (fields: Record<string, string | boolean>) => 
  Object.fromEntries(Object.entries(fields).map(([k, v]) => [`:${k}`, v]));
