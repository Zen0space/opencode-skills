---
name: docs
description: Documentation standards and best practices
---

# Documentation Standards

## 1. README Structure

### Essential Sections
```markdown
# Project Name
Brief description (1-2 sentences)

## Features
- Key feature 1
- Key feature 2

## Quick Start
### Installation
### Basic Usage

## Documentation
Link to full docs

## Contributing
How to contribute

## License
MIT / etc.
```

### Optional Sections
- Screenshots/Demo
- Prerequisites
- Configuration
- Examples
- FAQ
- Changelog

## 2. API Documentation

### Endpoint Format
```markdown
## Endpoint Name

`METHOD /path/to/endpoint`

Brief description of what it does.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Resource identifier |

### Request
```json
{
  "field": "value"
}
```

### Response
```json
{
  "success": true,
  "data": {}
}
```

### Errors
| Code | Description |
|------|-------------|
| 400 | Invalid input |
| 401 | Unauthorized |
```

## 3. Code Comments

### JSDoc/TSDoc Format
```typescript
/**
 * Brief description of the function.
 * 
 * @param paramName - Description of parameter
 * @returns Description of return value
 * @throws {ErrorType} When this happens
 * @example
 * ```ts
 * const result = functionName('value')
 * ```
 */
function functionName(paramName: string): ReturnType {
  // implementation
}
```

### When to Comment
- Complex algorithms
- Non-obvious decisions
- Workarounds and hacks
- Public APIs
- Gotchas and edge cases

### When NOT to Comment
- Self-explanatory code
- What the code does (focus on why)
- Redundant type information
- Obvious operations

## 4. Tutorial Structure

### Sections
1. **Overview** - What you'll learn
2. **Prerequisites** - What you need
3. **Step-by-step guide** - Numbered steps
4. **Complete example** - Full working code
5. **Next steps** - Where to go from here

### Writing Tips
- One concept per step
- Show, don't just tell
- Anticipate errors
- Provide checkpoints
- Link to references

## 5. Architecture Documentation

### System Overview
```markdown
# Architecture

## High-Level Design
Diagram or description of main components

## Components
### Component A
- Responsibility
- Dependencies
- Key interfaces

## Data Flow
How data moves through the system

## Key Decisions
### Decision 1
- Context
- Options considered
- Chosen solution
- Rationale
```

## 6. Changelog Format

### Keep a Changelog
```markdown
# Changelog

## [Unreleased]
### Added
- New feature

### Changed
- Changed thing

### Fixed
- Bug fix

## [1.0.0] - 2024-01-15
### Added
- Initial release
```

## 7. Markdown Best Practices

### Formatting
```markdown
# H1 for title (one per doc)
## H2 for major sections
### H3 for subsections

**Bold** for emphasis
*Italic* for technical terms
`code` for inline code

- Unordered lists for items
1. Ordered lists for steps

> Blockquotes for notes/tips

| Tables | For | Data |
|--------|-----|------|
| Cells  |     |      |
```

### Code Blocks
````markdown
```language
// Always specify language
code here
```
````

## 8. Documentation Types

| Type | Purpose | Audience |
|------|---------|----------|
| README | Project overview | All users |
| API Docs | Endpoint/function details | Developers |
| Tutorial | Step-by-step learning | New users |
| Guide | How-to accomplish tasks | Users |
| Reference | Complete specs | Advanced users |
| ADR | Architecture decisions | Team |

## 9. Quality Checklist

### Before Publishing
- [ ] All code examples tested
- [ ] Links verified
- [ ] Spelling/grammar checked
- [ ] Screenshots up to date
- [ ] Version numbers correct
- [ ] Prerequisites listed
- [ ] Contact info provided

### Regular Maintenance
- Update on feature changes
- Remove deprecated content
- Fix reported issues
- Improve based on feedback

## Anti-Patterns to Avoid

| Anti-Pattern | Why Bad | Correct Approach |
|--------------|---------|------------------|
| Outdated docs | Misleads users | Update with code |
| Missing examples | Hard to understand | Include working code |
| Jargon without explanation | Confuses newcomers | Define terms |
| Walls of text | Hard to scan | Use headers, lists |
| Broken links | Frustrates users | Verify regularly |
| No structure | Hard to navigate | Use TOC, headers |
| Copy-paste errors | Incorrect info | Test all examples |

---

## Fix-First Process

### Phase 1 — Read & Plan (NO XP)

1. Read current level from `.opencode/docs/xp.json`
2. Check `.opencode/docs/knowledge.md` for known patterns and `Lessons Learned`
3. Analyze existing documentation structure
4. Outline what needs to be written or updated
5. Present plan to user — await their confirmation

### Phase 2 — Write/Update (XP awarded only after doc is written and verified accurate)

6. Check `Lessons Learned` before writing
7. Write or update the documentation
8. Verify all code examples are accurate and work
9. Update XP in `.opencode/docs/xp.json`
10. Update `knowledge.md` with new patterns or lessons

### Level-Up Rule (MANDATORY)

When XP earned causes `xp` to reach or exceed `xpToNextLevel` for the current level:

1. Subtract `xpToNextLevel` from the total XP — the remainder is the carry-over
2. Increment `level` by 1
3. Set `title` to the new level's title
4. Set `xp` to the carry-over amount (never accumulate XP across levels)
5. Save updated `level`, `title`, and `xp` to `.opencode/docs/xp.json`

**Example:** Level 1 (`xpToNextLevel = 150`), earn 230 XP total
→ carry-over = 230 − 150 = 80
→ Save: `level = 2`, `title = "Apprentice"`, `xp = 80`

**Chain level-ups:** If carry-over also meets or exceeds the next level's threshold, repeat until it doesn't.

### XP Awards

| Action | XP |
|--------|-----|
| Write new doc section | +20 XP |
| Improve existing docs | +15 XP |
| Add code examples | +10 XP |
| Fix doc typos/errors | +5 XP |
| Create tutorial/guide | +40 XP |
| Write API documentation | +25 XP |
| Update README | +15 XP |
| Add JSDoc comments | +10 XP |
| Create changelog entry | +10 XP |
| Add new pattern to skill | +30 XP |

### Rules

- XP only awarded after writing is complete and content is verified accurate
- Never write docs without user confirmation from Phase 1 plan
- Never document features that don't exist
- Always test code examples before including them
- Record mistakes in both `xp.json` and `knowledge.md`
