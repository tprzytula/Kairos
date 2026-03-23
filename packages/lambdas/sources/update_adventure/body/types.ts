export interface IRequestBody {
  id: string
  name?: string
  date?: string
  endDate?: string | null
  time?: string | null
  location?: string | null
  notes?: string | null
  imagePath?: string | null
}
