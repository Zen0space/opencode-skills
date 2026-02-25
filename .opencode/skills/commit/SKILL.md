---
name: commit
description: Agent memory for commit message conventions
---

# Commit Message Conventions

## Format
```
type(scope): description

- Bullet point changes
- Multiple lines if needed
```

## Type Prefixes
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `UI` - UI changes
- `chore` - Maintenance/tasks
- `docs` - Documentation
- `test` - Testing

## Scope Rules
- Always include scope in parentheses
- Valid scopes: `backend`, `frontend`, `mobile`, `webapp`, `db`, `infra`, etc.
- type prefixes changes MUST use e.g `UI(frontend):` or `fix(mobile):`

## Examples
```
feat(backend): add user authentication

- Implement JWT token validation
- Add protectedProcedure middleware
- Update user model with auth fields

UI(frontend): redesign lobby screen

- Update component styles
- Fix scroll issues on create room modal

fix(mobile): resolve navigation bug

- Fix back button behavior on iOS
- Update navigation stack logic
```

## Rules
1. Always use lowercase for type and scope
2. Use imperative mood (add, fix, update - not added, fixed, updated)
3. Keep first line under 72 characters
4. Add detailed bullet points for complex changes
5. Scope is REQUIRED - never commit without it
