# iOS Rewrite Progress

> **Agents: read this file first.** Then update it when you start a phase, when you finish one, and when you hit a blocker. Always timestamp your entries (absolute dates — `2026-04-13`, not "today"). If you adapted the plan, record the deviation here — do NOT silently edit phase files.

## Phase status

Legend: ⬜ not started · 🚧 in progress · ⏸ blocked · ✅ done (merged to master)

| Phase                    | Status | Owner           | Branch / PR               | Last update | Notes                                         |
| ------------------------ | ------ | --------------- | ------------------------- | ----------- | --------------------------------------------- |
| 0 Scaffold               | 🚧     | tomasz.przytula | feat/ios-phase-0-scaffold | 2026-04-13  | Acceptance criteria met, awaiting PR approval |
| 1 Auth + Networking      | ⬜     | —               | —                         | —           | —                                             |
| 2 Projects + Core Wiring | ⬜     | —               | —                         | —           | —                                             |
| 3a Shared Views          | ⬜     | —               | —                         | —           | —                                             |
| 3b Shops                 | ⬜     | —               | —                         | —           | —                                             |
| 3c Grocery Store         | ⬜     | —               | —                         | —           | —                                             |
| 3d Grocery Forms         | ⬜     | —               | —                         | —           | —                                             |
| 4 Planner / To-Do        | ⬜     | —               | —                         | —           | —                                             |
| 5 Recipes + Meal Plans   | ⬜     | —               | —                         | —           | —                                             |
| 6 Home Dashboard         | ⬜     | —               | —                         | —           | —                                             |
| 7a Adventures            | ⬜     | —               | —                         | —           | —                                             |
| 7b Birthdays             | ⬜     | —               | —                         | —           | —                                             |
| 7c Noise Tracking        | ⬜     | —               | —                         | —           | —                                             |
| 7d Office Attendance     | ⬜     | —               | —                         | —           | —                                             |
| 8a Project Members       | ⬜     | —               | —                         | —           | —                                             |
| 8b Polish                | ⬜     | —               | —                         | —           | —                                             |
| 9 Push Notifications     | ⬜     | —               | —                         | —           | —                                             |
| 10 App Store             | ⬜     | —               | —                         | —           | —                                             |

## Active work

_Handoff notes for phases currently in progress. Keep short — enough for a fresh agent to pick up. Delete the entry when the phase merges._

<!-- Template:
### Phase <N> — <name> (owner: <who>, branch: <branch>, as of YYYY-MM-DD)
- Done so far: ...
- Partial: ...
- Next: ...
- Any surprises or decisions made: ...
-->

### Phase 0 — Scaffold (owner: tomasz.przytula, branch: feat/ios-phase-0-scaffold, as of 2026-04-13)

- Done so far:
  - Branch `feat/ios-phase-0-scaffold` created.
  - `packages/ios/Kairos/` skeleton: `project.yml` (xcodegen spec), `Kairos/App/{KairosApp.swift,ContentView.swift}`, `Kairos/Resources/{Info.plist,Assets.xcassets}`, `KairosTests/KairosTests.swift` (empty Swift Testing suite).
  - `Kairos.xcodeproj` generated via xcodegen (iOS 17 min deployment target, Swift 5.10).
  - `KeychainAccess 4.2.2` wired in as SPM dependency.
  - `packages/ios/.gitignore` added for Xcode artifacts; `packages/ios` added to root `.prettierignore`.
  - xcodegen installed locally via Homebrew (used only to regenerate the project from `project.yml`; not a runtime build dependency).
  - iOS 26.0.1 simulator runtime downloaded (Xcode 26 ships SDK 26; min deployment is still iOS 17).
- Verified (2026-04-13 ~10:33 BST):
  - `xcodebuild … -destination "platform=iOS Simulator,name=iPhone 17 Pro" -configuration Debug clean build -quiet` → exit 0, no output (zero warnings).
  - `xcodebuild … test` → `Test Suite 'All tests' passed … Executed 0 tests, with 0 failures`.
  - `simctl install` + `simctl launch com.kairos.app` on the iPhone 17 Pro sim → app process stayed alive; screenshot at `/tmp/kairos-screens/phase0-launch.png` shows the blank `ContentView`.
- Next: wait for PR approval; then open `feat/ios-phase-0-scaffold` → `master` PR. Phase 1 (Auth + Networking) is unblocked after merge.
- Any surprises or decisions made:
  - Xcode 26.0 is installed (SDK iOS 26) but deployment target = iOS 17 per the phase spec.
  - `xcode-select` was pointing at CommandLineTools, so all `xcodebuild` calls currently prefix `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer`. If the user runs `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` that prefix becomes unnecessary.
  - Chose xcodegen over hand-authoring `.pbxproj` for determinism and diff-friendliness; `project.yml` is committed alongside the generated `.xcodeproj`.

## Open questions / blockers for the user

_Things an agent can't resolve without input. Remove entries once answered._

<!-- Template:
- [YYYY-MM-DD, phase N] Question: ...  (context: ...)
-->

- [2026-04-13, phase 0] ~~Simulator runtime mount blocker~~ — resolved. Runtime became visible, build + test + launch all verified.

- [2026-04-13, phase 0] `xcode-select` points at CommandLineTools — documented in `packages/ios/README.md` (Prerequisites / `xcode-select` gotcha). Remaining ask (non-blocking): run `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` once to drop the per-command prefix.

## Deviations from the plan

_If you had to adapt something, record it here with a brief reason, so future agents don't get confused by the discrepancy between the phase doc and the code. Consider whether the phase doc itself should also be updated._

<!-- Template:
- [YYYY-MM-DD, phase N] Changed <X> to <Y> because <reason>. Phase doc updated / not updated.
-->

## Completed phases (audit trail)

_Append entries as phases merge to master. Date + PR link is enough. This is the quick "what's shipped" view — the status table above shows the same thing but tends to get edited; this list is append-only._

<!-- Template:
- YYYY-MM-DD — Phase N <name> merged in #<PR>
-->

---

## Update protocol

1. **Starting a phase**: change status to 🚧, fill in Owner / Branch / Last update, add an entry under Active work.
2. **While working**: update Active work when you hit a meaningful checkpoint or handoff point. Don't log every commit — this isn't a changelog.
3. **Blocked**: change status to ⏸, add an entry under Open questions.
4. **Finishing**: once merged to master, change status to ✅, clear Owner/Branch, remove the Active work entry, add a line to Completed phases.
5. **Deviating from the plan**: add an entry under Deviations. If the change is durable (not just your branch), also update the relevant phase file.
