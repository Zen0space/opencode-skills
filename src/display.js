const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Novice', xpRequired: 0 },
  { level: 2, title: 'Apprentice', xpRequired: 150 },
  { level: 3, title: 'Practitioner', xpRequired: 450 },
  { level: 4, title: 'Expert', xpRequired: 900 },
  { level: 5, title: 'Master', xpRequired: 1500 },
  { level: 6, title: 'Grandmaster', xpRequired: 3000 }
];

const BOX_WIDTH = 40;
const CONTENT_WIDTH = BOX_WIDTH - 2;

export function progressBar(current, max, width = 16) {
  const safeCurrent = Math.max(0, current);
  const safeMax = Math.max(1, max);
  const filled = Math.min(width, Math.round((safeCurrent / safeMax) * width));
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export function getNextLevelXp(currentLevel) {
  const nextLevel = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  return nextLevel ? nextLevel.xpRequired : null;
}

function line(content) {
  const padding = CONTENT_WIDTH - content.length;
  return '║' + content + ' '.repeat(Math.max(0, padding)) + '║';
}

function topBorder() {
  return '╔' + '═'.repeat(CONTENT_WIDTH) + '╗';
}

function bottomBorder() {
  return '╚' + '═'.repeat(CONTENT_WIDTH) + '╝';
}

function divider() {
  return '╠' + '═'.repeat(CONTENT_WIDTH) + '╣';
}

function emptyLine() {
  return '║' + ' '.repeat(CONTENT_WIDTH) + '║';
}

export function showXpGain(amount, reason, data, category = 'security') {
  const { xp, level, title } = data;
  const nextLevelXp = getNextLevelXp(level);
  
  const xpText = `+${amount} XP  ${reason.substring(0, 24)}`;
  const levelText = `Level ${level} - ${title}`;
  
  console.log('');
  console.log(topBorder());
  console.log(line('  ' + xpText));
  console.log(divider());
  console.log(line('  ' + levelText));
  
  if (!nextLevelXp) {
    console.log(line('  [████████████████] MAX LEVEL!'));
  } else {
    const bar = progressBar(xp, nextLevelXp);
    const xpStr = `${xp}/${nextLevelXp}`;
    console.log(line(`  [${bar}] ${xpStr}`));
  }
  
  console.log(bottomBorder());
  console.log('');
}

export function showStats(data, category = 'security') {
  const { xp, level, title, issuesFixed, totalAudits, patternsAdded, mistakes, testsWritten, testsFixed, totalTests } = data;
  const nextLevelXp = getNextLevelXp(level);
  
  const categoryTitle = category === 'testing' ? 'TESTING AGENT' : 'SECURITY AGENT';
  
  const totalFixed = category === 'security' 
    ? ((issuesFixed?.critical || 0) + (issuesFixed?.high || 0) + (issuesFixed?.medium || 0) + (issuesFixed?.low || 0))
    : (testsFixed || 0);
  
  const totalPenalty = mistakes?.totalPenaltyXP || 0;
  
  console.log('');
  console.log(topBorder());
  console.log(line(`        ${categoryTitle}`));
  console.log(divider());
  console.log(line(`  Level ${level} - ${title}`));
  
  if (!nextLevelXp) {
    console.log(line('  XP: [████████████████] MAX LEVEL!'));
  } else {
    const bar = progressBar(xp, nextLevelXp);
    const xpStr = `${xp}/${nextLevelXp}`;
    const percent = Math.round((xp / nextLevelXp) * 100);
    console.log(line(`  XP: [${bar}] ${xpStr}`));
    console.log(line(`  Progress: ${percent}%`));
  }
  
  console.log(emptyLine());
  console.log(line('  Stats:'));
  
  if (category === 'testing') {
    console.log(line(`  * Tests Written:   ${totalTests || 0}`));
    console.log(line(`  * Unit Tests:      ${testsWritten?.unit || 0}`));
    console.log(line(`  * Integration:     ${testsWritten?.integration || 0}`));
    console.log(line(`  * E2E Tests:       ${testsWritten?.e2e || 0}`));
    console.log(line(`  * Tests Fixed:     ${testsFixed || 0}`));
    console.log(line(`  * Patterns Added:  ${patternsAdded || 0}`));
  } else {
    console.log(line(`  * Issues Fixed:    ${totalFixed}`));
    console.log(line(`  * Audits Done:     ${totalAudits || 0}`));
    console.log(line(`  * Patterns Added:  ${patternsAdded || 0}`));
  }
  
  console.log(line(`  * XP Penalties:    ${totalPenalty}`));
  console.log(bottomBorder());
  console.log('');
}

export function showLevelUp(newLevel, newTitle) {
  console.log('');
  console.log(topBorder());
  console.log(emptyLine());
  console.log(line('          LEVEL UP!'));
  console.log(emptyLine());
  console.log(line(`     Level ${newLevel} - ${newTitle}`));
  console.log(emptyLine());
  console.log(bottomBorder());
  console.log('');
}
