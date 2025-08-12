import { renderHook, waitFor } from '@testing-library/react'
import { VersionInfo } from '../../types/version'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

const mockVersionInfo: VersionInfo = {
  version: '2025.08.07.1703',
  fullVersion: '2025.08.07.1703.12345',
  buildTime: '2025-01-08T12:00:00.000Z',
  buildTimeUTC: 'Wed, 08 Jan 2025 12:00:00 GMT',
  buildTimestamp: 1736337600000,
  packageVersion: '2025.08.07.1703',
  versionFormat: 'YYYY.MM.DD.HHMM.SSSSS (date-based)',
  cacheKey: 'kairos-v2025.08.07.1703.12345'
}

// Mock the entire module
jest.mock('./index')

// Import the hook and mocked isLocalhost function  
import { useVersion, isLocalhost } from './index'

const mockIsLocalhost = isLocalhost as jest.MockedFunction<typeof isLocalhost>

describe('useVersion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsLocalhost.mockReturnValue(false)
  })

  it('should initialize with loading state', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    const { result } = renderHook(() => useVersion())

    expect(result.current.version).toBeNull()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should fetch version successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVersionInfo
    })

    const { result } = renderHook(() => useVersion())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.version).toBe('v2025.08.07.1703')
    expect(result.current.error).toBeNull()
    expect(mockFetch).toHaveBeenCalledWith('/version.json')
  })

  it('should handle fetch error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    const { result } = renderHook(() => useVersion())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.version).toBeNull()
    expect(result.current.error).toBe('Failed to load version')
  })

  it('should handle network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useVersion())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.version).toBeNull()
    expect(result.current.error).toBe('Failed to load version')
  })

  it('should handle invalid JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => { throw new Error('Invalid JSON') }
    })

    const { result } = renderHook(() => useVersion())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.version).toBeNull()
    expect(result.current.error).toBe('Failed to load version')
  })

  describe('localhost detection', () => {
    it('should return "localhost" when running on localhost', async () => {
      mockIsLocalhost.mockReturnValue(true)

      const { result } = renderHook(() => useVersion())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.version).toBe('localhost')
      expect(result.current.error).toBeNull()
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should fetch version normally for production environments', async () => {
      mockIsLocalhost.mockReturnValue(false)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockVersionInfo
      })

      const { result } = renderHook(() => useVersion())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.version).toBe('v2025.08.07.1703')
      expect(result.current.error).toBeNull()
      expect(mockFetch).toHaveBeenCalledWith('/version.json')
    })
  })


})