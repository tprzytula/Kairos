# API Reference

Source: `packages/infra/modules/api_gateway/openapi/*.yml` and `packages/web/src/api/*/index.ts`.

## Base URL

`https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1`

## Header Construction

```swift
// Project-scoped requests (most domain endpoints)
"Authorization": "Bearer \(idToken)"
"X-Project-ID": projectId    // from ProjectStore.currentProject.id
"Content-Type": "application/json"

// User-scoped requests (projects, preferences, push subscriptions, grocery defaults)
"Authorization": "Bearer \(accessToken)"
"Content-Type": "application/json"
// NO X-Project-ID header
```

Fallback project ID when none is selected: `legacy-shared-project`.

See `01-cross-cutting.md` → Auth Token Injection for the `APIClient` protocol contract.

## Endpoint Reference

### Shops
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/shops` | — | `[Shop]` | Project-scoped |
| PUT | `/shops` | `{ name, icon? }` | `{ id }` | |
| PATCH | `/shops/{id}` | `{ id, name?, icon? }` | `Shop` | **PATCH not POST** |
| DELETE | `/shops/{id}` | — | 200 | |
| GET | `/shops/upload-url?extension=jpg` | — | `{ uploadUrl, imagePath }` | Pre-signed S3 URL |

### Grocery Items (batch operations)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/grocery_list/items` | — | `[GroceryItem]` | `?shopId=` optional filter. Project-scoped |
| PUT | `/grocery_list/items` | `{ items: [GroceryItem], isPrivate?: true }` | `{ items: [{ id }] }` | **BATCH add (max 25)**. `quantity` is a **String** on the wire |
| PATCH | `/grocery_list/items/{id}` | `{ id, name?, quantity?, unit?, shopId?, imagePath?, isPrivate? }` | `GroceryItem` | Single item update |
| DELETE | `/grocery_list/items/{id}` | — | 200 | Single item delete |

### Grocery Item Defaults (user-scoped, NO X-Project-ID)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/grocery_list/items_defaults` | — | `[GroceryItemDefault]` | User-scoped |
| POST | `/grocery_list/items_defaults` | `{ name, unit?, icon?, category? }` | 201 | |
| PATCH | `/grocery_list/items_defaults/{name}` | `{ icon?, unit?, category? }` | 200 | Keyed by **name** not id |
| DELETE | `/grocery_list/items_defaults/{name}` | — | 200 | |
| GET | `/grocery_list/items_defaults/upload-url?extension=jpg` | — | `{ uploadUrl, imagePath }` | |

### To-Do Items (supports batch update)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/todo_list/items` | — | `[TodoItem]` | Project-scoped |
| PUT | `/todo_list/items` | `{ name, description?, dueDate?, isDone? }` | 201 | Single create |
| PATCH | `/todo_list/items/{id}` | `{ id, name?, description?, dueDate?, isDone? }` | `TodoItem` | Single update |
| POST | `/todo_list/items` | `{ items: [{ id, isDone }] }` | `[TodoItem]` | **BATCH toggle isDone** |
| DELETE | `/todo_list/items` | `{ items: [TodoItem] }` | 200 | |

### Recipes
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/recipes` | — | `[Recipe]` | Project-scoped |
| PUT | `/recipes` | `{ name, ingredients, instructions?, imagePath?, mealTypes?, dishTypes? }` | `{ id }` | |
| POST | `/recipes/{id}` | `{ id, name?, ingredients?, instructions?, imagePath?, mealTypes?, dishTypes? }` | 200 | |
| DELETE | `/recipes/{id}` | — | 200 | |
| GET | `/recipes/upload-url?extension=jpg` | — | `{ uploadUrl, imagePath }` | |

### Meal Plans
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/meal-plans` | — | `[MealPlan]` | Project-scoped |
| PUT | `/meal-plans` | `{ date, recipeName, recipeId?, imagePath? }` | `{ id }` | |
| POST | `/meal-plans/{id}` | `{ id, date?, recipeName?, recipeId?, mealType?, imagePath? }` | 200 | |
| DELETE | `/meal-plans/{id}` | — | 200 | |
| GET | `/meal-plans/upload-url?extension=jpg` | — | `{ uploadUrl, imagePath }` | |

