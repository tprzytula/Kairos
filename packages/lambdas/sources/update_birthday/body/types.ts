export interface IRequestBody {
  id: string;
  name?: string;
  month?: number;
  day?: number;
  birthYear?: number;
  notes?: string;
  isPrivate?: boolean;
}
