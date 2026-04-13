# packages/ios — Kairos iOS App

Native SwiftUI client replacing the React PWA. Backend (AWS Lambda + DynamoDB) is unchanged.

**Plan & rules live in [`docs/ios-rewrite/`](../../docs/ios-rewrite/)** — always read `PROGRESS.md` + `01-cross-cutting.md` before opening a phase. This README covers only the mechanics of working in this package.

---

## Prerequisites

| Tool | Version used | Notes |
|---|---|---|
| Xcode | 26.0 (17A324) | iOS SDK 26; deployment target is iOS 17 |
| iOS Simulator runtime | iOS 26.0.1 | Installed via `xcodebuild -downloadPlatform iOS`. An iOS 17 runtime would also work. |
| Homebrew | any | Only needed for `xcodegen` |
| `xcodegen` | 2.45+ | `brew install xcodegen`. Needed only to regenerate `.xcodeproj` from `project.yml`. |
| Swift | 5.10 (pinned in `project.yml`) | Shipped with Xcode |

### ⚠️ `xcode-select` gotcha (one-time fix recommended)

On this machine `xcode-select -p` currently returns `/Library/Developer/CommandLineTools`, which makes `xcodebuild`/`xcrun` fail to find Xcode. Every command in this README therefore prefixes:

```bash
export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH"
```

To get rid of that prefix permanently, run once:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

The test runner specifically needs `simctl` on `PATH` (it shells out during `xcodebuild test` and ignores `DEVELOPER_DIR` for that lookup), so the `PATH=` line matters even with `DEVELOPER_DIR` set.

### Simulator runtime not mounting

If `xcrun simctl list runtimes` doesn't show iOS despite `xcrun simctl runtime list` reporting `Ready`, `simdiskimaged` hasn't mounted it. Any of these fixes it:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo killall -9 simdiskimaged   # launchd respawns it and mounts the runtime
open -a Simulator               # Simulator.app kicks the daemon too
```

---

## Project layout

```
packages/ios/
├── .gitignore                 # Xcode artifacts (xcuserdata, DerivedData, .build, .swiftpm)
├── README.md                  # (this file)
└── Kairos/
    ├── project.yml            # xcodegen spec — SOURCE OF TRUTH for project config
    ├── Kairos.xcodeproj/      # Generated. Committed for Xcode GUI users + CI.
    │   └── project.xcworkspace/xcshareddata/swiftpm/Package.resolved   # SPM pin
    ├── Kairos/                # App target sources (directory = folder group)
    │   ├── App/
    │   ├── Models/            # (phases ≥1)
    │   ├── Enums/
    │   ├── Networking/
    │   ├── Auth/
    │   ├── Stores/
    │   ├── Views/
    │   ├── Utilities/
    │   └── Resources/
    │       ├── Assets.xcassets
    │       └── Info.plist
    └── KairosTests/           # Test target — Swift Testing (`@Test`, `#expect`)
        ├── Stores/            # One test file per store (phases ≥2)
        ├── Networking/
        ├── Auth/
        ├── Utilities/
        └── Mocks/
```

The full per-phase file map is in [`docs/ios-rewrite/00-overview.md`](../../docs/ios-rewrite/00-overview.md).

---

## Editing the project

`project.yml` defines the entire Xcode project (targets, build settings, SPM packages, schemes). Files under `Kairos/` and `KairosTests/` are picked up automatically — **drop a new `.swift` in and regenerate**:

```bash
cd packages/ios/Kairos
xcodegen generate
```

**Do not edit `Kairos.xcodeproj/project.pbxproj` directly.** Changes there are clobbered next regenerate. Put build-setting changes, new SPM deps, new schemes, or new targets in `project.yml`.

### Adding a Swift Package dependency

Edit `project.yml`:

```yaml
packages:
  KeychainAccess:
    url: https://github.com/kishikawakatsumi/KeychainAccess
    from: "4.2.2"
  # Add here…

targets:
  Kairos:
    dependencies:
      - package: KeychainAccess
      # …and reference here
```

Then `xcodegen generate`. Re-run a build so `Package.resolved` updates.

### Commit both `project.yml` and `Kairos.xcodeproj/`

The generated project is committed so people can open the app in Xcode GUI without Homebrew/`xcodegen` installed. Regeneration must stay deterministic — don't hand-edit the pbxproj.

---

## Build, test, run

Assume `DEVELOPER_DIR` + `PATH` are set (see gotcha above) and you're at repo root.

```bash
# Build for simulator (zero-warning quiet build)
xcodebuild \
  -project packages/ios/Kairos/Kairos.xcodeproj \
  -scheme Kairos \
  -destination "platform=iOS Simulator,name=iPhone 17 Pro" \
  -configuration Debug \
  build -quiet

# Run tests
xcodebuild \
  -project packages/ios/Kairos/Kairos.xcodeproj \
  -scheme Kairos \
  -destination "platform=iOS Simulator,name=iPhone 17 Pro" \
  test

