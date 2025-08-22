const LEGACY_PROJECT_ID = 'legacy-shared-project'

export const createApiHeaders = (additionalHeaders: HeadersInit = {}): HeadersInit => {
  return {
    'X-Project-ID': LEGACY_PROJECT_ID,
    'Content-Type': 'application/json',
    ...additionalHeaders,
  }
}

export const createFetchOptions = (options: RequestInit = {}): RequestInit => {
  return {
    ...options,
    headers: createApiHeaders(options.headers),
  }
}
