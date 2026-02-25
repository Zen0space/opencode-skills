#!/usr/bin/env node

import { init, update } from '../src/init.js';
import { stats, displayXp } from '../src/stats.js';

const args = process.argv.slice(2);
const command = args[0];
const isGlobal = args.includes('--global') || args.includes('-g');
const isHelp = args.includes('--help') || args.includes('-h');
const isForce = args.includes('--force') || args.includes('-f');
const isCheck = args.includes('--check') || args.includes('-c');

if (isHelp) {
  console.log(`
ocs-stats - Install OpenCode skills and agents

Usage:
  npx ocs-stats              Install to current project
  npx ocs-stats --global     Install globally (~/.opencode)
  npx ocs-stats update       Update skills (smart merge)
  npx ocs-stats update --check   Check for updates
  npx ocs-stats update --force   Force fresh install
  npx ocs-stats stats        Show security agent progress
  npx ocs-stats stats testing   Show testing agent progress
  npx ocs-stats display-xp <amount> "<reason>"
                                          Display XP gain (used by agent)

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
  npx ocs-stats stats
  npx ocs-stats stats testing
  npx ocs-stats display-xp 35 "Fixed high issue"
  npx ocs-stats display-xp 80 "Wrote 8 unit tests [testing]"
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

else if (command === 'stats') {
  const category = args[1] || 'security';
  stats(category);
  process.exit(0);
}

else if (command === 'display-xp') {
  const amount = args[1];
  const reason = args.slice(2).join(' ') || 'XP earned';
  const category = reason.includes('[testing]') ? 'testing' : 'security';
  const cleanReason = reason.replace(/\[testing\]/g, '').trim();
  displayXp(amount, cleanReason, category);
  process.exit(0);
}

else {
  init({ isGlobal }).catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
