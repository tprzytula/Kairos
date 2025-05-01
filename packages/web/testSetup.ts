import '@testing-library/jest-dom'
import jestFetchMock from 'jest-fetch-mock'

import { TextEncoder } from 'node:util'

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder
}

// if (!global.TextDecoder) {
//   global.TextDecoder = TextDecoder
// }

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
}))

jestFetchMock.enableMocks()
