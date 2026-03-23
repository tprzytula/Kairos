export interface IAdventure {
  id: string
  projectId: string
  name: string
  date: string        // YYYY-MM-DD
  time?: string       // HH:MM
  location?: string
  notes?: string
  imagePath?: string
  createdAt: string
  updatedAt: string
}
