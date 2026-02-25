#!/usr/bin/env node

import { init } from '../src/init.js';
import { stats, displayXp } from '../src/stats.js';

const args = process.argv.slice(2);
const command = args[0];
const isGlobal = args.includes('--global') || args.includes('-g');
const isHelp = args.includes('--help') || args.includes('-h');

if (isHelp) {
  console.log(`
create-opencode-skills - Install OpenCode skills and agents

Usage:
  npx create-opencode-skills              Install to current project
  npx create-opencode-skills --global     Install globally (~/.opencode)
  npx create-opencode-skills stats        Show XP, level, and progress
  npx create-opencode-skills display-xp <amount> "<reason>"
                                          Display XP gain (used by agent)

Options:
  -g, --global    Install to user home directory
  -h, --help      Show this help message

Examples:
  cd my-project && npx create-opencode-skills
  npx create-opencode-skills --global
  npx create-opencode-skills stats
  npx create-opencode-skills display-xp 35 "Fixed high issue"
`);
  process.exit(0);
}

if (command === 'stats') {
  stats();
  process.exit(0);
}

if (command === 'display-xp') {
  const amount = args[1];
  const reason = args[2];
  displayXp(amount, reason);
  process.exit(0);
}

init({ isGlobal }).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
