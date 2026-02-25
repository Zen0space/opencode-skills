# OpenCode Skills & Agents

A collection of reusable skills and agents for [OpenCode](https://opencode.ai) - an AI-powered development assistant that runs in your terminal.

## What This Does

When you add these files to your project, OpenCode will:
- Follow your coding conventions (formatting, patterns, etc.)
- Write commit messages in your preferred format
- Audit your code for security vulnerabilities
- Use proper patterns for your tech stack

## Installation

Choose one of the methods below:

### Method 1: Download ZIP (Easiest)

1. Click the green **"Code"** button at the top of this page
2. Select **"Download ZIP"**
3. Extract the ZIP file
4. Copy the `.opencode` folder to your project root

```
your-project/
├── .opencode/     ← Paste this folder here
├── src/
├── package.json
└── ...
```

### Method 2: Clone & Copy

```bash
# Clone this repository
git clone https://github.com/Zen0space/opencode-skills.git

# Copy to your project (replace /path/to/your/project)
cp -r opencode-skills/.opencode /path/to/your/project/
```

### Method 3: Download Single File

If you only want one skill, download just that file:

1. Navigate to the file in GitHub (e.g., `.opencode/skills/commit/SKILL.md`)
2. Click **"Raw"** button
3. Right-click → Save as
4. Create the folder structure in your project and save the file

```
your-project/
└── .opencode/
    └── skills/
        └── commit/
            └── SKILL.md   ← Save here
```

## Verify Installation

Open your project in OpenCode and check that it recognizes the skills:

```bash
cd /path/to/your/project
opencode
```

OpenCode automatically loads any `.opencode/` folder in your project root.

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

## Customization

### Step 1: Update Project Conventions

Edit `.opencode/skills/memories/SKILL.md` to match your project:

```markdown
## Project Info
- Framework: Express        # Change to your framework
- Language: TypeScript 5   # Change to your language
- Database: PostgreSQL     # Change to your database
- Validation: Zod          # Change to your validation library
```

### Step 2: Update Commit Conventions (Optional)

Edit `.opencode/skills/commit/SKILL.md` if you use different commit formats.

### Step 3: Remove What You Don't Need

Delete any skills you don't want:

```bash
# Remove mobile skill if you're not building a mobile app
rm -rf .opencode/skills/mobile

# Remove security agent if you don't need security audits
rm -rf .opencode/agents/security
rm -rf .opencode/security
```

## Adding Your Own Skills

Create a new folder in `.opencode/skills/`:

```
.opencode/
└── skills/
    └── my-skill/
        └── SKILL.md
```

**SKILL.md template:**

```markdown
---
name: my-skill
description: What this skill does
---

# My Skill

## Guidelines
- Rule 1
- Rule 2

## Code Examples
```typescript
// Example code
```
```

## Adding Your Own Agents

Create a new file in `.opencode/agents/`:

```
.opencode/
└── agents/
    └── my-agent.md
```

**Agent template:**

```markdown
---
description: Agent description shown in OpenCode
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

You are a [role] agent specialized in [domain].

## Your Task
- Task 1
- Task 2
```

## Security Agent Features

The security agent includes an XP-based leveling system that tracks your progress:

| Level | Title | XP Required |
|-------|-------|-------------|
| 1 | Novice | 0 |
| 2 | Apprentice | 150 |
| 3 | Practitioner | 450 |
| 4 | Expert | 900 |
| 5 | Master | 1500 |
| 6 | Grandmaster | 3000 |

### XP Awards (Fix-Only System)

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

## File Structure

```
.opencode/
├── agents/
│   └── security.md          # Security audit agent
├── skills/
│   ├── commit/SKILL.md      # Commit conventions
│   ├── memories/SKILL.md    # Project conventions (EDIT THIS!)
│   ├── mobile/SKILL.md      # React Native patterns
│   ├── security/SKILL.md    # Security patterns
│   └── webapp/SKILL.md      # Web app patterns
└── security/
    ├── xp.json              # XP tracking (auto-updated)
    └── knowledge.md         # Accumulated findings (auto-updated)
```

## Troubleshooting

### OpenCode not finding my skills

- Make sure `.opencode` folder is in your **project root** (same level as `package.json`)
- Check that skill files are named `SKILL.md` (uppercase)

### Skills not working as expected

- Open the `SKILL.md` file and verify the content
- Make sure the frontmatter (between `---`) is valid YAML

### Want to reset security XP?

Delete the tracking files and OpenCode will recreate them:

```bash
rm .opencode/security/xp.json
rm .opencode/security/knowledge.md
```

## Contributing

Feel free to submit issues and pull requests to improve these skills and agents.

## License

MIT License - see [LICENSE](LICENSE) for details.
