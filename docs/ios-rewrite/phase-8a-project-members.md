# Phase 8a — Project Members

**Goal**: Project member management and join/create flows.

**Depends on**: Phase 2. Runs in parallel with 3b–3d, 4, 5, 7a–d, 9.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (Projects section), `models.md` (`ProjectMember`, `ProjectInviteInfo`, `Project`, `ProjectRole`).

## Deliverables

- **Store**: `ProjectMembersStore`. GET members requires `X-Project-ID`. Remove member via `DELETE /projects/members/{userId}`.
- **Views**:
  - `MemberListView` — shows member name, avatar, role
  - `ProjectSettingsView` — project name, invite code sharing via `ShareLink`
  - Create project form (`POST /projects`)
  - Join project flow: `GET /projects/invite/{code}` for preview → `POST /projects/join`
- **Tests**: `ProjectMembersStoreTests`

## Phase-specific API notes

- `GET /projects/invite/{inviteCode}` is **public — no auth required**.
- `/projects/members` endpoints DO require `X-Project-ID` (unlike other `/projects` endpoints which are user-scoped).
- Invite code is 6-char uppercase alphanumeric.

## Acceptance criteria

Member list shows all project members with roles. Owner can remove members. Invite code can be shared. User can create a new project. User can join a project by entering an invite code (shows preview first). All tests pass.
