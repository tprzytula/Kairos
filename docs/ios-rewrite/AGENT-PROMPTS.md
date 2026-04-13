# Agent Prompts for the iOS Rewrite

Copy-paste these prompts when briefing Claude (or any agent) to work on the iOS rewrite. Keeping them here means you don't have to remember the exact wording each session.

---

## Starter prompt — kick off the iOS rewrite (Phase 0)

Use this the very first time, when nothing has been built yet.

```
Start the iOS SwiftUI rewrite.

1. Read `docs/ios-rewrite/PROGRESS.md` — this is your source of truth for what's
   done and what's in flight.
2. Read `docs/ios-rewrite/README.md` for the phase index and dependency graph.
3. Read `docs/ios-rewrite/00-overview.md` and `docs/ios-rewrite/01-cross-cutting.md`.
4. Open `docs/ios-rewrite/phase-0-scaffold.md` and implement it.

Work on a new feature branch (`feat/ios-phase-0-scaffold`). Before you start
coding, update PROGRESS.md: mark Phase 0 as 🚧, fill in Owner/Branch/Last update,
and add an Active-work entry. Follow the update protocol at the bottom of
PROGRESS.md as you work.

Do NOT commit or push to master without my explicit approval. When the phase's
acceptance criteria are met and tests pass, show me what's ready and wait for
confirmation before opening the PR.

If you hit a decision you can't resolve, add an entry under "Open questions" in
PROGRESS.md and pause to ask me.
```

---

## Continuation prompt — pick up remaining work

Use this for every subsequent session, for a new agent, or for a sub-agent joining mid-stream. It self-orients from `PROGRESS.md`, so it works whether you come back tomorrow or two months later.

```
Continue the iOS SwiftUI rewrite.

1. Read `docs/ios-rewrite/PROGRESS.md` first. It tells you:
   - what phases are ✅ merged (safe to depend on)
   - what's 🚧 in flight (DO NOT pick up unless you're the owner)
   - what's ⬜ not started
   - any ⏸ blockers, open questions, or deviations from the plan

2. Read `docs/ios-rewrite/README.md` for the dependency graph. Pick the next
   phase where:
   - status is ⬜
   - all dependencies are ✅
   [If I've told you a specific phase, use that one — confirm its
    dependencies are satisfied before starting.]

3. Load `docs/ios-rewrite/00-overview.md`, `docs/ios-rewrite/01-cross-cutting.md`,
   and the phase's own file. Reference `api-reference.md` and `models.md` as
   needed for the work you touch.

4. Update PROGRESS.md BEFORE you start coding: mark the phase 🚧, fill in
   Owner/Branch/Last update, add an Active-work entry. Follow the update
   protocol at the bottom of PROGRESS.md for checkpoints, blockers, and
   completion.

5. Work on a new feature branch (`feat/ios-phase-<N>-<short-name>`). Never
   edit shared files (`DependencyContainer.swift`, `KairosApp.swift`) by
   reordering — append only, per the "Shared File Coordination" section in
   `01-cross-cutting.md`. This keeps parallel branches mergeable.

6. If the code has to deviate from the phase doc (e.g., the API surprised you),
   log it under "Deviations from the plan" in PROGRESS.md with the reason.
   Update the phase file itself if the change is durable.

Do NOT commit or push to master without my explicit approval. When the phase's
acceptance criteria are met and tests pass, show me what's ready and wait for
confirmation before opening the PR.

If blocked, log under "Open questions" and pause.
```

---

## Using with sub-agents (parallel phases)

After Phase 3a is merged, many phases can run in parallel. When you spawn sub-agents, use the **continuation prompt** and append a phase-assignment line so two agents don't race on the same phase:

```
You are assigned Phase 3b (Shops). Do not pick any other phase.
```

The `🚧 / owner` lock in `PROGRESS.md` backs this up — if an agent sees the phase already 🚧 with a different owner, it should stop and ask.

Suggested parallelizable batches (after Phase 3a is ✅):

- **Batch A**: 3b (Shops), 4 (Planner), 7a (Adventures), 7b (Birthdays), 7c (Noise), 7d (Office), 8a (Members), 9 (Push)
- **Batch B (depends on 3b)**: 3c (Grocery list), then 3d (Grocery forms)
- **Batch C**: 5 (Recipes + Meal Plans)

Phase 6 (Home Dashboard) and 8b (Polish) converge at the end once domain phases are done.

---

## Tip: you (the human) don't need to paste the whole prompt

Once you've used the continuation prompt once, a short "continue the iOS rewrite, see `docs/ios-rewrite/AGENT-PROMPTS.md`" plus a pointer to a specific phase is usually enough for a capable agent. The prompts above are the explicit version for new agents or when you want maximum reliability.
