const LEGACY_PROJECT_ID = 'legacy-shared-project'

export const createApiHeaders = (additionalHeaders: Record<string, string> = {}, projectId?: string, accessToken?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'X-Project-ID': projectId || LEGACY_PROJECT_ID,
    'Content-Type': 'application/json',
    ...additionalHeaders,
  }
  
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }
  
  return headers
}

const normalizeHeaders = (headers: HeadersInit | undefined): Record<string, string> => {
  if (!headers) {
    return {}
  }
  
  if (headers instanceof Headers) {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }
  
  if (Array.isArray(headers)) {
    const result: Record<string, string> = {}
    headers.forEach(([key, value]) => {
      result[key] = value
    })
    return result
  }
  
  return headers
}

export const createFetchOptions = (options: RequestInit = {}, projectId?: string, accessToken?: string): RequestInit => {
  const normalizedHeaders = normalizeHeaders(options.headers)
  
  return {
    ...options,
    headers: createApiHeaders(normalizedHeaders, projectId, accessToken),
  }
}
