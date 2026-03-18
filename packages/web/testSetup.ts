import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

import { jest, mock, afterAll, beforeAll } from "bun:test";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "bun:test";

// Extend bun's expect with jest-dom matchers
expect.extend(matchers);

// Restore all module mocks after each test file
afterAll(() => {
  mock.restore();
});

// --- Polyfill jest compat ---
// @ts-expect-error
jest.mocked = <T>(fn: T): T => fn;
// @ts-expect-error
jest.requireActual = (moduleName: string) => require(moduleName);
// @ts-expect-error
jest.doMock = (modulePath: string, factory?: () => any) => jest.mock(modulePath, factory);
// @ts-expect-error
jest.dontMock = () => {};

// --- fetch mock (replaces jest-fetch-mock) ---
// Tests use: const fetchMock = fetch as FetchMock; fetchMock.mockResponse(...)
// So we need to add mockResponse/mockResponseOnce directly on the fetch function.
type FetchMockResponse = {
  body: string;
  init?: ResponseInit;
};

let mockResponses: FetchMockResponse[] = [];
// Default to empty string response (matches jest-fetch-mock enableMocks() behavior)
let defaultMockResponse: FetchMockResponse | null = { body: "", init: { status: 200 } };

const mockedFetch = jest.fn(async (_input: RequestInfo | URL, _init?: RequestInit): Promise<Response> => {
  const mockData = mockResponses.length > 0 ? mockResponses.shift()! : defaultMockResponse;
  if (!mockData) {
    throw new Error("No mock response configured for fetch call");
  }
  return new Response(mockData.body, mockData.init);
}) as any;

mockedFetch.mockResponse = (body: string, init?: ResponseInit) => {
  defaultMockResponse = { body, init };
  mockResponses = [];
};
mockedFetch.mockResponseOnce = (body: string, init?: ResponseInit) => {
  mockResponses.push({ body, init });
};
mockedFetch.mockRejectOnce = (error: Error) => {
  mockedFetch.mockImplementationOnce(() => Promise.reject(error));
};
mockedFetch.resetMocks = () => {
  mockResponses = [];
  defaultMockResponse = null;
  mockedFetch.mockClear();
};

globalThis.fetch = mockedFetch;

// --- DOM-dependent mocks (only when DOM is available) ---
if (typeof window !== "undefined") {
  // Service worker mock
  const mockServiceWorker = {
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
  };

  Object.defineProperty(globalThis.navigator, "serviceWorker", {
    value: mockServiceWorker,
    writable: true,
  });

  Object.defineProperty(globalThis.navigator, "onLine", {
    value: true,
    writable: true,
  });

  Object.defineProperty(window, "crypto", {
    value: {
      randomUUID: () => "random-uuid",
    },
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// --- Module mocks ---
// Mock Parcel's url: imports
mock.module("url:../../sw.js", () => ({ default: "/mocked-sw.js" }));
