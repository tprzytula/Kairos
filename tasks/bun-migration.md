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

### Phase 3: Web Test Migration (Jest → bun:test) — IN PROGRESS

**What was done so far:**
- Created `packages/web/bunfig.toml` with DOM enabled and preload
- Rewrote `packages/web/testSetup.ts` for bun:test:
  - Uses `@happy-dom/global-registrator` for DOM environment
  - Extended `expect` with `@testing-library/jest-dom` matchers via `expect.extend(matchers)`
  - Created fetch mock replacement (replaces `jest-fetch-mock`): adds `mockResponse()` and `mockResponseOnce()` directly to the global `fetch` function
  - Same jest polyfills as lambdas (`jest.mocked`, `jest.requireActual`, etc.)
  - Window mocks: `crypto.randomUUID`, `matchMedia`, `navigator.serviceWorker`, `navigator.onLine`
  - Module mock for Parcel `url:` imports
- Added `happy-dom` and `@happy-dom/global-registrator` as devDependencies
- Fixed `SwipeableListItemRef` re-export (changed to `export type` to fix bun ESM resolution)

**Current test status (per-file isolation):** 102/156 files pass, 54 fail.

**What still needs to be done:**

1. **Fix 43 auto-mock `jest.mock()` calls without factory** (16 unique error files)
   - Same pattern as lambdas: need explicit factory functions
   - Affects: provider mocks, API module mocks, hook mocks, component mocks
   - See the full list below

2. **Fix `fetchMock is not defined`** (2 files)
   - `src/components/AddShopForm/index.test.tsx`
   - `src/components/EditShopForm/index.test.tsx`
   - These files access `fetchMock` differently than the `fetch as FetchMock` pattern

3. **Fix various smaller issues:**
   - `window.location.hostname` undefined in happy-dom (1 file)
   - `jest.mocked(ItemForm).mock.calls` pattern (1 file)
   - `mockUseAuth.mockReturnValue` not a function (1 file)
   - `Attempted to assign to readonly property` (1 file)
   - `expect(received).not.toThrow()` failures (4 API test files — likely fetch mock default response behavior)

4. **Create `packages/web/run-tests.sh`** — same per-file isolation pattern as lambdas

5. **Update `packages/web/package.json`:**
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

## Auto-Mock Files to Fix (Web — Phase 3)

These files use `jest.mock("module")` without a factory function. Each needs a factory added:

### Provider mocks
- `src/providers/GroceryListProvider/index.test.tsx` — `../../api/groceryList`
- `src/providers/PlannerProvider/index.test.tsx` — `../../api/toDoList`
- `src/providers/NoiseTrackingProvider/index.test.tsx` — `../../api/noiseTracking`

### Component mocks
- `src/components/AlertContainer/index.test.tsx` — `../../providers/AppStateProvider`, `../../utils/alert`
- `src/components/ConnectivityNotification/index.test.tsx` — `../../hooks/useInternetConnectivity`
- `src/components/JoinProjectDialog/index.test.tsx` — `../../providers/ProjectProvider`
- `src/components/PushNotificationSettings/index.test.tsx` — `../../hooks/usePushNotifications`
- `src/components/ShopItem/index.test.tsx` — `../../providers/ShopProvider`
- `src/components/ShopList/index.test.tsx` — `../../providers/ShopProvider`
- `src/components/ToDoItem/index.test.tsx` — `../../providers/AppStateProvider`
- `src/components/ItemForm/index.test.tsx` — `../../api/groceryList`, `./hooks/useForm`
- `src/components/GroceryItem/index.test.tsx` — `../../providers/AppStateProvider`, `../../providers/GroceryListProvider`, `../../providers/ShopProvider`
- `src/components/NavigationBar/AddItemButton/index.test.tsx` — `../../../providers/NoiseTrackingProvider`, `../../../api/noiseTracking`
- `src/components/Planner/index.test.tsx` — `../../providers/ProjectProvider`, `../../api/toDoList`
- `src/components/NoiseTrackingList/index.test.tsx` — `../../providers/NoiseTrackingProvider`

### Route mocks
- `src/routes/NoiseTrackingRoute/index.test.tsx` — `../../api/noiseTracking`
- `src/routes/AddGroceryItemRoute/index.test.tsx` — `../../api/groceryList`, `../../components/ItemForm`, `../../hooks/useItemDefaults`, `../../providers/GroceryListProvider`
- `src/routes/GroceryListRoute/index.test.tsx` — `../../api/groceryList`
- `src/routes/HomeRoute/index.test.tsx` — `../../api/groceryList`, `../../api/toDoList`, `../../api/noiseTracking`, `../../api/birthdays/retrieve`, `../../api/mealPlans`
- `src/routes/AddPlannerItemRoute/index.test.tsx` — `../../api/toDoList`, `../../components/ItemForm`, `../../providers/PlannerProvider`, `../../providers/ProjectProvider`
- `src/routes/EditGroceryItemRoute/index.test.tsx` — `../../components/ItemForm`
- `src/routes/PlannerRoute/index.test.tsx` — `../../api/toDoList`

### Hook mocks
- `src/hooks/useVersion/index.test.ts` — `./index` (self-mock)

---

## Known Bun Limitations & Workarounds

| Limitation | Workaround |
|---|---|
| Module mocks leak between test files | Run each file in separate process via `run-tests.sh` |
| `jest.mock()` without factory not supported | Add explicit factory functions |
| `jest.mocked()` not available | Polyfilled as identity function in testSetup.ts |
| `jest.requireActual()` not available | Polyfilled as `require()` — works for npm packages, NOT relative paths |
| `jest.doMock()` / `jest.dontMock()` not available | Polyfilled as aliases to `jest.mock()` |
| CJS module mocking + ESM imports (e.g., aws-sdk) | Lazy-initialize module-level instances so mock is applied before first use |
| JSON.parse error messages differ (V8 vs JavaScriptCore) | Use `expect.any(SyntaxError)` instead of exact message matching |
| `import { x } from 'bun:test'` kills `jest` global | Never import from `bun:test` in test files — only in testSetup.ts preload |
| happy-dom incomplete API coverage | Guard window-dependent code with `typeof window !== 'undefined'` |