### Adventures
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/adventures` | — | `[Adventure]` | Project-scoped |
| PUT | `/adventures` | `{ name, date, endDate?, time?, location?, notes?, imagePath? }` | `{ id }` | |
| POST | `/adventures/{id}` | `{ id, name?, date?, endDate?, time?, location?, notes?, imagePath? }` | 200 | |
| DELETE | `/adventures/{id}` | — | 200 | |
| GET | `/adventures/upload-url?extension=jpg` | — | `{ uploadUrl, imagePath }` | |

### Birthdays
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/birthdays/items` | — | `[Birthday]` | Project-scoped |
| PUT | `/birthdays/items` | `{ name, month, day, birthYear?, notes? }` | 201 | |
| PATCH | `/birthdays/items/{id}` | `{ id, name?, month?, day?, birthYear?, notes? }` | 200 | **PATCH not POST** |
| DELETE | `/birthdays/items/{id}` | — | 200 | |

### Noise Tracking
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/noise_tracking/items` | — | `[NoiseTrackingItem]` | Project-scoped. Note: **underscores** |
| PUT | `/noise_tracking/items` | `{ timestamp }` | 201 | timestamp = Unix ms |
| DELETE | `/noise_tracking/items/{timestamp}` | — | 200 | Path param is **timestamp (number)** not id |

### Office Attendance
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/office-attendance` | — | `[OfficeAttendance]` | Project-scoped |
| PUT | `/office-attendance` | `{ date, userId, userName, userAvatar? }` | `{ id }` | |
| DELETE | `/office-attendance/{id}` | — | 200 | |

### Projects (user-scoped, NO X-Project-ID except members)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/projects` | — | `[Project]` | User-scoped |
| POST | `/projects` | `{ name, isPersonal? }` | `ProjectWithRole` | Create project |
| POST | `/projects/join` | `{ inviteCode }` | `ProjectWithRole` | 6-char uppercase alphanumeric |
| GET | `/projects/invite/{inviteCode}` | — | `ProjectInviteInfo` | **Public, no auth required** |
| GET | `/projects/members` | — | `[ProjectMember]` | **Requires X-Project-ID** |
| DELETE | `/projects/members` | — | 200 | Leave project. Requires X-Project-ID |
| DELETE | `/projects/members/{userId}` | — | 200 | Remove member (owner only). Requires X-Project-ID |

### User Preferences (user-scoped, NO X-Project-ID)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/user/preferences` | — | `UserPreferences` | |
| PUT | `/user/preferences` | `{ currentProjectId? }` | `UserPreferences` | |

### Push Subscriptions (user-scoped, uses accessToken)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| POST | `/push-subscriptions` | `{ endpoint, keys: { p256dh, auth } }` | `{ success }` | VAPID web push |
| DELETE | `/push-subscriptions?endpoint={urlEncoded}` | — | `{ success }` | |

## Key API Patterns

1. **PATCH vs POST for updates**: Shops, grocery items, todo items, and birthdays use `PATCH`. Adventures, recipes, and meal plans use `POST`. Always check the table above.
2. **Batch operations**: Grocery PUT accepts `{ items: [...] }` (max 25). Todo POST accepts `{ items: [{ id, isDone }] }` for bulk toggle.
3. **`isPrivate` → `visibility` mapping**: Create/update requests send `isPrivate: true`. The backend stores `visibility: "private"`. When reading, check `visibility === "private"`. See `01-cross-cutting.md` for full rules.
4. **`quantity` is a String on the wire**: The API sends/receives grocery item `quantity` as a `String` (e.g., `"5"`). Convert to/from `Double` in the Swift model using custom `Codable`.
5. **Upload URLs**: GET `/{resource}/upload-url?extension=jpg` returns `{ uploadUrl, imagePath }`. PUT the file bytes directly to `uploadUrl`. Store `imagePath` on the entity.
6. **Noise tracking**: Delete uses `{timestamp}` (Unix ms number) as path param, not `{id}`.
