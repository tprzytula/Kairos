type FieldValue = string | boolean | null;

export const getUpdateExpression = (fields: Record<string, FieldValue>) => {
  const setFields = Object.keys(fields).filter(k => fields[k] !== null);
  const removeFields = Object.keys(fields).filter(k => fields[k] === null);

  const parts: string[] = [];
  if (setFields.length > 0) {
    parts.push(`set ${setFields.map(k => `#${k} = :${k}`).join(', ')}`);
  }
  if (removeFields.length > 0) {
    parts.push(`remove ${removeFields.map(k => `#${k}`).join(', ')}`);
  }
  return parts.join(' ');
};

export const getExpressionAttributeNames = (fields: Record<string, FieldValue>) =>
  Object.fromEntries(Object.keys(fields).map(k => [`#${k}`, k]));

export const getExpressionAttributeValues = (fields: Record<string, FieldValue>) => {
  const nonNullEntries = Object.entries(fields).filter(([, v]) => v !== null);
  return Object.fromEntries(nonNullEntries.map(([k, v]) => [`:${k}`, v]));
};
