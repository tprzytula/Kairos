export interface IUserPreferences {
  userId: string
  currentProjectId?: string
  currentShopId?: string
  lastUpdated: number
}

export interface IUpdateUserPreferencesRequest {
  currentProjectId?: string
  currentShopId?: string
}
