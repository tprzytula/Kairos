export type KeyOperator = "=" | "<" | ">" | "<=" | ">=" | "begins_with" | "BETWEEN";

export interface AttributeValue {
  value: string;
  operator?: KeyOperator;
  valueBetweenEnd?: string;
}

type AttributeInput = string | AttributeValue;

const normalizeAttribute = (input: AttributeInput): AttributeValue => {
  if (typeof input === "string") {
    return { value: input, operator: "=" };
  }
  return { ...input, operator: input.operator ?? "=" };
};

const buildCondition = (key: string, attr: AttributeValue): string => {
  const operator = attr.operator ?? "=";

  if (operator === "begins_with") {
    return `begins_with(#${key}, :${key})`;
  }

  if (operator === "BETWEEN") {
    return `#${key} BETWEEN :${key}_start AND :${key}_end`;
  }

  return `#${key} ${operator} :${key}`;
};

export const getKeyConditionExpression = (attributes: Record<string, AttributeInput>): string =>
  Object.entries(attributes)
    .map(([key, input]) => buildCondition(key, normalizeAttribute(input)))
    .join(" AND ");

export const getExpressionAttributeValues = (
  attributes: Record<string, AttributeInput>,
): Record<string, string> =>
  Object.entries(attributes).reduce<Record<string, string>>((acc, [key, input]) => {
    const attr = normalizeAttribute(input);

    if (attr.operator === "BETWEEN" && attr.valueBetweenEnd !== undefined) {
      return { ...acc, [`:${key}_start`]: attr.value, [`:${key}_end`]: attr.valueBetweenEnd };
    }

    return { ...acc, [`:${key}`]: attr.value };
  }, {});

export const getExpressionAttributeNames = (
  attributes: Record<string, AttributeInput>,
): Record<string, string> =>
  Object.keys(attributes).reduce<Record<string, string>>(
    (acc, key) => ({ ...acc, [`#${key}`]: key }),
    {},
  );
