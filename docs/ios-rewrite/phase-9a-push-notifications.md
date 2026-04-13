# Phase 9a — Push Notifications

**Goal**: Remote notifications working end-to-end.

**Depends on**: Phase 1 (auth). Runs in parallel with domain phases.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (Push Subscriptions section).

## Deliverables

- Register for APNs, send device token to backend
- Handle incoming notifications
- Configure notification categories + actions
- Deep-link from notification tap to relevant screen

## Backend change required

The current backend only supports VAPID web push subscriptions (`POST /push-subscriptions` with `{ endpoint, keys: { p256dh, auth } }`). APNs requires a **backend change** to accept device tokens and send via APNs instead of web push. This phase may require a new Lambda + API endpoint.

## Apple developer account required

APNs entitlement is NOT available with free Xcode provisioning. This phase requires a paid Apple Developer Program membership ($99/yr).

## Acceptance criteria

App requests notification permission on first launch. Device token sent to backend. Incoming notifications display correctly. Tapping a notification navigates to the relevant screen (e.g., grocery list, planner). Notification settings view allows toggling categories.
