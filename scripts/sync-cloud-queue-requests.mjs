import { createClient } from '@supabase/supabase-js';

/**
 * One-shot sync: Supabase Cloud -> Supabase Local
 * Table: public.queue_requests
 *
 * Use case:
 * - Cloud is the public intake (web/telegram/whatsapp).
 * - Local is your operational DB.
 * - n8n (running locally) processes local queue_requests into RabbitMQ / quotation-service.
 *
 * Required env vars:
 * - CLOUD_SUPABASE_URL
 * - CLOUD_SUPABASE_SERVICE_ROLE_KEY
 * - LOCAL_SUPABASE_URL
 * - LOCAL_SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional:
 * - SYNC_LIMIT (default: 200)
 * - CLOUD_STATUSES (comma list, default: RECEIVED,PENDING)
 */

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

const cloudUrl = requireEnv('CLOUD_SUPABASE_URL');
const cloudKey = requireEnv('CLOUD_SUPABASE_SERVICE_ROLE_KEY');
const localUrl = requireEnv('LOCAL_SUPABASE_URL');
const localKey = requireEnv('LOCAL_SUPABASE_SERVICE_ROLE_KEY');

const limit = Number(process.env.SYNC_LIMIT || 200);
const statuses = (process.env.CLOUD_STATUSES || 'RECEIVED,PENDING')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const cloud = createClient(cloudUrl, cloudKey, { auth: { persistSession: false } });
const local = createClient(localUrl, localKey, { auth: { persistSession: false } });

async function main() {
  const startedAt = new Date().toISOString();

  // Pull from cloud
  let query = cloud
    .from('queue_requests')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (statuses.length > 0) {
    query = query.in('status', statuses);
  }

  const { data: rows, error } = await query;
  if (error) throw new Error(`Cloud select failed: ${error.message}`);

  if (!rows || rows.length === 0) {
    console.log(`[sync] ${startedAt} no rows to sync`);
    return;
  }

  // Upsert into local
  const { error: upsertError } = await local
    .from('queue_requests')
    .upsert(rows, { onConflict: 'id' });

  if (upsertError) throw new Error(`Local upsert failed: ${upsertError.message}`);

  console.log(`[sync] ${startedAt} synced ${rows.length} rows (statuses: ${statuses.join(',')})`);
}

main().catch((err) => {
  console.error('[sync] failed:', err?.message || err);
  process.exitCode = 1;
});
