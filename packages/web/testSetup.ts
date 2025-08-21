import '@testing-library/jest-dom'
import jestFetchMock from 'jest-fetch-mock'
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
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})


jestFetchMock.enableMocks()
