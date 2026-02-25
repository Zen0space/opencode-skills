import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

export const FILE_STATE = {
  NEW: 'new',
  UNMODIFIED: 'unmodified',
  MODIFIED: 'modified',
  DELETED: 'deleted',
};

export const FILE_CATEGORY = {
  XP_DATA: 'xp_data',
  MEMORIES: 'memories',
  KNOWLEDGE: 'knowledge',
  SKILL: 'skill',
  AGENT: 'agent',
};

const PROTECTED_CATEGORIES = [FILE_CATEGORY.XP_DATA, FILE_CATEGORY.MEMORIES];
const SMART_MERGE_CATEGORIES = [FILE_CATEGORY.XP_DATA, FILE_CATEGORY.MEMORIES, FILE_CATEGORY.KNOWLEDGE];

function hashFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return crypto.createHash('md5').update(content).digest('hex');
}

function getCategory(relativePath) {
  const pathLower = relativePath.toLowerCase();
  
  if (pathLower.includes('/xp.json') || pathLower.endsWith('xp.json')) {
    return FILE_CATEGORY.XP_DATA;
  }
  if (pathLower.includes('/memories/') || pathLower.includes('memories/')) {
    return FILE_CATEGORY.MEMORIES;
  }
  if (pathLower.includes('/knowledge.md')) {
    return FILE_CATEGORY.KNOWLEDGE;
  }
  if (pathLower.includes('/skills/')) {
    return FILE_CATEGORY.SKILL;
  }
  if (pathLower.includes('/agents/')) {
    return FILE_CATEGORY.AGENT;
  }
  return FILE_CATEGORY.SKILL;
}

function compareVersion(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}

function smartMergeXp(userXp, templateXp) {
  const preserveFields = [
    'xp', 'totalTests', 'totalAudits',
    'testsWritten', 'issuesFixed', 'testsFixed', 'patternsAdded',
    'completedSuites', 'completedAudits', 'seenPatterns', 'seenIssues',
    'mistakes', 'mistakeHistory', 'levelHistory'
  ];
  
  let merged = { ...templateXp };
  
  for (const field of preserveFields) {
    if (userXp[field] !== undefined) {
      merged[field] = userXp[field];
    }
  }
  
  merged.xpTable = templateXp.xpTable;
  merged.levelThresholds = templateXp.levelThresholds;
  
  const userXpValue = userXp.xp || 0;
  merged.xp = userXpValue;
  
  const thresholds = templateXp.levelThresholds || [];
  let newLevel = 1;
  let newTitle = 'Novice';
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (userXpValue >= thresholds[i].xpRequired) {
      newLevel = thresholds[i].level;
      newTitle = thresholds[i].title;
      break;
    }
  }
  merged.level = newLevel;
  merged.title = newTitle;
  
  return merged;
}

function getSmartMergePreserveInfo(userXp, templateXp) {
  const preserveFields = [
    'xp', 'level', 'title', 'totalTests', 'totalAudits',
    'testsWritten', 'issuesFixed', 'testsFixed', 'patternsAdded'
  ];
  
  const preserved = [];
  for (const field of preserveFields) {
    if (userXp[field] !== undefined && userXp[field] !== 0) {
      if (field === 'xp') {
        preserved.push(`XP ${userXp[field]}`);
      } else if (field === 'level') {
        preserved.push(`level ${userXp[field]}`);
      } else if (field === 'title') {
        preserved.push(`title: ${userXp[field]}`);
      } else if (field === 'totalTests') {
        preserved.push(`tests: ${userXp[field]}`);
      } else if (field === 'testsWritten' && userXp.testsWritten) {
        const total = (userXp.testsWritten.unit || 0) + (userXp.testsWritten.integration || 0) + (userXp.testsWritten.e2e || 0);
        if (total > 0) preserved.push(`tests: ${total}`);
      } else if (field === 'issuesFixed' && userXp.issuesFixed) {
        const total = (userXp.issuesFixed.critical || 0) + (userXp.issuesFixed.high || 0) + (userXp.issuesFixed.medium || 0) + (userXp.issuesFixed.low || 0);
        if (total > 0) preserved.push(`fixed: ${total}`);
      } else if (field === 'patternsAdded' && userXp.patternsAdded > 0) {
        preserved.push(`patterns: ${userXp[field]}`);
      }
    }
  }
  
  return preserved.length > 0 ? preserved.join(', ') : 'preserved';
}

