#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const resolveDataPath = (relativePath) => path.resolve(projectRoot, relativePath);

const supabaseUrl = process.env.SUPABASE_URL || 'https://daxghztyfchpkdjkguig.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_vHJxQsLDu45SQMZ5aAgIXQ_z5lmof34';
const supabaseEmail = process.env.SUPABASE_EMAIL || 'agentasT@th-ailand.com';
const supabasePassword = process.env.SUPABASE_PASSWORD || 'agentasT321';

const stageTable = process.env.STAGE_TABLE || 'stage_windows';

async function loadJson(relativePath) {
  const filePath = resolveDataPath(relativePath);
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

function normalizeStagePayloads(stageJson) {
  const list = Array.isArray(stageJson)
    ? stageJson
    : Array.isArray(stageJson?.items)
      ? stageJson.items
      : [];
  const syncedAt = (stageJson?.updated_at || stageJson?.updatedAt || new Date().toISOString());
  const payloads = list.map((item, idx) => ({
    stage: item.stage || `ETAPAS ${idx + 1}`,
    window_label: item.window || item.window_label || '',
    start_day: Number(item.start_day) || null,
    end_day: Number(item.end_day) || null,
    focus: item.focus || '',
    order_index: idx + 1
  }));
  return { payloads, syncedAt };
}

async function ensureAuth(client) {
  const { data, error } = await client.auth.signInWithPassword({
    email: supabaseEmail,
    password: supabasePassword
  });
  if (error) {
    throw new Error(`Supabase auth failed: ${error.message}`);
  }
  return data?.user?.id;
}

async function fetchExisting(client) {
  const { data, error } = await client
    .from(stageTable)
    .select('id, stage');
  if (error) {
    throw new Error(`Failed to fetch existing ${stageTable}: ${error.message}`);
  }
  return data || [];
}

async function upsertStageWindows(client, items) {
  if (!items.length) {
    console.log('⚠️  No stage windows to sync – aborting.');
    return { inserted: 0, updated: 0 };
  }
  const existing = await fetchExisting(client);
  const lookup = new Map(existing.map(row => [row.stage, row.id]));

  let inserted = 0;
  let updated = 0;

  for (const item of items) {
    const target = {
      stage: item.stage,
      window_label: item.window_label,
      start_day: item.start_day,
      end_day: item.end_day,
      focus: item.focus,
      order_index: item.order_index
    };
    const existingId = lookup.get(item.stage);
    if (existingId) {
      const { error } = await client
        .from(stageTable)
        .update(target)
        .eq('id', existingId);
      if (error) {
        throw new Error(`Update failed for ${item.stage}: ${error.message}`);
      }
      updated += 1;
    } else {
      const { error } = await client
        .from(stageTable)
        .insert(target);
      if (error) {
        throw new Error(`Insert failed for ${item.stage}: ${error.message}`);
      }
      inserted += 1;
    }
  }
  return { inserted, updated };
}

async function main() {
  console.log('🧭 Stage windows → Supabase sync');
  const client = createClient(supabaseUrl, supabaseKey);
  await ensureAuth(client);

  const [stageJson, itinerary] = await Promise.all([
    loadJson('data/stage_windows.json'),
    loadJson('data/itinerary.json').catch(() => null)
  ]);
  const { payloads, syncedAt } = normalizeStagePayloads(stageJson);
  console.log(`• ${payloads.length} etapų langai iš data/stage_windows.json (updated_at: ${syncedAt})`);

  if (itinerary) {
    const totalDays = Array.isArray(itinerary?.days) ? itinerary.days.length : null;
    if (totalDays) {
      console.log(`• Itinerary turi ${totalDays} dienų (D1–D${totalDays})`);
    }
  }

  const result = await upsertStageWindows(client, payloads);
  console.log(`✅ Sync complete → inserted: ${result.inserted}, updated: ${result.updated}`);
}

main().catch(err => {
  console.error('❌ Sync failed:', err.message);
  process.exitCode = 1;
});
