export interface IBirthdayItem {
  id: string
  name: string
  month: number
  day: number
  birthYear?: number
  notes?: string
  visibility?: "private"
  ownerId?: string
}
