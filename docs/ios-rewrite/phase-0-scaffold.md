# Phase 0 — Project Scaffold

**Goal**: Empty app builds and runs on simulator.

**Depends on**: nothing.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.

## Deliverables

- Create Xcode project at `packages/ios/Kairos/`
- iOS 17 minimum deployment target
- Add `KeychainAccess` via SPM
- Basic `KairosApp.swift` → empty `ContentView`
- Add `.gitignore` for Swift artifacts (`*.xcuserdata`, `.build/`, `DerivedData/`)
- Add `packages/ios/` to root `.prettierignore`
- Verify build + empty test suite passes

## Acceptance criteria

`xcodebuild build` succeeds with zero warnings. `xcodebuild test` runs and passes (empty suite). App launches on iOS 17 simulator showing a blank screen.