# List available simulator names
xcrun simctl list devices available | grep -E "iPhone|iPad"

# Launch the app (after building)
SIM=72277F84-AA66-4078-AD29-2B15C611BD6F   # your iPhone 17 Pro UDID — check with `simctl list`
xcrun simctl boot "$SIM" 2>/dev/null || true
xcrun simctl install "$SIM" ~/Library/Developer/Xcode/DerivedData/Kairos-*/Build/Products/Debug-iphonesimulator/Kairos.app
xcrun simctl launch "$SIM" com.kairos.app

# Screenshot for QA
xcrun simctl io "$SIM" screenshot /tmp/kairos-screen.png
```

**Derived data** lands in `~/Library/Developer/Xcode/DerivedData/Kairos-<hash>/`. Safe to delete if anything gets weird (`rm -rf ~/Library/Developer/Xcode/DerivedData/Kairos-*`).

### Bundle ID & scheme

- Bundle ID: `com.kairos.app`
- Test bundle ID: `com.kairos.app.tests`
- Scheme: `Kairos` (builds app + runs `KairosTests`)

---

## Conventions

These are the project-wide rules — the canonical copy is in [`docs/ios-rewrite/01-cross-cutting.md`](../../docs/ios-rewrite/01-cross-cutting.md). Summary pointers only; follow that file's wording, not this list.

- **State**: `@Observable` stores injected via `.environment()`. No MVVM layer.
- **Networking**: `URLSession` + `async/await`. No third-party networking lib.
- **Auth**: `ASWebAuthenticationSession` for Cognito OIDC; tokens in Keychain (`KeychainAccess`).
- **Data mutations**: *update-after-success* (call API → then mutate local store array). **Not** optimistic.
- **Error state**: each store exposes `isLoading: Bool` + `isError: Bool`. Mutations throw.
- **Testing**: Swift Testing (`@Test` + `#expect`) in BDD style (`"Given the X store, when …, it should …"`). Mock `APIClient` protocol; mock `URLProtocol` for URL-level tests.
- **Shared-file coordination**: phases that add a store *append* to `DependencyContainer.swift` and `KairosApp.swift` — never reorder existing lines. Keeps merge conflicts trivial.
- **No hand-written pbxproj edits.** Always go through `project.yml`.

---

## Phase workflow (for agents)

1. Read `docs/ios-rewrite/PROGRESS.md` — find an available phase (⬜, no owner, all `blockedBy` deps ✅).
2. Read `00-overview.md`, `01-cross-cutting.md`, then the phase file.
3. Branch: `feat/ios-phase-<N>-<slug>`.
4. Mark the phase 🚧 in `PROGRESS.md` with owner/branch/date + Active-work entry.
5. Implement. Add Swift Testing tests alongside each store/module — do not accumulate untested code.
6. For shared files (`DependencyContainer.swift`, `KairosApp.swift`): **append only**.
7. Verify: `xcodebuild build -quiet` (zero output) + `xcodebuild test`. Manually QA against the phase's acceptance criteria.
8. Update `PROGRESS.md` and open the PR only after explicit user approval.
9. On merge: status → ✅, clear Owner/Branch, remove Active-work, append to Completed phases.

If you deviate from the phase file, record it under *Deviations* in `PROGRESS.md` so the next agent isn't confused by code ↔ plan drift.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `xcodebuild: error: tool 'xcodebuild' requires Xcode` | `export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer` or `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` |
| `xcrun: error: unable to find utility "simctl"` during `xcodebuild test` | Prepend `/Applications/Xcode.app/Contents/Developer/usr/bin` to `PATH` — the test host shells out and ignores `DEVELOPER_DIR` |
| `Unable to find a device matching the provided destination` | `xcrun simctl list runtimes` — if iOS runtime isn't listed, see "Simulator runtime not mounting" above |
| `Invalid runtime: com.apple.CoreSimulator.SimRuntime.iOS-…` | Same as above — runtime DMG exists but isn't mounted |
| Stale types/autocomplete in Xcode | `xcodegen generate` then File → Packages → Reset Package Caches |
| Weird SPM errors | Delete `~/Library/Developer/Xcode/DerivedData/Kairos-*` and rebuild |
| CI-style "project.pbxproj changed" diffs after regenerate | Normal — commit them. xcodegen output is deterministic for the same `project.yml`, so diffs mean someone changed the YAML. |

---

## Not yet wired (on purpose)

Things deliberately left for later phases — don't add them in Phase 0:

- `DependencyContainer.swift` — Phase 1 creates it; Phase 2+ appends stores.
- Anything under `Kairos/Models`, `Kairos/Stores`, `Kairos/Networking`, `Kairos/Auth` — per-phase.
- App icon artwork (only a stub asset catalog entry exists).
- Real launch screen (currently auto-generated via `INFOPLIST_KEY_UILaunchScreen_Generation`).
- Code signing / provisioning profile (`DEVELOPMENT_TEAM` is empty — set before any device build or App Store archive).

These are tracked in the phase files, not here.
