export interface BirthdayItem {
  id: string;
  projectId: string;
  name: string;
  month: number;
  day: number;
  birthYear?: number;
  notes?: string;
  [key: string]: string | number | undefined;
}

export interface CreateBirthdayResponse {
  id: string;
}
