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
const MERGE_CATEGORIES = [FILE_CATEGORY.KNOWLEDGE];

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

function findNewSections(oldContent, newContent) {
  const newLines = newContent.split('\n');
  const oldLines = oldContent.split('\n');
  const newSections = [];
  
  let inNewSection = false;
  let newSectionStart = -1;
  
  for (let i = 0; i < newLines.length; i++) {
    const line = newLines[i];
    const isHeader = /^#{1,3}\s+/.test(line);
    
    if (isHeader && !oldContent.includes(line)) {
      if (inNewSection && newSectionStart > -1) {
        newSections.push(newLines.slice(newSectionStart, i).join('\n'));
      }
      newSectionStart = i;
      inNewSection = true;
    }
  }
  
  if (inNewSection && newSectionStart > -1) {
    newSections.push(newLines.slice(newSectionStart).join('\n'));
  }
  
  return newSections;
}

function mergeKnowledgeFiles(userContent, templateContent) {
  const newSections = findNewSections(userContent, templateContent);
  
  if (newSections.length === 0) {
    return { action: 'unchanged', content: userContent };
  }
  
  let merged = userContent;
  
  for (const section of newSections) {
    merged += '\n\n---\n\n' + section;
  }
  
  return { action: 'merged', content: merged };
}

export async function checkForUpdates(targetDir) {
  const versionFile = path.join(targetDir, '.ocs-version');
  const currentVersion = fs.existsSync(versionFile) 
    ? fs.readFileSync(versionFile, 'utf-8').trim()
    : '0.0.0';
  
  const templateVersion = fs.readFileSync(path.join(TEMPLATES_DIR, '.ocs-version'), 'utf-8').trim();
  
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
  const currentVersion = fs.existsSync(versionFile) 
    ? fs.readFileSync(versionFile, 'utf-8').trim()
    : '0.0.0';
  
  const templateVersion = fs.readFileSync(path.join(TEMPLATES_DIR, '.ocs-version'), 'utf-8').trim();
  
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
    
    if (MERGE_CATEGORIES.includes(category)) {
      const userContent = fs.readFileSync(targetPath, 'utf-8');
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      
      const mergeResult = mergeKnowledgeFiles(userContent, templateContent);
      
      if (mergeResult.action === 'merged' && !checkOnly) {
        fs.writeFileSync(targetPath, mergeResult.content, 'utf-8');
      }
      
      results.merged.push({ path: relativePath, sectionsAdded: mergeResult.action === 'merged' ? 1 : 0 });
      continue;
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
    console.log(`\n  Merged (${results.merged.length}):`);
    for (const file of results.merged.slice(0, 3)) {
      console.log(`    ◊ ${file.path}`);
    }
    if (results.merged.length > 3) {
      console.log(`    ... and ${results.merged.length - 3} more`);
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
