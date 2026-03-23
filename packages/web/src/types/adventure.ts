export interface IAdventure {
  id: string
  projectId: string
  name: string
  date: string        // YYYY-MM-DD
  endDate?: string    // YYYY-MM-DD (optional, for multi-day events)
  time?: string       // HH:MM
  location?: string
  notes?: string
  imagePath?: string
  createdAt: string
  updatedAt: string
}
