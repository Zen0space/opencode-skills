# OpenCode Skills & Agents

A collection of reusable skills and agents for [OpenCode](https://opencode.ai) - an AI-powered development assistant that runs in your terminal.

## What This Does

When you add these files to your project, OpenCode will:
- Follow your coding conventions (formatting, patterns, etc.)
- Write commit messages in your preferred format
- Audit your code for security vulnerabilities
- Use proper patterns for your tech stack

## Installation

### Method 1: NPX (Recommended)

```bash
cd /path/to/your/project
npx ocs-stats
```

That's it! The `.opencode` folder will be created in your project.

**Global install** (shared across all projects):
```bash
npx ocs-stats --global
```

### Method 2: Download ZIP

1. Click the green **"Code"** button at the top of this page
2. Select **"Download ZIP"**
3. Extract the ZIP file
4. Copy the `templates/.opencode` folder to your project root

```
your-project/
├── .opencode/     ← Paste this folder here
├── src/
├── package.json
└── ...
```

### Method 3: Clone & Copy

```bash
git clone https://github.com/Zen0space/opencode-skills.git
cp -r opencode-skills/templates/.opencode /path/to/your/project/
```

## Verify Installation

```bash
cd /path/to/your/project
opencode
```

OpenCode automatically loads any `.opencode` folder in your project root.

## Check Your Progress

Use the `stats` command to view your security agent's progress:

```bash
npx ocs-stats stats
```

Example output:
```
╔══════════════════════════════════════╗
║        SECURITY AGENT                ║
╠══════════════════════════════════════╣
║  Level 1 - Novice                    ║
║  XP: [█████████░░░░░░░░] 85/150       ║
║  Progress: 57%                       ║
║                                      ║
║  Stats:                              ║
║  * Issues Fixed:  4                  ║
║  * Audits Done:   2                  ║
║  * Patterns Added: 1                 ║
║  * XP Penalties:  0                  ║
╚══════════════════════════════════════╝
```

## Update Skills

```bash
npx ocs-stats update
```

## What's Included

### Agents

| Agent | Description |
|-------|-------------|
| `security` | Security expert with XP-based leveling system for auditing and fixing vulnerabilities |

### Skills

| Skill | Description |
|-------|-------------|
| `commit` | Commit message conventions (type(scope): description format) |
| `memories` | Session memory for tracking work context and pending tasks |
| `mobile` | Mobile development (React Native, Flutter, Swift) |
| `security` | Security patterns, auth approach, and anti-patterns |
| `webapp` | Web development (React, Vue, Svelte, Angular) |

## Customization

### Understand Session Memory

The `memories` skill tracks your current work session:
- **Current Focus:** What you're actively working on
- **Recent Work:** Last changes made
- **Pending Tasks:** TODOs to complete
- **Context Notes:** Important decisions and gotchas

The agent reads and updates this file automatically. You can also edit it manually.

### Update Commit Conventions (Optional)

Edit `.opencode/skills/commit/SKILL.md` if you use different commit formats.

### Remove What You Don't Need

```bash
# Remove mobile skill if you're not building a mobile app
rm -rf .opencode/skills/mobile

# Remove security agent if you don't need security audits
rm -rf .opencode/agents/security
rm -rf .opencode/security
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
| 6 | Grandmaster | 3,000 |

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
│   ├── memories/SKILL.md    # Session memory (auto-updated)
│   ├── mobile/SKILL.md      # Mobile patterns (RN, Flutter, Swift)
│   ├── security/SKILL.md    # Security patterns
│   └── webapp/SKILL.md      # Web patterns (React, Vue, Svelte, Angular)
└── security/
    ├── xp.json              # XP tracking (auto-updated)
    └── knowledge.md         # Accumulated findings (auto-updated)
```

## For Contributors

```
opencode-skills/
├── package.json             # npm package config
├── bin/cli.js               # CLI entry point
├── src/                     # Source files
│   ├── init.js
│   ├── display.js
│   └── stats.js
├── templates/               # Files copied to user projects
│   ├── agents/
│   ├── skills/
│   └── security/
├── README.md
└── LICENSE
```

**Publishing to npm:**
```bash
npm login
npm publish
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
