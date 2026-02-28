#!/usr/bin/env node

import { init, update } from '../src/init.js';
import { stats, displayXp } from '../src/stats.js';

const args = process.argv.slice(2);
const command = args[0];
const isGlobal = args.includes('--global') || args.includes('-g');
const isHelp = args.includes('--help') || args.includes('-h');
const isForce = args.includes('--force') || args.includes('-f');
const isCheck = args.includes('--check') || args.includes('-c');

const AGENT_CATEGORIES = ['security', 'testing', 'code-review', 'docs'];

if (isHelp) {
  console.log(`
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
  npx ocs-stats display-xp <amount> "<reason> [agent]"

Options:
  -g, --global    Install to user home directory
  -f, --force     Force fresh install (delete + copy)
  -c, --check     Check for updates without applying
  -h, --help      Show this help message

Examples:
  npx ocs-stats
  npx ocs-stats update
  npx ocs-stats update --check
  npx ocs-stats update --force
  npx ocs-stats security
  npx ocs-stats testing
  npx ocs-stats code-review
  npx ocs-stats docs
  npx ocs-stats display-xp 35 "Fixed high issue [security]"
  npx ocs-stats display-xp 80 "Wrote 8 unit tests [testing]"
  npx ocs-stats display-xp 25 "Reviewed PR #42 [code-review]"
  npx ocs-stats display-xp 20 "Updated API docs [docs]"
`);
  process.exit(0);
}

else if (command === 'update') {
  update({ isGlobal, force: isForce, checkOnly: isCheck })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

else if (AGENT_CATEGORIES.includes(command)) {
  stats(command);
  process.exit(0);
}

else if (command === 'display-xp') {
  const amount = args[1];
  const reason = args.slice(2).join(' ') || 'XP earned';
  const category = reason.match(/\[(security|testing|code-review|docs)\]/)?.[1] || 'security';
  const cleanReason = reason.replace(/\[(security|testing|code-review|docs)\]/g, '').trim();
  displayXp(amount, cleanReason, category);
  process.exit(0);
}

else {
  init({ isGlobal }).catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
