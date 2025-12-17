import { verifyToken } from '../_utils/verify.js';
import { insertMetadata } from '../_utils/db.js';

export const onRequest = async ({ request, env }) => {
  try {
    const auth = request.headers.get('Authorization');
    const token = auth ? auth.split(' ')[1] : null;
    const username = await verifyToken(token, env);

    const form = await request.formData();
    const file = form.get('file');
    if (!file) return new Response('No file provided', { status: 400 });

    const filename =
      file.name || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const key = `raw/${username}/${filename}`;

    const contentType = file.type || 'application/octet-stream';
    // Try to get size if available
    const size = file.size || null;

    await env.R2.put(key, file.stream(), {
      httpMetadata: { contentType },
    });

    // Record metadata in D1 (best-effort)
    try {
      await insertMetadata(env, {
        key,
        size,
        contentType,
        uploadedBy: username,
        createdAt: Date.now(),
      });
    } catch (e) {
      // ignore DB errors
    }

    return new Response(JSON.stringify({ filename, key }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err), { status: 401 });
  }
};
