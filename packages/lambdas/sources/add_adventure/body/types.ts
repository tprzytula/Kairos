export interface IRequestBody {
  name: string
  date: string
  endDate?: string
  time?: string
  endTime?: string
  location?: string
  notes?: string
  imagePath?: string
  isPrivate?: boolean
}
