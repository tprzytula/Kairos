export interface IAdventure {
  id: string
  projectId: string
  name: string
  date: string
  endDate?: string
  time?: string
  endTime?: string
  location?: string
  notes?: string
  imagePath?: string
  createdAt: string
  updatedAt: string
  visibility?: 'private'
  ownerId?: string
}
