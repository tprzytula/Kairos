export interface IRequestBody {
  name: string;
  month: number;
  day: number;
  birthYear?: number;
  notes?: string;
  isPrivate?: boolean;
}
