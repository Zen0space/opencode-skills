#!/usr/bin/env node

import { stats, displayXp } from '../src/stats.js';

const args = process.argv.slice(2);
const command = args[0];
const subCommand = args[1];
const isHelp = args.includes('--help') || args.includes('-h');

if (isHelp || !command) {
  console.log(`
@rekabytes/ocs - OpenCode Skills stats

Usage:
  npx @rekabytes/ocs security stats
                             Show security agent XP, level, and progress
  npx @rekabytes/ocs security display-xp <amount> "<reason>"
                             Display XP gain (used by agent)

Options:
  -h, --help      Show this help message

Examples:
  npx @rekabytes/ocs security stats
  npx @rekabytes/ocs security display-xp 35 "Fixed high issue"
`);
  process.exit(0);
}

if (command === 'security') {
  if (subCommand === 'stats') {
    stats();
    process.exit(0);
  }
  
  if (subCommand === 'display-xp') {
    const amount = args[2];
    const reason = args[3];
    displayXp(amount, reason);
    process.exit(0);
  }
  
  console.log(`Unknown security command: ${subCommand}`);
  console.log('Run `npx @zen0space/ocs --help` for usage.');
  process.exit(1);
}

console.log(`Unknown command: ${command}`);
console.log('Run `npx @zen0space/ocs --help` for usage.');
process.exit(1);
