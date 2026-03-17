# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server on http://localhost:3001
npm run build        # Production build
npm run lint         # ESLint validation
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database with test data
npm run db:reset     # Drop & recreate database (force)
npm run test         # Run Jest tests
```

## Git Rules

- **Never commit directly to `master`** — always create a feature branch first: `git checkout -b feature/description`

## Architecture

**Stack:** Next.js 16 (App Router), React 19, Prisma 7 + SQLite, Chakra UI v3, TanStack Query v5, JWT auth, TypeScript

### Route Groups

- `app/(auth)/` — Login/Signup pages (unauthenticated)
- `app/(dashboard)/` — Protected pages (contacts, admin, settings)
- `app/api/v1/` — API routes

### API Routes

- `api/v1/login/access-token` — JWT login
- `api/v1/users/` — User CRUD (admin)
- `api/v1/users/me` — Current user profile/password/delete
- `api/v1/contacts/` — Contact CRUD (owner-scoped)

### Key Utilities (`lib/`)

- `lib/db.ts` — Singleton Prisma client (SQLite via better-sqlite3 adapter)
- `lib/auth.ts` — `hashPassword`, `verifyPassword`, `createAccessToken`, `verifyAccessToken`, `getCurrentUser`
- `lib/api-utils.ts` — `ApiError`, `errorResponse`, `successResponse`, `requireAuth`, `requireSuperuser`, `parseQueryParams`, `validateEmail`, `validatePassword`
- `lib/client/api.ts` — Typed client API classes: `AuthApi`, `UsersApi`, `ContactsApi`
- `lib/client/useAuth.ts` — `useAuth()` hook (login/logout, token in `localStorage["access_token"]`)
- `lib/client/queries.ts` — React Query hooks: `useGetContacts`, `useCreateContact`, `useUpdateContact`, `useDeleteContact`

### API Response Format

```typescript
// Success
{ data: T, message?: string }
// Error (note: "detail" not "error")
{ detail: string }
```

### Authentication

Bearer token in `Authorization` header. Token stored in `localStorage["access_token"]`. The `(dashboard)` layout handles redirect if unauthenticated.

### Database Models

- **User**: id, email, hashedPassword, fullName, isActive, isSuperuser
- **Contact**: id, organisation, description, ownerId (FK → User)

### Testing Accounts

| Email | Password | Role |
|-------|----------|------|
| dev@example.com | DevPassword | Superuser |
| alice@example.com | AlicePassword123 | User |
| bob@example.com | BobPassword123 | User |
