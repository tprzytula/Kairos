import '@testing-library/jest-dom/vitest'
import createFetchMock from 'vitest-fetch-mock'
import { vi } from 'vitest'
import './__mocks__/serviceWorkerMock'

import { TextEncoder } from 'node:util'

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder as any
}

Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'random-uuid',
  },
})

// Mock window.matchMedia for PWA detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

const fetchMock = createFetchMock(vi)
fetchMock.enableMocks()