function smartMergeMemories(userContent, templateContent) {
  const templateSections = {};
  const userSections = {};
  
  const parseSections = (content) => {
    const sections = {};
    const lines = content.split('\n');
    let currentSection = null;
    let currentLines = [];
    
    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (headerMatch) {
        if (currentSection) {
          sections[currentSection] = currentLines.join('\n').trim();
        }
        currentSection = headerMatch[2];
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    }
    if (currentSection) {
      sections[currentSection] = currentLines.join('\n').trim();
    }
    return sections;
  };
  
  const templateParsed = parseSections(templateContent);
  const userParsed = parseSections(userContent);
  
  let merged = '';
  const preservedSections = [];
  
  for (const sectionName of Object.keys(templateParsed)) {
    if (userParsed[sectionName] && userParsed[sectionName].length > templateParsed[sectionName].length * 0.5) {
      merged += `${templateParsed[sectionName].split('\n')[0]}\n${userParsed[sectionName]}\n`;
      preservedSections.push(sectionName);
    } else {
      merged += templateParsed[sectionName] + '\n';
    }
  }
  
  return {
    content: merged.trim(),
    preservedSections
  };
}

function smartMergeKnowledge(userContent, templateContent) {
  const userLines = userContent.split('\n');
  const templateLines = templateContent.split('\n');
  
  const userEntries = new Set();
  const newEntries = [];
  
  let currentTable = null;
  let inUserTable = false;
  
  for (const line of userLines) {
    if (line.includes('|') && line.includes('---')) {
      if (!inUserTable) inUserTable = true;
      continue;
    }
    if (inUserTable && line.includes('|')) {
      const cells = line.split('|').filter(c => c.trim());
      if (cells.length >= 2 && !line.includes('Date') && !line.includes('---')) {
        const entry = cells[1].trim();
        if (entry && entry !== 'Mistake' && entry !== 'Pattern') {
          userEntries.add(entry);
        }
      }
    }
  }
  
  let merged = '';
  let newLessonsCount = 0;
  let addedNewSection = false;
  
  for (const line of templateLines) {
    if (line.includes('|') && line.includes('---')) {
      merged += line + '\n';
      continue;
    }
    
    if (line.includes('|') && !userEntries.has(line.split('|')[1]?.trim())) {
      merged += line + '\n';
      newLessonsCount++;
    } else if (line.includes('|') && userEntries.has(line.split('|')[1]?.trim())) {
      // Skip - user has this entry
    } else {
      merged += line + '\n';
    }
  }
  
  return {
    content: merged.trim(),
    newEntriesCount: newLessonsCount
  };
}

function getAllTemplateFiles(srcDir, baseDir = '') {
  const files = [];
  if (!fs.existsSync(srcDir)) return files;
  
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git') continue;
    
    const relativePath = path.join(baseDir, entry.name);
    const srcPath = path.join(srcDir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...getAllTemplateFiles(srcPath, relativePath));
    } else {
      files.push(relativePath);
    }
  }
  return files;
}

function getVersion(filePath) {
  if (!fs.existsSync(filePath)) return '0.0.0';
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  const firstLine = content.split('\n')[0];
  return firstLine.split(':')[0].trim();
}

function getChangelog(filePath) {
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf-8').trim();
}

export async function checkForUpdates(targetDir) {
  const versionFile = path.join(targetDir, '.ocs-version');
  const currentVersion = getVersion(versionFile);
  
  const templateVersion = getVersion(path.join(TEMPLATES_DIR, '.ocs-version'));
  
  const comparison = compareVersion(templateVersion, currentVersion);
  
  if (comparison <= 0) {
    return {
      hasUpdates: false,
      currentVersion,
      templateVersion,
      changes: []
    };
  }
  
  const templateFiles = getAllTemplateFiles(TEMPLATES_DIR);
  const changes = [];
  
  for (const relativePath of templateFiles) {
    const templatePath = path.join(TEMPLATES_DIR, relativePath);
    const targetPath = path.join(targetDir, relativePath);
    
    const templateHash = hashFile(templatePath);
    const targetHash = hashFile(targetPath);
    const category = getCategory(relativePath);
    
    let state;
    if (!targetHash) {
      state = FILE_STATE.NEW;
    } else if (templateHash === targetHash) {
      state = FILE_STATE.UNMODIFIED;
    } else {
      state = FILE_STATE.MODIFIED;
    }
    
    changes.push({
      relativePath,
      category,
      state,
      templateHash,
      targetHash
    });
  }
  
  return {
    hasUpdates: comparison > 0,
    currentVersion,
    templateVersion,
    changes
  };
}

