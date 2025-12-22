// let initialized = false;

import type { Metadata } from '../types/metadata';

async function ensureInit(env: Env) {
  console.log('Initializing D1 database schema...');
  // const drop = `DROP TABLE IF EXISTS media`;
  const create = `CREATE TABLE IF NOT EXISTS media (
    key TEXT PRIMARY KEY,
    name TEXT,
    size INTEGER,
    type TEXT,
    createdBy TEXT,
    createdAt INTEGER,
    lastModifiedAt INTEGER,
    status TEXT
  )`;
  // await env.D1.prepare(drop).run();
  await env.D1.prepare(create).run();
}

export async function insert(env: Env, row: Metadata) {
  const {
    key,
    name,
    size,
    type,
    createdBy,
    createdAt = Date.now(),
    lastModifiedAt = null,
  } = row;
  const stmt = `INSERT OR REPLACE INTO media (key, name, size, type, createdBy, createdAt, lastModifiedAt, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  await env.D1.prepare(stmt)
    .bind(
      key,
      name,
      size,
      type,
      createdBy,
      createdAt,
      lastModifiedAt || createdAt,
      'pending'
    )
    .run();
}

// export async function deleteMetadata(env, key) {
//   await ensureInit(env);
//   await env.D1.prepare('DELETE FROM media WHERE key = ?').bind(key).run();
// }

export async function list(env: Env, username: string) {
  await ensureInit(env);

  const res = await env.D1.prepare(
    'SELECT * FROM media WHERE createdBy = ? ORDER BY createdAt DESC'
  )
    .bind(username)
    .run<Metadata>();
  return res.results || [];
}

// export async function getMetadata(env, key) {
//   await ensureInit(env);
//   const res = await env.D1.prepare(
//     'SELECT key, size, contentType, uploadedBy, createdAt FROM media WHERE key = ?'
//   )
//     .bind(key)
//     .all();
//   return (res.results && res.results[0]) || null;
// }
