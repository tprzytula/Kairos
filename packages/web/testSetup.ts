import '@testing-library/jest-dom'
import jestFetchMock from 'jest-fetch-mock'

import { TextEncoder } from 'node:util'

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder
}

Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'random-uuid',
  },
})

jestFetchMock.enableMocks()
