import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";

export const createOfficeAttendance = async (attendance: {
  projectId: string;
  date: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdBy: string;
}): Promise<string> => {
  const id = randomUUID();
  const now = new Date().toISOString();

  const item: Record<string, string> = {
    id,
    projectId: attendance.projectId,
    date: attendance.date.trim(),
    userId: attendance.userId.trim(),
    userName: attendance.userName.trim(),
    createdBy: attendance.createdBy,
    createdAt: now,
  };

  if (attendance.userAvatar) {
    item.userAvatar = attendance.userAvatar;
  }

  await putItem({
    tableName: DynamoDBTable.OFFICE_ATTENDANCE,
    item,
  });

  return id;
};
