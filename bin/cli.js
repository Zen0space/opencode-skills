#!/usr/bin/env node

import { init, update } from '../src/init.js';

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
  npx create-opencode-skills update       Update skills (removes existing)

Options:
  -g, --global    Install to user home directory
  -h, --help      Show this help message

Examples:
  cd my-project && npx create-opencode-skills
  npx create-opencode-skills --global
  npx create-opencode-skills update
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

init({ isGlobal }).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
