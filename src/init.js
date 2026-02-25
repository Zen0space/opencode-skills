import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performUpdate, checkForUpdates, formatUpdateSummary } from './merge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name === '.git') continue;
    
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export async function init({ isGlobal = false } = {}) {
  const targetDir = isGlobal 
    ? path.join(process.env.HOME || process.env.USERPROFILE, '.opencode')
    : path.join(process.cwd(), '.opencode');

  const targetParent = path.dirname(targetDir);

  console.log(`\nInstalling OpenCode skills to: ${targetDir}\n`);

  if (fs.existsSync(targetDir)) {
    console.log('.opencode folder already exists.');
    console.log('   To update: npx ocs-stats update\n');
    process.exit(0);
  }

  if (!fs.existsSync(targetParent)) {
    fs.mkdirSync(targetParent, { recursive: true });
  }

  copyDir(TEMPLATES_DIR, targetDir);

  console.log('Installed successfully!\n');
  console.log('What was installed:');
  console.log('  * Agents: security, testing');
  console.log('  * Skills: commit, memories, mobile, security, testing, webapp');
  console.log('  * Security: XP tracking, knowledge base');
  console.log('  * Testing: XP tracking, knowledge base\n');
  
  if (!isGlobal) {
    console.log('Next steps:');
    console.log('  1. Edit .opencode/skills/memories/SKILL.md to match your project');
    console.log('  2. Run `opencode` in this directory to start using the skills\n');
    console.log('Check progress: npx ocs-stats stats\n');
  }
}

export async function update({ isGlobal = false, force = false, checkOnly = false } = {}) {
  const targetDir = isGlobal 
    ? path.join(process.env.HOME || process.env.USERPROFILE, '.opencode')
    : path.join(process.cwd(), '.opencode');

  console.log(`\nUpdating OpenCode skills at: ${targetDir}\n`);

  if (!fs.existsSync(targetDir)) {
    console.log('.opencode folder not found. Run `npx ocs-stats` first.\n');
    process.exit(1);
  }

  if (force) {
    console.log('  Force mode: Removing existing .opencode folder');
    fs.rmSync(targetDir, { recursive: true, force: true });
    copyDir(TEMPLATES_DIR, targetDir);
    console.log('  Fresh install complete\n');
    return;
  }

  if (checkOnly) {
    console.log('  Checking for updates...\n');
    const updateInfo = await checkForUpdates(targetDir);
    if (!updateInfo.hasUpdates) {
      console.log(`  Already up to date (v${updateInfo.currentVersion})\n`);
      return;
    }
    formatUpdateSummary({ ...updateInfo, results: updateInfo.changes }, true);
    return;
  }

  console.log('  Updating...\n');
  const updateResult = await performUpdate(targetDir, { force, checkOnly });
  
  if (!updateResult.updated) {
    console.log(`  Already up to date (v${updateResult.currentVersion})\n`);
    return;
  }
  
  formatUpdateSummary(updateResult, false);
}
