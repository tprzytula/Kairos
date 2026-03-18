import { jest, mock, afterAll, beforeAll } from "bun:test";

// Restore all module mocks before each test file to prevent leaks
// Both beforeAll and afterAll run per-file when loaded via preload
beforeAll(() => {
  mock.restore();
});

afterAll(() => {
  mock.restore();
});

// Polyfill jest.mocked() — identity function that returns the mock-typed input
// @ts-expect-error extending jest global for compat
jest.mocked = <T>(fn: T): T => fn;

// Polyfill jest.requireActual() — bun can use require() directly
// @ts-expect-error extending jest global for compat
jest.requireActual = (moduleName: string) => require(moduleName);

// Polyfill jest.requireMock() — returns the mocked version of a module
// @ts-expect-error extending jest global for compat
jest.requireMock = (moduleName: string) => require(moduleName);

// Polyfill jest.doMock() — non-hoisted version of jest.mock
// @ts-expect-error extending jest global for compat
jest.doMock = (modulePath: string, factory?: () => any) => jest.mock(modulePath, factory);

// Polyfill jest.dontMock() — no-op in bun (mocks auto-restore via afterAll)
// @ts-expect-error extending jest global for compat
jest.dontMock = () => {};
