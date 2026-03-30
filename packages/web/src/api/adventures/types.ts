export interface IAddAdventureRequest {
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

export interface IUpdateAdventureRequest {
  name?: string
  date?: string
  endDate?: string | null
  time?: string | null
  endTime?: string | null
  location?: string | null
  notes?: string | null
  imagePath?: string | null
  isPrivate?: boolean
}
