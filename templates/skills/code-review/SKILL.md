---
name: code-review
description: Code review patterns and best practices
---

# Code Review Patterns

## 1. Code Quality Checks

### Naming Conventions
- Variables: `camelCase` for locals, `PascalCase` for classes/types
- Constants: `SCREAMING_SNAKE_CASE` or `camelCase` depending on scope
- Files: Match the primary export name
- Boolean variables: Use `is`, `has`, `should`, `can` prefixes

### Function Quality
- Single responsibility principle
- Max 20-30 lines per function
- Max 3-4 parameters (use object for more)
- Early returns to reduce nesting
- Meaningful function names (describe what, not how)

### Code Smells to Detect
| Smell | Detection | Suggestion |
|-------|-----------|------------|
| Long function | >30 lines | Break into smaller functions |
| Deep nesting | >3 levels | Extract to helper functions |
| Magic numbers | Unnamed literals | Extract to named constants |
| Duplicate code | Similar blocks | Extract to shared function |
| Dead code | Unused imports/vars | Remove |
| Large files | >300 lines | Consider splitting |

## 2. Error Handling Patterns

### Good Patterns
```typescript
// Early return with error
function process(data: Data): Result | Error {
  if (!data) return new Error('Data required')
  if (!data.valid) return new Error('Invalid data')
  return processValidData(data)
}

// Result type pattern
type Result<T> = { ok: true; value: T } | { ok: false; error: string }
```

### Anti-Patterns
```typescript
// Swallowing errors
try { something() } catch (e) { /* silent */ }

// Empty catch blocks
try { risky() } catch (e) {}

// Catching without handling
try { operation() } catch (e) { throw e }
```

## 3. Performance Checks

### Common Issues
- N+1 queries in loops
- Missing memoization opportunities
- Large bundle imports
- Synchronous operations that could be async
- Unnecessary re-renders (React)
- Missing indexes on queried fields

### Red Flags
```typescript
// In loop - potential N+1
for (const user of users) {
  await fetchUserDetails(user.id)
}

// Better
const details = await Promise.all(
  users.map(u => fetchUserDetails(u.id))
)
```

## 4. Security Review Checklist

| Check | Description |
|-------|-------------|
| Input validation | All user inputs validated/sanitized |
| SQL injection | Parameterized queries used |
| XSS prevention | Output encoded/escaped |
| Auth checks | Proper authorization on endpoints |
| Secrets | No hardcoded credentials |
| Dependencies | Known vulnerable packages |

## 5. TypeScript Specific

### Type Safety
- Avoid `any` - use `unknown` if type truly unknown
- Use strict null checks
- Prefer interfaces for object shapes
- Use type guards for runtime checks

### Good Patterns
```typescript
// Discriminated unions
type Result = 
  | { success: true; data: string }
  | { success: false; error: Error }

// Const assertions
const ROLES = ['admin', 'user', 'guest'] as const
type Role = typeof ROLES[number]
```

## 6. React Specific

### Component Quality
- One component per file
- Props interface defined
- Memo for expensive renders
- Proper key usage in lists
- Effect dependencies correct

### Hook Rules
- Hooks at top level only
- Custom hooks start with `use`
- Cleanup in useEffect when needed
- Proper dependency arrays

## 7. Review Severity Guide

### Critical (Must Fix)
- Security vulnerabilities
- Data loss potential
- Breaking bugs
- Performance degradation

### High (Should Fix)
- Logic errors
- Missing error handling
- Type safety issues
- Memory leaks

### Medium (Consider Fix)
- Code duplication
- Poor naming
- Missing tests
- Documentation gaps

### Low (Nice to Have)
- Style inconsistencies
- Minor optimizations
- Alternative patterns

## Anti-Patterns to Avoid

| Anti-Pattern | Why Bad | Correct Approach |
|--------------|---------|------------------|
| God objects | Hard to maintain | Single responsibility |
| Premature optimization | Wasted effort | Profile first |
| Copy-paste coding | Bug duplication | Extract shared code |
| Deep inheritance | Fragile base class | Composition |
| Global state | Hidden dependencies | Dependency injection |
