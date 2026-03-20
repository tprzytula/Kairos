import { vi } from 'vitest'

// Mock service worker for testing
export const mockServiceWorker = {
  register: vi.fn().mockResolvedValue({
    installing: null,
    waiting: null,
    active: null,
    addEventListener: vi.fn(),
    update: vi.fn().mockResolvedValue(undefined),
  }),
  getRegistration: vi.fn().mockResolvedValue(null),
  ready: vi.fn().mockResolvedValue({}),
  controller: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

// Mock navigator.serviceWorker
Object.defineProperty(global.navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true,
})

// Mock navigator.onLine
Object.defineProperty(global.navigator, 'onLine', {
  value: true,
  writable: true,
})

export default mockServiceWorker
