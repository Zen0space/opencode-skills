const BOX_WIDTH = 40;
const CONTENT_WIDTH = BOX_WIDTH - 2;

const CATEGORY_CONFIG = {
  security: {
    title: 'SECURITY AGENT',
    getStats: (data) => {
      const totalFixed = (data.issuesFixed?.critical || 0) +
                         (data.issuesFixed?.high || 0) +
                         (data.issuesFixed?.medium || 0) +
                         (data.issuesFixed?.low || 0);
      return [
        { label: 'Issues Fixed', value: totalFixed },
        { label: 'Critical',     value: data.issuesFixed?.critical || 0 },
        { label: 'High',         value: data.issuesFixed?.high || 0 },
        { label: 'Medium',       value: data.issuesFixed?.medium || 0 },
        { label: 'Low',          value: data.issuesFixed?.low || 0 },
      ];
    }
  },
  testing: {
    title: 'TESTING AGENT',
    getStats: (data) => [
      { label: 'Unit Tests',   value: data.testsWritten?.unit || 0 },
      { label: 'Integration',  value: data.testsWritten?.integration || 0 },
      { label: 'E2E Tests',    value: data.testsWritten?.e2e || 0 },
      { label: 'Tests Fixed',  value: data.testsFixed || 0 },
    ]
  },
  'code-review': {
    title: 'CODE REVIEW AGENT',
    getStats: (data) => {
      const totalFixed = (data.issuesFixed?.critical || 0) +
                         (data.issuesFixed?.high || 0) +
                         (data.issuesFixed?.medium || 0) +
                         (data.issuesFixed?.low || 0);
      return [
        { label: 'Issues Fixed', value: totalFixed },
        { label: 'Critical',     value: data.issuesFixed?.critical || 0 },
        { label: 'High',         value: data.issuesFixed?.high || 0 },
        { label: 'Medium',       value: data.issuesFixed?.medium || 0 },
        { label: 'Low',          value: data.issuesFixed?.low || 0 },
      ];
    }
  },
  docs: {
    title: 'DOCUMENTATION AGENT',
    getStats: (data) => [
      { label: 'Sections',   value: data.docsWritten?.sections || 0 },
      { label: 'Tutorials',  value: data.docsWritten?.tutorials || 0 },
      { label: 'API Docs',   value: data.docsWritten?.apiDocs || 0 },
    ]
  }
};

export function progressBar(current, max, width = 16) {
  const safeCurrent = Math.max(0, current);
  const safeMax = Math.max(1, max);
  const filled = Math.min(width, Math.round((safeCurrent / safeMax) * width));
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export function getNextLevelXp(currentLevel, levelThresholds) {
  const nextLevel = levelThresholds?.find(t => t.level === currentLevel + 1);
  return nextLevel ? nextLevel.xpToNextLevel : null;
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
  const { xp, level, title, levelThresholds } = data;
  const nextLevelXp = getNextLevelXp(level, levelThresholds);
  
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
  const { xp, level, title, mistakes, levelThresholds } = data;
  const nextLevelXp = getNextLevelXp(level, levelThresholds);
  
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.security;
  const categoryTitle = config.title;
  const stats = config.getStats(data);
  
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
  
  for (const stat of stats) {
    const label = stat.label.padEnd(14);
    console.log(line(`  * ${label}${stat.value}`));
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