export async function performUpdate(targetDir, options = {}) {
  const { force = false, checkOnly = false } = options;
  
  const versionFile = path.join(targetDir, '.ocs-version');
  const currentVersion = getVersion(versionFile);
  const templateVersion = getVersion(path.join(TEMPLATES_DIR, '.ocs-version'));
  
  if (compareVersion(templateVersion, currentVersion) <= 0 && !force) {
    console.log(`  Already up to date (v${currentVersion})\n`);
    return { updated: false, changes: [] };
  }
  
  const templateFiles = getAllTemplateFiles(TEMPLATES_DIR);
  
  const results = {
    updated: [],
    added: [],
    conflicts: [],
    skipped: [],
    merged: []
  };
  
  for (const relativePath of templateFiles) {
    const templatePath = path.join(TEMPLATES_DIR, relativePath);
    const targetPath = path.join(targetDir, relativePath);
    const category = getCategory(relativePath);
    
    const isVersionFile = relativePath === '.ocs-version';
    const templateHash = hashFile(templatePath);
    const targetHash = hashFile(targetPath);
    
    if (!targetHash) {
      if (!checkOnly) {
        const destDir = path.dirname(targetPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(templatePath, targetPath);
      }
      results.added.push(relativePath);
      continue;
    }
    
    if (isVersionFile) {
      if (!checkOnly) {
        fs.copyFileSync(templatePath, targetPath);
      }
      results.updated.push(relativePath);
      continue;
    }
    
    if (SMART_MERGE_CATEGORIES.includes(category)) {
      if (category === FILE_CATEGORY.XP_DATA) {
        const userXp = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
        const templateXp = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
        
        const preserveInfo = getSmartMergePreserveInfo(userXp, templateXp);
        
        if (!checkOnly) {
          const merged = smartMergeXp(userXp, templateXp);
          fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2));
        }
        
        results.merged.push({ path: relativePath, action: 'smart-merged', preserveInfo });
        continue;
      }
      
      if (category === FILE_CATEGORY.MEMORIES) {
        const userContent = fs.readFileSync(targetPath, 'utf-8');
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        
        const mergeResult = smartMergeMemories(userContent, templateContent);
        
        if (!checkOnly) {
          fs.writeFileSync(targetPath, mergeResult.content, 'utf-8');
        }
        
        results.merged.push({ 
          path: relativePath, 
          action: 'smart-merged', 
          preserveInfo: mergeResult.preservedSections.join(', ')
        });
        continue;
      }
      
      if (category === FILE_CATEGORY.KNOWLEDGE) {
        const userContent = fs.readFileSync(targetPath, 'utf-8');
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        
        const mergeResult = smartMergeKnowledge(userContent, templateContent);
        
        if (!checkOnly) {
          fs.writeFileSync(targetPath, mergeResult.content, 'utf-8');
        }
        
        results.merged.push({ 
          path: relativePath, 
          action: 'smart-merged', 
          preserveInfo: `${mergeResult.newEntriesCount} new entries`
        });
        continue;
      }
    }
    
    if (PROTECTED_CATEGORIES.includes(category)) {
      results.skipped.push({ path: relativePath, reason: 'protected (user data)' });
      continue;
    }
    
    if (templateHash === targetHash) {
      if (!checkOnly) {
        fs.copyFileSync(templatePath, targetPath);
      }
      results.updated.push(relativePath);
      continue;
    }
    
    if (SMART_MERGE_CATEGORIES.includes(category)) {
      if (category === FILE_CATEGORY.XP_DATA) {
        const userXp = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
        const templateXp = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
        
        const preserveInfo = getSmartMergePreserveInfo(userXp, templateXp);
        
        if (!checkOnly) {
          const merged = smartMergeXp(userXp, templateXp);
          fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2));
        }
        
        results.merged.push({ path: relativePath, action: 'smart-merged', preserveInfo });
        continue;
      }
      
      if (category === FILE_CATEGORY.MEMORIES) {
        const userContent = fs.readFileSync(targetPath, 'utf-8');
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        
        const mergeResult = smartMergeMemories(userContent, templateContent);
        
        if (!checkOnly) {
          fs.writeFileSync(targetPath, mergeResult.content, 'utf-8');
        }
        
        results.merged.push({ 
          path: relativePath, 
          action: 'smart-merged', 
          preserveInfo: mergeResult.preservedSections.join(', ')
        });
        continue;
      }
      
      if (category === FILE_CATEGORY.KNOWLEDGE) {
        const userContent = fs.readFileSync(targetPath, 'utf-8');
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        
        const mergeResult = smartMergeKnowledge(userContent, templateContent);
        
        if (!checkOnly) {
          fs.writeFileSync(targetPath, mergeResult.content, 'utf-8');
        }
        
        results.merged.push({ 
          path: relativePath, 
          action: 'smart-merged', 
          preserveInfo: `${mergeResult.newEntriesCount} new entries`
        });
        continue;
      }
    }
    
    if (checkOnly) {
      results.conflicts.push({ path: relativePath, category });
      continue;
    }
    
    results.conflicts.push({ path: relativePath, category, needsPrompt: true });
  }
  
  if (!checkOnly) {
    fs.writeFileSync(versionFile, templateVersion, 'utf-8');
  }
  
  return {
    updated: true,
    currentVersion,
    templateVersion,
    results
  };
}

