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
