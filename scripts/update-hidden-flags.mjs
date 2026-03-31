import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://daxghztyfchpkdjkguig.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_vHJxQsLDu45SQMZ5aAgIXQ_z5lmof34';
const SUPABASE_EMAIL = process.env.SUPABASE_EMAIL || 'agentasT@th-ailand.com';
const SUPABASE_PASSWORD = process.env.SUPABASE_AGENT_PASSWORD || process.env.SUPABASE_PASSWORD || 'agentasT321';

function slugify(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

async function readJson(relativePath) {
  const filePath = path.join(projectRoot, relativePath);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function buildOverrideKeys(name = '') {
  const variants = new Set();
  const trimmed = (name || '').trim();
  if (!trimmed) return variants;
  variants.add(trimmed);
  const dotSplit = trimmed.split('·')[0]?.trim();
  if (dotSplit) variants.add(dotSplit);
  const parenSplit = trimmed.split('(')[0]?.trim();
  if (parenSplit) variants.add(parenSplit);
  const pipeSplit = trimmed.split('|')[0]?.trim();
  if (pipeSplit) variants.add(pipeSplit);
  const dashSplit = trimmed.split(' – ')[0]?.trim();
  if (dashSplit) variants.add(dashSplit);
  return Array.from(variants)
    .map(slugify)
    .filter(Boolean);
}

function collectHiddenNames(catalog, overrides) {
  const hiddenNames = new Set();
  const hiddenStages = new Set(['hidden-spots-2026']);

  const overrideHidden = new Set(
    Object.entries(overrides || {})
      .filter(([, entry]) => entry && entry.hidden === true)
      .map(([slug]) => slug)
  );

  (catalog?.stages || []).forEach(stage => {
    const stageId = (stage.id || '').toLowerCase();
    const stageTitle = (stage.title || '').toLowerCase();
    const stageIsHidden = hiddenStages.has(stageId) || stageTitle.includes('hidden');
    (stage.items || []).forEach(item => {
      const name = (item?.name || '').trim();
      if (!name) return;
      let shouldHide = stageIsHidden;
      if (!shouldHide) {
        const keys = buildOverrideKeys(name);
        shouldHide = keys.some(key => overrideHidden.has(key));
      }
      if (!shouldHide) {
        const nameLc = name.toLowerCase();
        shouldHide = nameLc.includes('hidden');
      }
      if (shouldHide) {
        hiddenNames.add(name);
      }
    });
  });

  return hiddenNames;
}

function chunk(array, size = 50) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function main() {
  const [catalog, overrides] = await Promise.all([
    readJson('data/places_catalog.json'),
    readJson('data/places_overrides.json')
  ]);
  const hiddenNames = collectHiddenNames(catalog, overrides);
  console.log(`Identified ${hiddenNames.size} hidden entries.`);

  if (!hiddenNames.size) {
    console.log('Nothing to update.');
    return;
  }

  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  const { error: authError } = await client.auth.signInWithPassword({ email: SUPABASE_EMAIL, password: SUPABASE_PASSWORD });
  if (authError) {
    throw new Error(`Supabase auth failed: ${authError.message}`);
  }

  console.log('Resetting is_hidden=false for all places...');
  const { error: resetError } = await client.from('places').update({ is_hidden: false }).gte('id', 0);
  if (resetError) {
    throw new Error(`Failed to reset flags: ${resetError.message}`);
  }

  const hiddenList = Array.from(hiddenNames);
  const batches = chunk(hiddenList, 50);
  for (const batch of batches) {
    const { error } = await client.from('places').update({ is_hidden: true }).in('name', batch);
    if (error) {
      throw new Error(`Failed to set hidden flag for batch (${batch.join(', ')}): ${error.message}`);
    }
  }

  console.log(`Marked ${hiddenList.length} places as hidden.`);
}

main().catch(err => {
  console.error('❌ Hidden flag sync failed:', err.message);
  process.exitCode = 1;
});
