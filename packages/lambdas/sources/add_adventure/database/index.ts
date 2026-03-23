import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";

export const createAdventure = async (adventure: {
  projectId: string;
  name: string;
  date: string;
  time?: string;
  location?: string;
  notes?: string;
}): Promise<string> => {
  const id = randomUUID();
  const now = new Date().toISOString();

  const item: Record<string, any> = {
    id,
    projectId: adventure.projectId,
    name: adventure.name.trim(),
    date: adventure.date.trim(),
    createdAt: now,
    updatedAt: now,
  };

  if (adventure.time) {
    item.time = adventure.time.trim();
  }

  if (adventure.location) {
    item.location = adventure.location.trim();
  }

  if (adventure.notes) {
    item.notes = adventure.notes.trim();
  }

  await putItem({
    tableName: DynamoDBTable.ADVENTURES,
    item,
  });

  return id;
};
