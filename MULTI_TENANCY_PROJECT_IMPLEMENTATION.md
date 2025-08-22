# Multi-Tenancy Project Implementation

## Overview

This document tracks the implementation of a multi-tenancy system for the Kairos grocery list application. The goal is to transition from a single-account model to one where each logged-in user sees only their own items, with the ability to share lists among specific users through "Projects".

## Feature Requirements

### Core Concept: "Projects"
- Each project represents a distinct instance of the app's data (grocery lists, todo items, noise tracking)
- Users see a "Project Selection Screen" after login (only if they want to switch/create, otherwise last selected project loads)
- Users can create new projects or join existing ones via invitation
- QR codes are the primary mechanism for project invitations

### Specific Requirements
1. **Personal Project**: Users automatically get a personal project upon first login, with its ID matching their user ID. This personal project cannot accept invitations.
2. **Project Limits**: Maximum of 5 projects (1 personal + 4 shared) per user
3. **Default Behavior**: Last selected project loads by default (online/offline)
4. **Project Switching**: Option to switch or create new projects available on home screen (via user avatar menu)
5. **Project Names**: User-defined project names

## Implementation Phases

### ✅ Phase 1: Backend Infrastructure & Database Schema (COMPLETED)
- Created `Projects` and `ProjectMembers` DynamoDB tables with GSIs
- Implemented project management Lambda functions:
  - `get_user_projects`: Retrieve all projects a user is a member of
  - `create_project`: Create new projects with validation
  - `join_project`: Join existing projects via invite codes
  - `get_project_invite_info`: Get public project information for invitations
- Added project-related TypeScript types and enums
- Updated middleware to extract `projectId` from `X-Project-ID` headers
- Created OpenAPI specifications for new endpoints
- Implemented comprehensive unit tests

### ✅ Phase 2: Database Migration (COMPLETED)
- Added `projectId` field to all existing data models (GroceryList, TodoList, NoiseTracking)
- Created GSIs for project-based queries on all tables
- Updated all existing Lambda functions to require and use `projectId`
- Implemented migration script (`003_add_project_support`) to create "legacy-shared-project" for existing data
- Updated all unit tests to include `projectId` validation

### ✅ Phase 2B: Make frontend work with the new backend (COMPLETED)
- Add `projectId` to the headers of each API request
- For now always point to `legacy-shared-project`

### ✅ Phase 3: Frontend Project Management UI (PENDING)
- Created `ProjectProvider` React context with full project management capabilities:
  - Fetch user projects
  - Create new projects
  - Join projects via invite codes
  - Switch between projects
  - Auto-select personal project or last used project
  - Local storage persistence for last selected project
- Built project-related API infrastructure:
  - `retrieveUserProjects`, `createProject`, `joinProject`, `getProjectInviteInfo`
  - `createApiHeaders` utility to add `X-Project-ID` headers
- Created `ProjectSelector` Material-UI component for project switching
- Integrated `ProjectProvider` into main app entry point
- Updated `GroceryListProvider` to be project-aware
- Enhanced `UserMenu` with comprehensive project management UI
- Created `CreateProjectDialog` with validation and Material-UI design

### ✅ Phase 4: Frontend API Integration (COMPLETED)
- ✅ Updated grocery list APIs to include project context
- ✅ Updated GroceryListProvider to use currentProject
- ✅ Fixed all failing unit tests
- ✅ Updated ToDoListProvider to use project context
- ✅ Updated NoiseTrackingProvider to use project context
- ✅ Updated all API calls to include `X-Project-ID` headers via `createFetchOptions` utility
- ✅ All providers now properly depend on `currentProject` from `ProjectProvider`
- ✅ Comprehensive test coverage with proper project context mocking

### 🔄 Phase 5: Enhanced User Experience (IN PROGRESS)
**Completed:**
- ✅ Enhanced UserMenu with comprehensive project management capabilities
- ✅ Integrated project creation dialog with full validation and UX
- ✅ Improved project switching interface with visual indicators
- ✅ Professional Material-UI design with proper error handling

**In Progress:**
- 🔄 QR code generation and scanning for project invitations
- 🔄 Join project dialog component  
- 🔄 Enhanced project member management features

**Remaining:**
- ⏳ Advanced project settings and configuration options

## Current Status & Issues

### ✅ Resolved: Unit Tests
All frontend tests are now passing with proper project context integration:

**Fixed test files:**
- `packages/web/src/api/groceryList/retrieve/index.test.ts` ✅ FIXED
- `packages/web/src/providers/GroceryListProvider/index.test.tsx` ✅ FIXED
- `packages/web/src/providers/ToDoListProvider/index.test.tsx` ✅ FIXED
- `packages/web/src/providers/NoiseTrackingProvider/index.test.tsx` ✅ FIXED
- `packages/web/src/routes/NoiseTrackingRoute/index.test.tsx` ✅ FIXED
- `packages/web/src/routes/GroceryListRoute/index.test.tsx` ✅ FIXED
- `packages/web/src/routes/HomeRoute/index.test.tsx` ✅ FIXED

