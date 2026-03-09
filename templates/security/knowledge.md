# Security Knowledge Base

## Lessons Learned
> Read BEFORE every fix. Never repeat a recorded mistake.

| Date | Mistake | Severity | Lesson | File |
|------|---------|----------|--------|------|
| _none_ | | | | |

## Known Patterns
> Read BEFORE analysis AND before every fix.
> Captures project-specific patterns, user preferences, and constraints discovered during sessions.
> Add new entries after each session.

| Pattern | Context | Preference | Workaround |
|---------|---------|------------|------------|
| `publicProcedure` for user data | tRPC auth | Never use for private/user-specific data | Switch to `protectedProcedure` — always verify ctx.user |
| Raw error messages exposed | Error handling | Never expose internal stack traces or DB errors to client | Use generic messages: "An unexpected error occurred" |
| Hardcoded secrets | Credentials in code | Never commit secrets or API keys | Move to environment variables, add to `.env.example` |
| Missing input validation | API endpoints | Always validate with Zod — never trust client input | Add `.input(z.object({...}))` with proper constraints |
| Logging sensitive data | Console/logger calls | Never log passwords, tokens, or PII | Strip sensitive fields before logging |

## Fixes Applied
> Log every completed fix. Read to understand what has already been done in this project.

| Date | Issue | Severity | File | Outcome |
|------|-------|----------|------|---------|
| _none_ | | | | |
