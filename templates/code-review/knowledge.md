# Code Review Knowledge Base

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
| `any` type | TypeScript typing | Avoid entirely — never use unless absolutely no alternative | Use `unknown`, generics, or proper type inference |
| `useEffect` | Side effects, auth, data fetching | Last resort only — always find an alternative first and present it to user | Server components, React Query, event handlers, derived state |
| God components | Large components doing too much | Avoid — split into smaller focused components | Extract logic into custom hooks, split UI into sub-components |
| Inline styles | Styling approach | Avoid — use className with CSS modules or Tailwind | Move to CSS class or utility class |
| Direct state mutation | State management | Never mutate state directly | Always return new object/array via spread or map |

## Fixes Applied
> Log every completed fix. Read to understand what has already been done in this project.

| Date | Issue | Severity | File | Outcome |
|------|-------|----------|------|---------|
| _none_ | | | | |
