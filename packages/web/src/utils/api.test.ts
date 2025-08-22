import { createApiHeaders, createFetchOptions } from './api'

describe('createApiHeaders', () => {
  it('should create headers with legacy project ID', () => {
    const headers = createApiHeaders()
    
    expect(headers).toEqual({
      'X-Project-ID': 'legacy-shared-project',
      'Content-Type': 'application/json',
    })
  })

  it('should merge additional headers', () => {
    const additionalHeaders = {
      'Authorization': 'Bearer token',
      'Custom-Header': 'value',
    }
    
    const headers = createApiHeaders(additionalHeaders)
    
    expect(headers).toEqual({
      'X-Project-ID': 'legacy-shared-project',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token',
      'Custom-Header': 'value',
    })
  })

  it('should allow overriding default headers', () => {
    const overrideHeaders = {
      'Content-Type': 'text/plain',
    }
    
    const headers = createApiHeaders(overrideHeaders)
    
    expect(headers).toEqual({
      'X-Project-ID': 'legacy-shared-project',
      'Content-Type': 'text/plain',
    })
  })

  it('should add authorization header when access token provided', () => {
    const headers = createApiHeaders({}, undefined, 'test-access-token')
    
    expect(headers).toEqual({
      'X-Project-ID': 'legacy-shared-project',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-access-token',
    })
  })

  it('should use custom project ID when provided', () => {
    const headers = createApiHeaders({}, 'custom-project-id')
    
    expect(headers).toEqual({
      'X-Project-ID': 'custom-project-id',
      'Content-Type': 'application/json',
    })
  })
})

describe('createFetchOptions', () => {
  it('should create fetch options with project headers', () => {
    const options = createFetchOptions()
    
    expect(options).toEqual({
      headers: {
        'X-Project-ID': 'legacy-shared-project',
        'Content-Type': 'application/json',
      },
    })
  })

  it('should merge existing options', () => {
    const existingOptions = {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
    }
    
    const options = createFetchOptions(existingOptions)
    
    expect(options).toEqual({
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
      headers: {
        'X-Project-ID': 'legacy-shared-project',
        'Content-Type': 'application/json',
      },
    })
  })

  it('should merge existing headers', () => {
    const existingOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer token',
      },
    }
    
    const options = createFetchOptions(existingOptions)
    
    expect(options).toEqual({
      method: 'POST',
      headers: {
        'X-Project-ID': 'legacy-shared-project',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token',
      },
    })
  })

  it('should include access token when provided', () => {
    const options = createFetchOptions({}, undefined, 'test-access-token')
    
    expect(options).toEqual({
      headers: {
        'X-Project-ID': 'legacy-shared-project',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-access-token',
      },
    })
  })

  it('should handle custom project ID and access token together', () => {
    const existingOptions = {
      method: 'POST',
      headers: {
        'Custom-Header': 'custom-value',
      },
    }
    
    const options = createFetchOptions(existingOptions, 'custom-project', 'access-token')
    
    expect(options).toEqual({
      method: 'POST',
      headers: {
        'X-Project-ID': 'custom-project',
        'Content-Type': 'application/json',
        'Custom-Header': 'custom-value',
        'Authorization': 'Bearer access-token',
      },
    })
  })
})
