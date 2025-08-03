// Mock service worker for testing
export const mockServiceWorker = {
  register: jest.fn().mockResolvedValue({
    installing: null,
    waiting: null,
    active: null,
    addEventListener: jest.fn(),
    update: jest.fn().mockResolvedValue(undefined),
  }),
  getRegistration: jest.fn().mockResolvedValue(null),
  ready: jest.fn().mockResolvedValue({}),
  controller: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
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