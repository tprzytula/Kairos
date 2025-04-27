import { INoiseTracking } from "@kairos-lambdas-libs/dynamodb/types/index";

export const logResponse = (items: Array<INoiseTracking>) => {
  console.info("Returning items", {
    count: items.length,
    items: JSON.stringify(items),
  });
};

export const sortItems = (items: Array<INoiseTracking>) => {
  return items.sort((a, b) => b.timestamp - a.timestamp);
};
