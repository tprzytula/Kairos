export interface IAddAdventureRequest {
  name: string
  date: string
  endDate?: string
  time?: string
  location?: string
  notes?: string
  imagePath?: string
}

export interface IUpdateAdventureRequest {
  name?: string
  date?: string
  endDate?: string | null
  time?: string | null
  location?: string | null
  notes?: string | null
  imagePath?: string | null
}
