# Bun Migration: Test Runner + Lambda Bundler

## Goal

Replace Jest + esbuild with Bun as the unified toolchain for the Kairos monorepo. This simplifies the toolchain from esbuild + Jest + @swc/jest + @swc/core + babel-jest + 6 Babel packages down to a single `bun` binary.

## Current State (as of this commit)

### Phase 1: Lambda Bundler (esbuild → bun build) — COMPLETE

**What was done:**
- Replaced esbuild with `bun build` in `packages/lambdas/package.json`
- Removed esbuild from dependencies
- Added `oven-sh/setup-bun@v2` to CI workflows (`test-lambdas.yml`, `publish-lambdas.yml`)
- Verified all 48 lambda handlers bundle correctly with matching output structure (`dist/{handler}/index.js`)
- Verified zip packaging works identically

**Key details:**
- Bundle command: `bun build ./sources/*/index.ts --outdir=dist --target=node --minify --sourcemap=external --root=./sources`
- Output targets Node 20 (same as production runtime)
- Bundle sizes are comparable (bun JS slightly larger, overall smaller due to different sourcemap encoding)

### Phase 2: Lambda Test Migration (Jest → bun:test) — COMPLETE

**What was done:**
- Created `packages/lambdas/testSetup.ts` preload with polyfills for:
  - `jest.mocked()` — identity function (bun doesn't have it)
  - `jest.requireActual()` — maps to `require()` (works for npm packages, NOT relative paths)
  - `jest.requireMock()` — maps to `require()`
  - `jest.doMock()` / `jest.dontMock()` — maps to `jest.mock()`
- Created `packages/lambdas/bunfig.toml` with preload config
- Converted 26 `jest.mock("module")` auto-mock calls (without factory) to explicit factories
- Fixed 4 JSON.parse error message assertions (bun/JavaScriptCore uses different error messages than V8)
- Fixed `jest.requireMock` usage in `add_todo_item` — replaced with `require()`
- Made SNS client lazy-init in `add_todo_item/index.ts` to fix CJS/ESM mock interop issue
- Replaced `jest.doMock` in `db_migrations/runner` with polyfilled version
- Created `packages/lambdas/run-tests.sh` — runs each test file in a separate process for mock isolation
- Removed Jest/SWC dependencies: `jest`, `@jest/globals`, `@swc/core`, `@swc/jest`, `@types/jest`, `ts-node`
- Deleted `packages/lambdas/jest.config.ts`

**Key architectural decision — per-file test isolation:**
Bun's test runner shares module cache across test files in a single `bun test` run. This means `jest.mock()` in one file leaks into other files. Tests pass individually but fail in bulk. The solution is `run-tests.sh` which runs each file in a separate bun process with `xargs -P 8` for parallelism. Result: 69 files, 0 failures, ~1.8 seconds (vs Jest ~3.6s wall time).

**Test results:** 69/69 test files pass, 404/404 tests pass.

### Phase 3: Web Test Migration (Jest → bun:test) — IN PROGRESS (132/156 passing)

**What was done:**
- Created `packages/web/bunfig.toml` with DOM enabled and preload
- Rewrote `packages/web/testSetup.ts` for bun:test:
  - Uses `@happy-dom/global-registrator` for DOM environment
  - Extended `expect` with `@testing-library/jest-dom` matchers via `expect.extend(matchers)`
  - Created fetch mock replacement (replaces `jest-fetch-mock`): adds `mockResponse()` and `mockResponseOnce()` directly to the global `fetch` function. Default response is empty string with status 200 (matches jest-fetch-mock behavior).
  - Same jest polyfills as lambdas (`jest.mocked`, `jest.requireActual`, etc.)
  - Window mocks: `crypto.randomUUID`, `matchMedia`, `navigator.serviceWorker`, `navigator.onLine`
  - Module mock for Parcel `url:` imports
- Added `happy-dom` and `@happy-dom/global-registrator` as devDependencies
- Fixed `SwipeableListItemRef` and `ISwipeableListProps` re-exports (changed to `export type` to fix bun ESM resolution)
- Converted all 43 auto-mock `jest.mock()` calls without factory to explicit factories across ~23 files
- Replaced all `jest.requireActual('./relative-path')` calls with explicit mock exports (since the polyfill resolves relative to testSetup.ts, not the test file)
- Fixed `useVersion` self-mock — replaced with `Object.defineProperty(window, 'location', ...)` approach

**Current test status (per-file isolation):** 132/156 files pass, 24 fail.

**What still needs to be done (24 remaining failures):**

1. **API tests — `expect(received).not.toThrow()`** (4 files)
   - `src/api/groceryList/addDefault/index.test.ts`
   - `src/api/groceryList/updateDefault/index.test.ts`
   - `src/api/mealPlans/update/index.test.ts`
   - `src/api/recipes/update/index.test.ts`
   - Root cause: These API functions check response body content (e.g., parse JSON, check for `id` field). The default empty-string fetch mock response causes them to throw. Fix: set up appropriate mock responses in each test's beforeEach or per-test.

2. **`fetchMock is not defined`** (2 files)
   - `src/components/AddShopForm/index.test.tsx`
   - `src/components/EditShopForm/index.test.tsx`
   - Root cause: These files use `fetchMock` as a bare global instead of `const fetchMock = fetch as FetchMock`. Fix: add `const fetchMock = fetch as any` or check how they reference it.

3. **`mockUseAuth.mockReturnValue is not a function`** (1 file)
   - `src/components/DashboardHeader/index.test.tsx`
   - Root cause: `mockUseAuth` is not properly set up as a jest.fn(). Check the mock factory.

4. **`Attempted to assign to readonly property`** (1 file)
   - `src/components/ProjectInviteDisplay/index.test.tsx`
   - Root cause: happy-dom makes some properties readonly. Fix: use `Object.defineProperty()` instead of direct assignment.

5. **`Push notifications are not supported`** (1 file)
   - `src/hooks/usePushNotifications/index.test.ts`
   - Root cause: Missing `PushManager` mock in happy-dom. Fix: mock `navigator.serviceWorker.ready` and `PushManager`.

6. **`jest.mocked(ItemForm).mock.calls` undefined** (1 file)
   - `src/routes/EditPlannerItemRoute/index.test.tsx`
   - Root cause: ItemForm component mock isn't returning a proper jest.fn(). Fix: ensure the mock factory returns a jest.fn().

7. **`window.location.hostname` undefined** (2 files)
   - `src/components/UserMenu/index.test.tsx`
   - `src/routes/HomeRoute/index.test.tsx`
   - Root cause: happy-dom doesn't fully mock `window.location`. Fix: add `Object.defineProperty(window, 'location', ...)` in testSetup.ts or per-test.

8. **jest-dom `toHaveStyle` matcher issue** (1 file)
   - `src/routes/HomeRoute/components/shared/EmptyState/index.test.tsx`
   - Root cause: `diffFn is not a function` — jest-dom matchers compatibility issue with bun's expect. May need a different matcher version or custom implementation.

9. **Remaining component/route failures** (~9 files)
   - Various issues: timer mocking, async rendering, provider context issues
   - Files: `App.test.tsx`, `BirthdayFormDialog`, `NoiseTrackingItem`, `NoiseTrackingList/*`, `ShopList`, `PlannerProvider`, `ShopProvider`, `EditPlannerItemRoute`, `ShopListRoute`, `NoiseTrackingRoute`
   - Need individual investigation — may be happy-dom rendering differences, timing issues, or mock setup problems.

10. **Create `packages/web/run-tests.sh`** — same per-file isolation pattern as lambdas

11. **Update `packages/web/package.json`:**
    - Change test script to use `run-tests.sh`
    - Remove Jest/Babel dependencies: `jest`, `jest-environment-jsdom`, `@jest/globals`, `@types/jest`, `babel-jest`, `@babel/core`, `@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`, `@babel/plugin-transform-runtime`, `identity-obj-proxy`, `jest-fetch-mock`, `ts-node`
    - Delete `packages/web/jest.config.ts`
    - Delete `packages/web/babel.config.cts` (verify Parcel doesn't depend on it)

### Phase 4: Root-Level Cleanup — NOT STARTED

1. Update root `package.json` test scripts
2. Update CI workflows (`test-web.yml`) with `oven-sh/setup-bun@v2`
3. Remove root-level Jest dependencies if any
4. Final CI verification

---

## Known Bun Limitations & Workarounds

| Limitation | Workaround |
|---|---|
| Module mocks leak between test files | Run each file in separate process via `run-tests.sh` |
| `jest.mock()` without factory not supported | Add explicit factory functions |
| `jest.mocked()` not available | Polyfilled as identity function in testSetup.ts |
| `jest.requireActual()` not available | Polyfilled as `require()` — works for npm packages, NOT relative paths. For relative paths, replace with explicit exports in mock factory. |
| `jest.doMock()` / `jest.dontMock()` not available | Polyfilled as aliases to `jest.mock()` |
| CJS module mocking + ESM imports (e.g., aws-sdk) | Lazy-initialize module-level instances so mock is applied before first use |
| JSON.parse error messages differ (V8 vs JavaScriptCore) | Use `expect.any(SyntaxError)` instead of exact message matching |
| `import { x } from 'bun:test'` kills `jest` global | Never import from `bun:test` in test files — only in testSetup.ts preload |
| happy-dom incomplete API coverage | Guard window-dependent code with `typeof window !== 'undefined'`; mock `window.location` explicitly |
| `export { Type } from './types'` re-exports fail | Use `export type { Type } from './types'` for type-only re-exports |
| jest-dom `toHaveStyle` matcher `diffFn` error | May need custom matcher or different jest-dom version |
