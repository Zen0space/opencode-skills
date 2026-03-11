# OpenCode Skills & Agents

A collection of reusable skills and agents for [OpenCode](https://opencode.ai) - an AI-powered development assistant that runs in your terminal.

## What This Does

When you add these files to your project, OpenCode will:
- Follow your coding conventions (formatting, patterns, etc.)
- Write commit messages in your preferred format
- Audit your code for security vulnerabilities
- Review code quality and suggest improvements
- Write and fix tests
- Write and maintain documentation
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

Use the agent name as a command to view progress:

```bash
npx ocs-stats security     # Security agent progress
npx ocs-stats testing      # Testing agent progress
npx ocs-stats code-review  # Code review progress
npx ocs-stats docs         # Docs agent progress
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
npx ocs-stats update          # Smart merge update
npx ocs-stats update --check  # Check for updates without applying
npx ocs-stats update --force  # Force fresh install
```

## What's Included

### Agents

Switch between agents with **Tab** in OpenCode, or mention them with `@agent-name`.

| Agent | Description |
|-------|-------------|
| `security` | Security expert for auditing and fixing vulnerabilities |
| `testing` | Testing expert for unit, integration, and E2E tests |
| `code-review` | Code quality reviewer — finds bugs, patterns, and improvements |
| `docs` | Documentation expert for READMEs, API docs, JSDoc, and guides |

### Skills

| Skill | Description |
|-------|-------------|
| `commit` | Commit message conventions (type(scope): description format) |
| `code-review` | Code review patterns and best practices |
| `docs` | Documentation standards and patterns |
| `memories` | Session memory for tracking work context and pending tasks |
| `mobile` | Mobile development (React Native, Flutter, Swift) |
| `security` | Security patterns, auth approach, and anti-patterns |
| `testing` | Testing patterns (Vitest, Jest, React Testing Library, Playwright) |
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

# Remove an agent you don't need
rm -rf .opencode/agents/security
rm -rf .opencode/security
```

## Agent XP System

All four agents share the same XP-based leveling system. XP is only awarded after work is completed — never for planning or reviewing alone.

### Two-Phase Workflow

Every agent follows a strict two-step process:

- **Phase 1 — Read & Plan:** The agent analyzes your code and presents findings. No XP awarded.
- **Phase 2 — Fix/Write:** Only after you ask the agent to act, and the work is done and verified, does it earn XP.

### Level Thresholds

| Level | Title | XP to Advance |
|-------|-------|---------------|
| 1 | Novice | 150 |
| 2 | Apprentice | 300 |
| 3 | Practitioner | 450 |
| 4 | Expert | 1,500 |
| 5 | Master | 3,000 |
| 6 | Grandmaster | Max level |

## Security Agent

### XP Awards

| Action | XP |
|--------|-----|
| Fix critical vulnerability | +60 XP |
| Fix high vulnerability | +35 XP |
| Fix medium vulnerability | +15 XP |
| Fix low vulnerability | +10 XP |
| Add security pattern | +30 XP |
| Document new vulnerability type | +20 XP |
| Complete package audit | +75 XP |

### Level-Specific Focus

| Level | Unlocks |
|-------|---------|
| 1 - Novice | Basic input validation, simple auth patterns, common anti-patterns |
| 2 - Apprentice | + Auth/authorization flaws, session management issues |
| 3 - Practitioner | + Data exposure risks, API security concerns |
| 4 - Expert | + Complex vulnerability chains, race conditions |
| 5 - Master | + Business logic vulnerabilities, advanced exploitation techniques |
| 6 - Grandmaster | + Custom exploit development, architecture-level security flaws |

### Preflight Checklist

Before risky operations (auth changes, DB schema, middleware), the agent:
1. Shows a dry-run preview
2. Confirms user permission
3. Documents rollback plan

## Testing Agent

### XP Awards

| Action | XP |
|--------|-----|
| Write passing unit test | +10 XP |
| Write passing integration test | +15 XP |
| Write passing E2E test | +20 XP |
| Fix broken/flaky test | +10 XP |
| Add new test pattern | +30 XP |
| Complete test suite (single file) | +20 XP |
| Complete test suite (package) | +100 XP |

### Level-Specific Focus

| Level | Unlocks |
|-------|---------|
| 1 - Novice | Basic unit tests with AAA pattern, simple function testing |
| 2 - Apprentice | + Integration tests, API testing, DB testing patterns |
| 3 - Practitioner | + E2E testing with Playwright, browser automation |
| 4 - Expert | + Advanced mocking, test utilities and factories |
| 5 - Master | + Coverage strategies, flaky test prevention, performance testing |
| 6 - Grandmaster | + Testing architecture, CI/CD integration, custom test frameworks |

### Playwright Integration

When you need E2E testing:
1. The testing agent checks for Playwright MCP
2. If not configured, prompts you to enable it
3. Creates `opencode.json` with Playwright MCP config
4. Installs `@playwright/test` and browser binaries

## Code Review Agent

### XP Awards

| Action | XP |
|--------|-----|
| Fix critical issue | +60 XP |
| Fix high issue | +35 XP |
| Fix medium issue | +20 XP |
| Fix low issue | +10 XP |
| Add new pattern to skill | +30 XP |

### Level-Specific Focus

| Level | Unlocks |
|-------|---------|
| 1 - Novice | Basic code quality, naming conventions, simple anti-patterns |
| 2 - Apprentice | + Logic errors, edge cases, error handling, performance issues |
| 3 - Practitioner | + Design patterns, SOLID principles, code duplication |
| 4 - Expert | + Architecture concerns, scalability, complex refactoring |
| 5 - Master | + System-wide patterns, cross-cutting concerns, performance profiling |
| 6 - Grandmaster | + Strategic improvements, tech debt prioritization, team standards |

## Docs Agent

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

### Level-Specific Focus

| Level | Unlocks |
|-------|---------|
| 1 - Novice | Basic README sections, code comments, getting started guides |
| 2 - Apprentice | + API docs, configuration docs, error message docs, JSDoc |
| 3 - Practitioner | + Architecture docs, design decision records, complex tutorials |
| 4 - Expert | + Contribution guidelines, release docs, migration guides |
| 5 - Master | + Comprehensive style guides, documentation architecture |
| 6 - Grandmaster | + Documentation strategy, knowledge base design, developer experience |

## Hard Rules (All Agents)

All agents share these rules that cannot be overridden:

- **No `any` types** — agents will never write or suggest TypeScript's `any` type
- **No `useEffect` by default** — treated as a last resort; agents always find a cleaner approach first
- **No git commits or pushes** — agents cannot run `git commit`, `git push`, or any destructive git command

## File Structure

```
.opencode/
├── agents/
│   ├── security.md          # Security audit agent
│   ├── testing.md           # Testing agent
│   ├── code-review.md       # Code review agent
│   └── docs.md              # Documentation agent
├── skills/
│   ├── code-review/SKILL.md # Code review patterns
│   ├── commit/SKILL.md      # Commit conventions
│   ├── docs/SKILL.md        # Documentation standards
│   ├── memories/SKILL.md    # Session memory (auto-updated)
│   ├── mobile/SKILL.md      # Mobile patterns (RN, Flutter, Swift)
│   ├── security/SKILL.md    # Security patterns
│   ├── testing/SKILL.md     # Testing patterns
│   └── webapp/SKILL.md      # Web patterns (React, Vue, Svelte, Angular)
├── security/
│   ├── xp.json              # XP tracking (auto-updated)
│   └── knowledge.md         # Accumulated findings (auto-updated)
├── testing/
│   ├── xp.json              # Testing XP tracking (auto-updated)
│   └── knowledge.md         # Testing patterns & lessons (auto-updated)
├── code-review/
│   ├── xp.json              # Code review XP tracking (auto-updated)
│   └── knowledge.md         # Review patterns & lessons (auto-updated)
└── docs/
    ├── xp.json              # Docs XP tracking (auto-updated)
    └── knowledge.md         # Documentation patterns & lessons (auto-updated)
```

## For Contributors

```
opencode-skills/
├── package.json             # npm package config (v1.3.4)
├── bin/cli.js               # CLI entry point
├── src/                     # Source files
│   ├── init.js
│   ├── display.js
│   ├── merge.js
│   └── stats.js
├── templates/               # Files copied to user projects
│   ├── agents/
│   │   ├── security.md
│   │   ├── testing.md
│   │   ├── code-review.md
│   │   └── docs.md
│   ├── skills/
│   ├── security/
│   ├── testing/
│   ├── code-review/
│   └── docs/
├── CHANGELOG.md
├── README.md
└── LICENSE
```

**Publishing to npm:**
```bash
npm login
npm publish
```

## CLI Reference

```
ocs-stats - Install OpenCode skills and agents

Usage:
  npx ocs-stats              Install to current project
  npx ocs-stats --global     Install globally (~/.opencode)
  npx ocs-stats update       Update skills (smart merge)
  npx ocs-stats update --check   Check for updates
  npx ocs-stats update --force   Force fresh install
  npx ocs-stats security     Show security agent progress
  npx ocs-stats testing      Show testing agent progress
  npx ocs-stats code-review  Show code-review agent progress
  npx ocs-stats docs         Show docs agent progress
  npx ocs-stats --help       Show help
```

## Troubleshooting

### OpenCode not finding my skills

- Make sure `.opencode` folder is in your **project root** (same level as `package.json`)
- Check that skill files are named `SKILL.md` (uppercase)

### Skills not working as expected

- Open the `SKILL.md` file and verify the content
- Make sure the frontmatter (between `---`) is valid YAML

### Stats showing zeros or MAX LEVEL incorrectly

Make sure you're on v1.3.4 or later:
```bash
npx ocs-stats update
```

### Want to reset an agent's XP?

Delete the tracking files and OpenCode will recreate them:

```bash
# Security
rm .opencode/security/xp.json
rm .opencode/security/knowledge.md

# Testing
rm .opencode/testing/xp.json
rm .opencode/testing/knowledge.md

# Code Review
rm .opencode/code-review/xp.json
rm .opencode/code-review/knowledge.md

# Docs
rm .opencode/docs/xp.json
rm .opencode/docs/knowledge.md
```

## Contributing

Feel free to submit issues and pull requests to improve these skills and agents.

## License

MIT License - see [LICENSE](LICENSE) for details.
