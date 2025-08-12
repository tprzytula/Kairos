import { renderHook, act } from '@testing-library/react'
import { useInternetConnectivity } from './index'

const mockNavigatorOnLine = (value: boolean) => {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value
  })
}

const fireEvent = (eventName: string) => {
  const event = new Event(eventName)
  window.dispatchEvent(event)
}

describe('useInternetConnectivity', () => {
  beforeEach(() => {
    mockNavigatorOnLine(true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with navigator.onLine value', () => {
    mockNavigatorOnLine(false)
    const { result } = renderHook(() => useInternetConnectivity())
    
    expect(result.current.isOnline).toBe(false)
    expect(result.current.wasOffline).toBe(false)
  })

  it('should update state when going offline', () => {
    const { result } = renderHook(() => useInternetConnectivity())
    
    expect(result.current.isOnline).toBe(true)
    expect(result.current.wasOffline).toBe(false)
    
    act(() => {
      fireEvent('offline')
    })
    
    expect(result.current.isOnline).toBe(false)
    expect(result.current.wasOffline).toBe(true)
  })

  it('should update state when coming back online', () => {
    const { result } = renderHook(() => useInternetConnectivity())
    
    act(() => {
      fireEvent('offline')
    })
    
    expect(result.current.isOnline).toBe(false)
    expect(result.current.wasOffline).toBe(true)
    
    act(() => {
      fireEvent('online')
    })
    
    expect(result.current.isOnline).toBe(true)
    expect(result.current.wasOffline).toBe(true)
  })

  it('should reset offline state', () => {
    const { result } = renderHook(() => useInternetConnectivity())
    
    act(() => {
      fireEvent('offline')
    })
    
    expect(result.current.wasOffline).toBe(true)
    
    act(() => {
      fireEvent('online')
    })
    
    expect(result.current.wasOffline).toBe(true)
    
    act(() => {
      result.current.resetOfflineState()
    })
    
    expect(result.current.wasOffline).toBe(false)
  })

  it('should maintain wasOffline state through multiple offline/online cycles', () => {
    mockNavigatorOnLine(true)
    const { result } = renderHook(() => useInternetConnectivity())
    
    expect(result.current.wasOffline).toBe(false)
    
    act(() => {
      fireEvent('offline')
    })
    
    expect(result.current.wasOffline).toBe(true)
    
    act(() => {
      fireEvent('online')
    })
    
    expect(result.current.wasOffline).toBe(true)
    
    act(() => {
      fireEvent('offline')
    })
    
    expect(result.current.wasOffline).toBe(true)
  })
})