# Code Review Agent Knowledge Base

## Lessons Learned (Mistakes to Avoid)

| Date | Mistake | Severity | Lesson Learned | Fixed In |
|------|---------|----------|----------------|----------|
| _None yet_ | - | - | - | - |

## Known Patterns

### Code Quality Patterns
| Pattern | Description | Status | Example |
|---------|-------------|--------|---------|
| Early return | Reduce nesting by returning early | Active | `if (!valid) return error` |
| Single responsibility | Functions do one thing | Active | Split large functions |
| Guard clauses | Validate inputs first | Active | Check preconditions |

### Anti-Patterns Detected
| Anti-Pattern | Detection Method | Severity | Suggested Fix |
|--------------|------------------|----------|---------------|
| Long functions | Line count > 30 | Medium | Extract to smaller functions |
| Deep nesting | Indentation > 3 | Medium | Use early returns |
| Magic numbers | Literal without name | Low | Extract to constant |
| Duplicate code | Similar code blocks | High | Extract shared function |

## Review Checklist by Level

### Level 1 - Novice
- [ ] Naming conventions followed
- [ ] No obvious bugs
- [ ] Code is readable
- [ ] Basic formatting consistent

### Level 2 - Apprentice
- [ ] Error handling present
- [ ] Edge cases considered
- [ ] Basic performance OK

### Level 3 - Practitioner
- [ ] DRY principle followed
- [ ] SOLID principles checked
- [ ] Design patterns appropriate

### Level 4 - Expert
- [ ] Architecture concerns addressed
- [ ] Scalability considered
- [ ] Complex refactoring identified

### Level 5 - Master
- [ ] System-wide patterns consistent
- [ ] Cross-cutting concerns addressed
- [ ] Performance profiled

### Level 6 - Grandmaster
- [ ] Technical debt prioritized
- [ ] Strategic improvements planned
- [ ] Team standards aligned

## Notes
- Level 1: Focus on basic code quality
- Higher levels unlock deeper analysis capabilities
- Always balance criticism with positive feedback
