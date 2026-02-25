import fs from 'fs';
import path from 'path';
import { showStats, showXpGain } from './display.js';

function findXpJson(category = 'security') {
  const cwdPath = path.join(process.cwd(), '.opencode', category, 'xp.json');
  
  if (fs.existsSync(cwdPath)) {
    return cwdPath;
  }
  
  return null;
}

export function stats(category = 'security') {
  const xpPath = findXpJson(category);
  
  if (!xpPath) {
    console.log('');
    console.log(`  No .opencode/${category}/xp.json found in this project.`);
    console.log('');
    console.log('  Make sure you\'re in a project with opencode-skills installed.');
    console.log('  Run: npx create-opencode-skills');
    console.log('');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(xpPath, 'utf-8'));
  showStats(data, category);
}

export function displayXp(amount, reason, category = 'security') {
  const xpPath = findXpJson(category);
  
  if (!xpPath) {
    console.log('No xp.json found');
    process.exit(1);
  }
  
  if (!amount || isNaN(amount)) {
    console.log('Invalid XP amount. Usage: display-xp <amount> "<reason>"');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(xpPath, 'utf-8'));
  const reasonText = reason || 'XP earned';
  showXpGain(parseInt(amount, 10), reasonText, data, category);
}
