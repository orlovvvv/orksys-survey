# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

> **⚠️ IMPORTANT: Context Discovery**
>
> Before modifying files in any directory, **always check for a `CLAUDE.md` file in that directory** and read it first.
> When asked to work on a specific directory, look for and read `CLAUDE.md` in that directory before starting.
> These nested context files contain directory-specific conventions and patterns that override or extend this file.

---

## Commands

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm dev:web          # Start Next.js web app (localhost:3001)
pnpm dev:native       # Start Expo mobile app

# Build & Type Check
pnpm build            # Build all apps
pnpm check-types      # TypeScript type check across all packages

# Linting & Formatting
pnpm check            # Run Biome lint and format with auto-fix

# Database (Drizzle)
pnpm db:push          # Push schema changes to database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio UI
pnpm db:start         # Start local database (if using Docker)
pnpm db:stop          # Stop local database
```

## Architecture

Turborepo monorepo with pnpm workspaces containing:

### Apps
- **`apps/web`** - Next.js 16 fullstack app with App Router, React 19, TailwindCSS, shadcn/ui
- **`apps/native`** - Expo/React Native mobile app with Expo Router, NativeWind/TailwindCSS

### Packages
- **`packages/api`** - oRPC router definitions and procedures (type-safe API layer)
- **`packages/auth`** - Better Auth configuration with Polar payments integration
- **`packages/db`** - Drizzle ORM schema and database client (PostgreSQL)
- **`packages/env`** - Environment variable validation using @t3-oss/env-core
- **`packages/config`** - Shared TypeScript configurations

### Data Flow
```
[Web/Native Client]
       ↓
   oRPC Client (TanStack Query)
       ↓
  /api/rpc/[[...rest]] (Next.js route)
       ↓
   createContext() → auth.api.getSession()
       ↓
   AppRouter procedures
       ↓
   Drizzle ORM → PostgreSQL
```

## Key Patterns

### oRPC Procedures
- Base procedures defined in `packages/api/src/index.ts`
- `publicProcedure` - no auth required
- `protectedProcedure` - requires authenticated session
- Routers in `packages/api/src/routers/` are merged into `appRouter`

### Adding a New API Procedure
1. Create or extend router in `packages/api/src/routers/`
2. Export from `packages/api/src/routers/index.ts`
3. Type is automatically inferred by clients via `AppRouterClient`

### Database Schema
- Schema files in `packages/db/src/schema/`
- Drizzle config reads `.env` from `apps/web/.env`
- Use `pnpm db:push` for prototyping, `pnpm db:generate && db:migrate` for production

### Environment Variables
- Server env (DATABASE_URL, BETTER_AUTH_SECRET, etc.): `packages/env/src/server.ts`
- Web client env: `packages/env/src/web.ts`
- Native client env (EXPO_PUBLIC_*): `packages/env/src/native.ts`

### Authentication
- Better Auth with email/password, Polar payments, Expo support
- Auth client: `apps/web/src/lib/auth-client.ts` or `apps/native/lib/auth-client.ts`
- Session available in oRPC context via `createContext()`

## Required Environment Variables

Create `apps/web/.env`:
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<32+ chars>
BETTER_AUTH_URL=http://localhost:3001
POLAR_ACCESS_TOKEN=...
POLAR_SUCCESS_URL=http://localhost:3001/success
CORS_ORIGIN=http://localhost:3001
```

For native app, create `apps/native/.env`:
```
EXPO_PUBLIC_SERVER_URL=http://localhost:3001
```

## Code Style

- Biome for linting and formatting (tab indents, double quotes)
- `pnpm check` auto-fixes lint issues and sorts imports
- Tailwind class sorting enabled via Biome nursery rule

## Documentation References

Reference repositories for learning patterns from key dependencies (located at `~/Projects/docs-worktrees/`):

| Library | Path | Purpose |
|---------|------|---------|
| shadcn/ui | `~/Projects/docs-worktrees/shadcn-ui/` | UI component patterns, base-ui primitives |
| Next.js | `~/Projects/docs-worktrees/nextjs/` | App Router, RSC, data fetching patterns |
| oRPC | `~/Projects/docs-worktrees/orpc/` | Type-safe API patterns, procedure definitions |
| Better Auth | `~/Projects/docs-worktrees/better-auth/` | Authentication patterns, plugin configs |

These are shallow clones for quick reference. Update with `git pull origin main` when needed.
