import { createClient } from '@supabase/supabase-js';
import process from 'node:process';

const supabaseUrl = process.env.SUPABASE_URL || 'https://daxghztyfchpkdjkguig.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_vHJxQsLDu45SQMZ5aAgIXQ_z5lmof34';

const client = createClient(supabaseUrl, supabaseKey);

async function main() {
  const sql = `
  create table if not exists public.stage_windows (
    id bigint generated always as identity primary key,
    stage text not null unique,
    window_label text,
    start_day int,
    end_day int,
    focus text,
    order_index int default 0,
    created_at timestamptz default now()
  );

  create index if not exists stage_windows_order_idx on public.stage_windows(order_index);

  alter table public.stage_windows enable row level security;
  create policy "read stage_windows" on public.stage_windows for select to anon, authenticated using (true);
  create policy "insert stage_windows" on public.stage_windows for insert to authenticated with check (true);
  create policy "update stage_windows" on public.stage_windows for update to authenticated using (true);
  create policy "delete stage_windows" on public.stage_windows for delete to authenticated using (true);
  `;
  
  // Try to use rpc to execute sql if a function exists
  const { data, error } = await client.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.error('Failed to create table via RPC exec_sql. Supabase might not have this RPC function. Error:', error);
  } else {
    console.log('Successfully created stage_windows table.', data);
  }
}

main();
