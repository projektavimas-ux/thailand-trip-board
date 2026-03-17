import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function slugify(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function flattenCatalog(catalog) {
  const rows = [];
  catalog.stages?.forEach((stage) => {
    const stageId = stage.title || stage.id || '';
    stage.items?.forEach((item, index) => {
      rows.push({
        name: item.name ?? '',
        description: item.desc ?? '',
        image_url: item.image ?? '',
        stage: stageId,
      });
    });
  });
  return rows;
}

async function main() {
  const supabaseUrl = 'https://daxghztyfchpkdjkguig.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRheGdoenR5ZmNocGtkamtndWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzUyNzUsImV4cCI6MjA4Nzg1MTI3NX0.vF99wRWNkWZcsqnTDL3dlACpHpF3GSpzlfUp6rdM_Ng';
  
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });

  const { data: authData, error: authError } = await client.auth.signInWithPassword({
    email: 'agentasT@th-ailand.com',
    password: 'agentasT321'
  });

  if (authError) {
    console.error('Auth error:', authError);
    return;
  }

  const raw = await fs.readFile(path.join(projectRoot, 'data', 'places_catalog.json'), 'utf8');
  const catalog = JSON.parse(raw);
  const rows = flattenCatalog(catalog);
  
  // Tag rows with creator
  const user = authData.user;
  rows.forEach(r => r.created_by = user.id);

  // We have a problem: `upsert` needs a unique key. 
  // Let's read existing places to prevent duplicates.
  const { data: existingPlaces } = await client.from('places').select('id, name, stage');
  
  for (const row of rows) {
    const existing = existingPlaces?.find(p => p.name === row.name);
    if (existing) {
      // Update existing
      await client.from('places').update({
        description: row.description,
        image_url: row.image_url,
        stage: row.stage
      }).eq('id', existing.id);
    } else {
      // Insert new
      await client.from('places').insert([row]);
    }
  }

  console.log(`Synced ${rows.length} places to Supabase.`);
}

main().catch(console.error);
