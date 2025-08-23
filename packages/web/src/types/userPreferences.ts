export interface IUserPreferences {
  userId: string
  currentProjectId?: string
  lastUpdated: number
}

export interface IUpdateUserPreferencesRequest {
  currentProjectId?: string
}
