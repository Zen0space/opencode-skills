import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

export async function init({ isGlobal = false } = {}) {
  const targetDir = isGlobal 
    ? path.join(process.env.HOME || process.env.USERPROFILE, '.opencode')
    : path.join(process.cwd(), '.opencode');

  const targetParent = path.dirname(targetDir);

  console.log(`\nInstalling OpenCode skills to: ${targetDir}\n`);

  if (fs.existsSync(targetDir)) {
    console.log('⚠️  .opencode folder already exists.');
    console.log('   Remove it first if you want a fresh install, or it will be preserved.\n');
    console.log('   To overwrite: rm -rf .opencode && npx create-opencode-skills\n');
    process.exit(0);
  }

  if (!fs.existsSync(targetParent)) {
    fs.mkdirSync(targetParent, { recursive: true });
  }

  copyDir(TEMPLATES_DIR, targetDir);

  console.log('✅ Installed successfully!\n');
  console.log('What was installed:');
  console.log('  • Agents: security');
  console.log('  • Skills: commit, memories, mobile, security, webapp');
  console.log('  • Security: XP tracking, knowledge base\n');
  
  if (!isGlobal) {
    console.log('Next steps:');
    console.log('  1. Edit .opencode/skills/memories/SKILL.md to match your project');
    console.log('  2. Run `opencode` in this directory to start using the skills\n');
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
