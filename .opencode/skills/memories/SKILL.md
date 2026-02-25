---
name: memories
description: Agent memory for project-specific coding preferences, conventions, and patterns
---

# Project Memories

This file stores project-specific coding preferences and conventions for consistency. Based on industry standards for tRPC + Express + Prisma + TypeScript stack.

## Project Info
- Framework: Express + tRPC v11
- Language: TypeScript 5 (strict mode)
- Database: PostgreSQL with Prisma 7
- Validation: Zod 4
- Cache: Redis (ioredis)
- Linting: typescript-eslint
- Package Manager: npm/pnpm

## Project Structure
```
src/
├── config/          # Environment & constants
├── lib/            # DB, Redis, cache utilities
├── routers/        # tRPC routers (1 file per router)
├── trpc.ts         # tRPC initialization
└── index.ts       # Express entry point
```

## Coding Conventions
- File naming: lowercase kebab-case (users.ts, matchHistory.ts)
- Router exports: `export const {name}Router = router({...})`
- Export type: `export type {name}Router = typeof {name}Router`
- JSDoc for public procedures
- Console logging: `[Context] message` format

## tRPC Patterns
- Always use `.input(z.object({...}))` for validation
- Add descriptive error messages: `.min(1, "Username is required")`
- Use `publicProcedure` for public, `protectedProcedure` for auth
- Access DB via `ctx.prisma`
- Return clean data, let tRPC handle serialization
- Use superjson for data transformation
- Split large routers into sub-routers

## Prisma Patterns
- Use singleton pattern for PrismaClient (lib/db.ts)
- Always validate input before DB queries
- Use `include`/`select` for efficient queries
- Use indexes for frequently queried fields
- Handle null/undefined explicitly in queries

## Error Handling
- Throw errors directly - tRPC handles HTTP status
- Use descriptive Zod error messages
- Log context: `[Feature] action - details`
- Use TRPCError for tRPC-specific errors

## Patterns to Avoid
- ❌ Don't export router implementations to client (only types)
- ❌ Don't skip input validation
- ❌ Don't use `any` - use `unknown` and narrow
- ❌ Don't use console.error for normal flow
- ❌ Don't forget to handle null/undefined in queries
- ❌ Don't use REST-style controllers (use tRPC procedures)

## API Design
- Query vs Mutation: Use query for read-only, mutation for writes
- Naming: verbNoun for actions (getUser, createPost, updateProfile)
- Pagination: Use cursor-based for large datasets
- Response: Return meaningful data, avoid wrapping in generic objects
