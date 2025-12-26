// let initialized = false;

import type { Metadata } from '../../types/metadata';

async function ensureInit(env: Env) {
  console.log('Initializing D1 database schema...');
  // const drop = `DROP TABLE IF EXISTS media`;
  const create = `CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE,
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
    id,
    name,
    size,
    type,
    createdBy,
    createdAt = Date.now(),
    lastModifiedAt = null,
  } = row;
  const stmt = `INSERT INTO media (id, name, size, type, createdBy, createdAt, lastModifiedAt, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  await env.D1.prepare(stmt)
    .bind(
      id,
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

export async function update(env: Env, id: string, key: string, value: any) {
  const stmt = `UPDATE media SET ${key} = ? WHERE id = ?`;
  await env.D1.prepare(stmt).bind(value, id).run();
}

// export async function deleteMetadata(env, key) {
//   await ensureInit(env);
//   await env.D1.prepare('DELETE FROM media WHERE key = ?').bind(key).run();
// }

export async function list(
  env: Env,
  username: string,
  page: number = 1,
  pageSize: number = 20
) {
  await ensureInit(env);

  // get total count
  const countRes = await env.D1.prepare(
    'SELECT COUNT(*) as count FROM media WHERE createdBy = ?'
  )
    .bind(username)
    .run<{ count: number }>();

  const total = countRes?.results?.[0]?.count ?? 0;

  const offset = Math.max(0, (page - 1) * pageSize);

  const stmt =
    'SELECT * FROM media WHERE createdBy = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  const res = await env.D1.prepare(stmt)
    .bind(username, pageSize, offset)
    .run<Metadata>();
  const items = res.results || [];

  return { items, total };
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
