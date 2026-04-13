# iOS Rewrite Progress

> **Agents: read this file first.** Then update it when you start a phase, when you finish one, and when you hit a blocker. Always timestamp your entries (absolute dates — `2026-04-13`, not "today"). If you adapted the plan, record the deviation here — do NOT silently edit phase files.

## Phase status

Legend: ⬜ not started · 🚧 in progress · ⏸ blocked · ✅ done (merged to master)

| Phase                    | Status | Owner | Branch / PR | Last update | Notes                        |
| ------------------------ | ------ | ----- | ----------- | ----------- | ---------------------------- |
| 0 Scaffold               | ✅     | —     | —           | 2026-04-13  | Merged to master in d99027ac |
| 1 Auth + Networking      | ✅     | —     | —           | 2026-04-13  | Merged to master in 63052d7c  |
| 2 Projects + Core Wiring | ⬜     | —     | —           | —           | —                            |
| 3a Shared Views          | ⬜     | —     | —           | —           | —                            |
| 3b Shops                 | ⬜     | —     | —           | —           | —                            |
| 3c Grocery Store         | ⬜     | —     | —           | —           | —                            |
| 3d Grocery Forms         | ⬜     | —     | —           | —           | —                            |
| 4 Planner / To-Do        | ⬜     | —     | —           | —           | —                            |
| 5 Recipes + Meal Plans   | ⬜     | —     | —           | —           | —                            |
| 6 Home Dashboard         | ⬜     | —     | —           | —           | —                            |
| 7a Adventures            | ⬜     | —     | —           | —           | —                            |
| 7b Birthdays             | ⬜     | —     | —           | —           | —                            |
| 7c Noise Tracking        | ⬜     | —     | —           | —           | —                            |
| 7d Office Attendance     | ⬜     | —     | —           | —           | —                            |
| 8a Project Members       | ⬜     | —     | —           | —           | —                            |
| 8b Polish                | ⬜     | —     | —           | —           | —                            |
| 9 Push Notifications     | ⬜     | —     | —           | —           | —                            |
| 10 App Store             | ⬜     | —     | —           | —           | —                            |

## Active work

_Handoff notes for phases currently in progress. Keep short — enough for a fresh agent to pick up. Delete the entry when the phase merges._

<!-- Template:
### Phase <N> — <name> (owner: <who>, branch: <branch>, as of YYYY-MM-DD)
- Done so far: ...
- Partial: ...
- Next: ...
- Any surprises or decisions made: ...
-->

## Open questions / blockers for the user

_Things an agent can't resolve without input. Remove entries once answered._

<!-- Template:
- [YYYY-MM-DD, phase N] Question: ...  (context: ...)
-->

- [2026-04-13, phase 0] `xcode-select` points at CommandLineTools — documented in `packages/ios/README.md` (Prerequisites / `xcode-select` gotcha). Non-blocking ask: run `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` once to drop the per-command prefix in future phases.
- [2026-04-13, phase 1] **Sign in with Apple — backend wiring needed before App Store submission**. The button is in the LoginView UI but `AuthStore.signInWithApple()` only shows a "coming soon" alert. App Store Review Guideline 4.8 requires Apple sign-in alongside any third-party social login, so this is a hard blocker for Phase 10. Backend work: add Apple as an IdP on the Cognito user-pool client (Terraform: `packages/infra/modules/cognito/main.tf`), then implement the credential exchange in `AuthStore`. Estimate: small PR — Apple developer team config + ~30 lines of Terraform + ~50 lines Swift.

## Deviations from the plan

_If you had to adapt something, record it here with a brief reason, so future agents don't get confused by the discrepancy between the phase doc and the code. Consider whether the phase doc itself should also be updated._

<!-- Template:
- [YYYY-MM-DD, phase N] Changed <X> to <Y> because <reason>. Phase doc updated / not updated.
-->

- [2026-04-13, phase 1] Built `LoginView` to match the web `LoginScreen` (gradient + card + Google CTA + feature list) instead of a minimal stub. Added `Utilities/BrandColors.swift` (hex palette + 135° brand gradient) and a `GoogleLogo` asset catalog imageset. Reason: stub login looked nothing like the web app — agreed with user to keep visual parity from day one rather than defer to Phase 8b. Phase doc not updated; this is presentation polish, not new architectural surface area.
- [2026-04-13, phase 1] **Pivoted away from web parity on `LoginView`** after design review. Reason: the web design (gradient + card + emoji + 4-feature marketing block) is dated and was failing iOS-specific concerns — no Apple sign-in (App Store blocker), no dark mode, no Dynamic Type, missing VoiceOver labels, footer contrast below WCAG AA, generic Tailwind purple gradient, generic 🏠 emoji as brand mark. Replaced with an edge-to-edge minimal design — `hourglass` SF Symbol in brand purple, `Kairos` largeTitle, "Plan with intent." tagline, Sign-in-with-Apple button (UI only — see Open questions), Continue-with-Google button (proper colorful logo, system-gray button), legal footer. Drops the feature list + description (those belong in onboarding). Brand color is now trait-aware (lighter shade in dark mode). Added `Utilities/HapticFeedback.swift`. Phase doc not updated — this is still presentation work.

## Completed phases (audit trail)

_Append entries as phases merge to master. Date + PR link is enough. This is the quick "what's shipped" view — the status table above shows the same thing but tends to get edited; this list is append-only._

<!-- Template:
- YYYY-MM-DD — Phase N <name> merged in #<PR>
-->

- 2026-04-13 — Phase 0 Scaffold merged in d99027ac (pushed direct to master, no PR)
- 2026-04-13 — Phase 1 Auth + Networking merged in 63052d7c (pushed direct to master, no PR). Includes Cognito Terraform change adding `kairos://auth/callback` to callback URLs — CI applies on merge. Apple sign-in is UI-only pending Cognito IdP wiring (see Open questions).

---

## Update protocol

1. **Starting a phase**: change status to 🚧, fill in Owner / Branch / Last update, add an entry under Active work.
2. **While working**: update Active work when you hit a meaningful checkpoint or handoff point. Don't log every commit — this isn't a changelog.
3. **Blocked**: change status to ⏸, add an entry under Open questions.
4. **Finishing**: once merged to master, change status to ✅, clear Owner/Branch, remove the Active work entry, add a line to Completed phases.
5. **Deviating from the plan**: add an entry under Deviations. If the change is durable (not just your branch), also update the relevant phase file.
