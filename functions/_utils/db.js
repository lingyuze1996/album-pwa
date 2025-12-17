let initialized = false;

async function ensureInit(env) {
  if (initialized) return;
  console.log('Initializing D1 database schema...');

  const create = `CREATE TABLE IF NOT EXISTS media (
    key TEXT PRIMARY KEY,
    size INTEGER,
    contentType TEXT,
    uploadedBy TEXT,
    createdAt INTEGER
  )`;
  await env.D1.prepare(create).run();
  initialized = true;
}

export async function insertMetadata(env, row) {
  await ensureInit(env);
  const {
    key,
    size = null,
    contentType = null,
    uploadedBy = null,
    createdAt = Date.now(),
  } = row;
  const stmt = `INSERT OR REPLACE INTO media (key, size, contentType, uploadedBy, createdAt) VALUES (?, ?, ?, ?, ?)`;
  await env.D1.prepare(stmt)
    .bind(key, size, contentType, uploadedBy, createdAt)
    .run();
}

export async function deleteMetadata(env, key) {
  await ensureInit(env);
  await env.D1.prepare('DELETE FROM media WHERE key = ?').bind(key).run();
}

export async function listMetadataByUser(env, username) {
  await ensureInit(env);
  const res = await env.D1.prepare(
    'SELECT key, size, contentType, uploadedBy, createdAt FROM media WHERE uploadedBy = ? ORDER BY createdAt DESC'
  )
    .bind(username)
    .all();
  return res.results || [];
}

export async function getMetadata(env, key) {
  await ensureInit(env);
  const res = await env.D1.prepare(
    'SELECT key, size, contentType, uploadedBy, createdAt FROM media WHERE key = ?'
  )
    .bind(key)
    .all();
  return (res.results && res.results[0]) || null;
}