export function formatUpdateSummary(updateResult, checkOnly = false) {
  const { results, templateVersion } = updateResult;
  
  console.log('');
  
  if (checkOnly) {
    console.log(`  Template version: v${templateVersion}`);
    console.log(`  Status: ${updateResult.hasUpdates ? 'Update available' : 'Up to date'}`);
  } else {
    console.log(`  Updated to v${templateVersion}`);
  }
  
  if (results.added.length > 0) {
    console.log(`\n  Added (${results.added.length}):`);
    for (const file of results.added.slice(0, 5)) {
      console.log(`    + ${file}`);
    }
    if (results.added.length > 5) {
      console.log(`    ... and ${results.added.length - 5} more`);
    }
  }
  
  if (results.updated.length > 0) {
    console.log(`\n  Updated (${results.updated.length}):`);
    for (const file of results.updated.slice(0, 5)) {
      console.log(`    ~ ${file}`);
    }
    if (results.updated.length > 5) {
      console.log(`    ... and ${results.updated.length - 5} more`);
    }
  }
  
  if (results.merged.length > 0) {
    console.log(`\n  Smart Merged (${results.merged.length}):`);
    for (const file of results.merged.slice(0, 4)) {
      const info = file.preserveInfo ? ` (${file.preserveInfo})` : '';
      console.log(`    ◊ ${file.path}${info}`);
    }
    if (results.merged.length > 4) {
      console.log(`    ... and ${results.merged.length - 4} more`);
    }
  }
  
  if (results.skipped.length > 0) {
    console.log(`\n  Skipped - protected (${results.skipped.length}):`);
    for (const file of results.skipped.slice(0, 3)) {
      console.log(`    ⊘ ${file.path} (${file.reason})`);
    }
    if (results.skipped.length > 3) {
      console.log(`    ... and ${results.skipped.length - 3} more`);
    }
  }
  
  if (results.conflicts.length > 0) {
    console.log(`\n  Conflicts (${results.conflicts.length}):`);
    for (const file of results.conflicts.slice(0, 5)) {
      console.log(`    ⚠ ${file.path}`);
    }
    if (results.conflicts.length > 5) {
      console.log(`    ... and ${results.conflicts.length - 5} more`);
    }
    console.log(`\n  Run without --check to resolve conflicts`);
  }
  
  console.log('');
}