**New test files created:**
- `packages/web/src/api/projects/retrieve/index.test.ts` ✅ CREATED
- `packages/web/src/components/ProjectSelector/index.test.tsx` ✅ CREATED

**Current Test Status:** 93/93 test suites passing, 579/579 tests passing

## Remaining TODO Items

### 🚀 High Priority (Phase 5 Features)  
1. **join_project_dialog** (NEXT)
   - Build intuitive project joining flow with QR code scanning
   - Include invite code validation and project preview
   - Handle edge cases (invalid codes, full projects, etc.)

2. **qr_code_integration** 
   - Implement QR code generation for project invite codes
   - Implement QR code scanning to join projects
   - Consider using libraries like `qrcode` and `qr-scanner`

3. **enhanced_project_management**
   - Add project member management capabilities
   - Display project statistics (member count, creation date, etc.)
   - Project settings and configuration options

### ⏳ Medium Priority (Phase 5 Features)
4. **project_creation_form**
   - Build project creation form with validation
   - Include project name input, member limit settings
   - Form validation for project limits (max 5 projects per user)

5. **qr_code_integration**
   - Implement QR code generation for project invite codes
   - Implement QR code scanning to join projects
   - Consider using libraries like `qrcode` and `qr-scanner`

6. **avatar_menu_integration**
   - Add project switching option to user avatar menu
   - Replace or supplement the current `ProjectSelector` component
   - Provide quick access to create/join project options

7. **project_selection_screen**
   - Create dedicated project selection/switching screen
   - Show all available projects with roles and member counts
   - Provide options to create new projects or join via invite

## Technical Architecture

### Database Schema
- **Projects Table**: `id`, `ownerId`, `name`, `isPersonal`, `maxMembers`, `inviteCode`, `createdAt`
- **ProjectMembers Table**: Composite key (`projectId`, `userId`), `role`, `joinedAt`
- **Data Tables**: All existing tables now include `projectId` field

### API Patterns
- **Authentication**: JWT tokens via AWS Cognito
- **Authorization**: `X-Project-ID` header for project context
- **Endpoints**: RESTful design with consistent parameter passing

### Frontend Architecture
- **Context Providers**: `AuthProvider` → `ProjectProvider` → `AppStateProvider` → specific providers
- **State Management**: React Context with local storage persistence
- **API Integration**: Fetch with automatic `X-Project-ID` header injection

## Key Files Modified

### Backend (Lambda Functions)
- `packages/lambdas/libs/middleware/` - Authentication and project context extraction
- `packages/lambdas/libs/dynamodb/` - Types, enums, and database utilities  
- `packages/lambdas/sources/get_user_projects/` - New project management endpoints
- `packages/lambdas/sources/create_project/`
- `packages/lambdas/sources/join_project/`
- `packages/lambdas/sources/get_project_invite_info/`
- All existing Lambda functions updated for project context

### Frontend (React Components)
- `packages/web/src/providers/ProjectProvider/` - Project state management
- `packages/web/src/api/projects/` - Project-related API calls
- `packages/web/src/components/ProjectSelector/` - Project switching UI
- `packages/web/src/utils/api.ts` - API header utilities
- `packages/web/src/providers/GroceryListProvider/` - Updated for project context

### Infrastructure (Terraform)
- `packages/infra/modules/dynamodb/` - New tables and GSIs
- `packages/infra/modules/lambda/` - New Lambda functions
- `packages/infra/modules/api_gateway/` - New API endpoints

## Commands to Continue

```bash
# Fix remaining failing tests
cd packages/web
npm test

# Run specific test suites
npm test -- --testPathPattern="TodoListProvider|NoiseTrackingProvider"

# Build and test backend changes
cd ../lambdas
npm test

# Deploy infrastructure changes (CI/CD handles this)
git add .
git commit -m "Fix: Complete frontend test updates for project context"
git push origin master
```

## Next Steps for New Agent

1. **Immediate**: Complete Phase 4 by fixing remaining failing tests and updating todo/noise providers
2. **Short-term**: Implement Phase 5 features starting with QR code integration
3. **Testing**: Ensure comprehensive test coverage for all new functionality
4. **Documentation**: Update API documentation and user guides as needed

## Context Notes

- User prefers no comments in code, functional programming patterns, and TypeScript strict typing
- All infrastructure changes deploy via CI/CD pipelines on push to master
- Tests must pass before any deployment
- Existing users will see all data in "legacy-shared-project" after migration
- Personal projects use user ID as project ID for simplicity
