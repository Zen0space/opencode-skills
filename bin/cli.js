#!/usr/bin/env node

import { init, update } from '../src/init.js';
import { stats, displayXp } from '../src/stats.js';

const args = process.argv.slice(2);
const command = args[0];
const isGlobal = args.includes('--global') || args.includes('-g');
const isHelp = args.includes('--help') || args.includes('-h');

if (isHelp) {
  console.log(`
ocs-stats - Install OpenCode skills and agents

Usage:
  npx ocs-stats              Install to current project
  npx ocs-stats --global     Install globally (~/.opencode)
  npx ocs-stats update       Update skills (removes existing)
  npx ocs-stats stats        Show security agent progress
  npx ocs-stats display-xp <amount> "<reason>"
                                          Display XP gain (used by agent)

Options:
  -g, --global    Install to user home directory
  -h, --help      Show this help message

Examples:
  npx ocs-stats
  npx ocs-stats update
  npx ocs-stats stats
  npx ocs-stats display-xp 35 "Fixed high issue"
`);
  process.exit(0);
}

if (command === 'update') {
  update({ isGlobal }).catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
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
