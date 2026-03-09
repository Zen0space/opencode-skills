# Testing Knowledge Base

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
| Random values in tests | Test data | Never use — causes flaky tests | Use fixed seed or hardcoded deterministic values |
| `fireEvent` over `userEvent` | React Testing Library | Avoid `fireEvent` — use `userEvent` for realistic interaction | Replace with `userEvent.setup()` and `await user.click()` |
| Index as key in lists | React rendering tests | Avoid — causes incorrect test assertions | Use stable unique IDs as keys |
| Missing cleanup | Test lifecycle | Always clean up mocks, timers, and instances | Use `afterEach(() => vi.clearAllMocks())` |
| Testing implementation details | Test design | Never test internal state or private methods | Test behavior and output only |

## Fixes Applied
> Log every completed fix. Read to understand what has already been done in this project.

| Date | Issue | Severity | File | Outcome |
|------|-------|----------|------|---------|
| _none_ | | | | |
