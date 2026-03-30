import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";

export const createAdventure = async (adventure: {
  projectId: string;
  name: string;
  date: string;
  endDate?: string;
  time?: string;
  endTime?: string;
  location?: string;
  notes?: string;
  imagePath?: string;
  isPrivate?: boolean;
  userId?: string;
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

  if (adventure.endDate) {
    item.endDate = adventure.endDate.trim();
  }

  if (adventure.time) {
    item.time = adventure.time.trim();
  }

  if (adventure.endTime) {
    item.endTime = adventure.endTime.trim();
  }

  if (adventure.location) {
    item.location = adventure.location.trim();
  }

  if (adventure.notes) {
    item.notes = adventure.notes.trim();
  }

  if (adventure.imagePath) {
    item.imagePath = adventure.imagePath;
  }

  if (adventure.isPrivate) {
    item.visibility = "private";
    item.ownerId = adventure.userId;
  }

  await putItem({
    tableName: DynamoDBTable.ADVENTURES,
    item,
  });

  return id;
};
