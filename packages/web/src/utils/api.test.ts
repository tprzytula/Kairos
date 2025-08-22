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
})
