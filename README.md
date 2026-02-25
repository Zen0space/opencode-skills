# OpenCode Skills & Agents

A collection of reusable skills and agents for [OpenCode](https://opencode.ai) - AI-powered development assistant.

## Quick Start

1. Copy the `.opencode` folder to your project root:
   ```bash
   cp -r .opencode /path/to/your/project/
   ```

2. OpenCode will automatically detect and use the skills and agents.

## What's Included

### Agents

| Agent | Description |
|-------|-------------|
| `security` | Security expert with XP-based leveling system for auditing and fixing vulnerabilities |

### Skills

| Skill | Description |
|-------|-------------|
| `commit` | Commit message conventions (type(scope): description format) |
| `memories` | Project-specific coding preferences and conventions |
| `mobile` | React Native & Expo development patterns |
| `security` | Security patterns, auth approach, and anti-patterns |
| `webapp` | React, TypeScript, and Next.js patterns |

## Customization Guide

### Modify Project Conventions (`memories/SKILL.md`)

The `memories/SKILL.md` contains coding conventions. Update it to match your project:

```markdown
## Project Info
- Framework: Your framework here
- Language: Your language
- Database: Your database
```

### Add Your Own Skills

Create a new skill in `.opencode/skills/your-skill/SKILL.md`:

```markdown
---
name: your-skill
description: What this skill does
---

# Your Skill Content

## Guidelines
- Rule 1
- Rule 2
```

### Add Your Own Agents

Create a new agent in `.opencode/agents/your-agent.md`:

```markdown
---
description: Agent description
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

You are a [role] agent specialized in [domain].
```

## Security Agent Features

The security agent includes an XP-based leveling system:

| Level | Title | XP Required |
|-------|-------|-------------|
| 1 | Novice | 0 |
| 2 | Apprentice | 150 |
| 3 | Practitioner | 450 |
| 4 | Expert | 900 |
| 5 | Master | 1500 |
| 6 | Grandmaster | 3000 |

### XP Awards

| Action | XP |
|--------|-----|
| Fix critical issue | +60 XP |
| Fix high issue | +35 XP |
| Fix medium issue | +15 XP |
| Fix low issue | +10 XP |
| Add security pattern | +30 XP |
| Complete package audit | +75 XP |

### Preflight Checklist

Before risky operations (auth changes, DB schema, middleware), the agent:
1. Shows a dry-run preview
2. Confirms user permission
3. Documents rollback plan

## Structure

```
.opencode/
├── agents/
│   └── security.md          # Security audit agent
├── skills/
│   ├── commit/SKILL.md      # Commit conventions
│   ├── memories/SKILL.md    # Project conventions
│   ├── mobile/SKILL.md      # React Native patterns
│   ├── security/SKILL.md    # Security patterns
│   └── webapp/SKILL.md      # Web app patterns
└── security/
    ├── xp.json              # XP tracking
    └── knowledge.md         # Accumulated findings
```

## License

MIT License - see [LICENSE](LICENSE) for details.
