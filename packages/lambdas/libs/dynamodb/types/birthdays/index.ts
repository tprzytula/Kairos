import { IPrivateItemFields } from "../visibility";

export interface IBirthdayItem extends IPrivateItemFields {
  id: string;
  projectId: string;
  name: string;
  month: number;
  day: number;
  birthYear?: number;
  notes?: string;
}
