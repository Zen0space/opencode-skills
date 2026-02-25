#!/usr/bin/env node

import { stats, displayXp } from '../src/stats.js';

const args = process.argv.slice(2);
const command = args[0];
const isHelp = args.includes('--help') || args.includes('-h');

if (isHelp || !command) {
  console.log(`
ocs - OpenCode Skills stats

Usage:
  npx ocs stats              Show XP, level, and progress
  npx ocs display-xp <amount> "<reason>"
                             Display XP gain (used by agent)

Options:
  -h, --help      Show this help message

Examples:
  npx ocs stats
  npx ocs display-xp 35 "Fixed high issue"
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

console.log(`Unknown command: ${command}`);
console.log('Run `npx ocs --help` for usage.');
process.exit(1);
