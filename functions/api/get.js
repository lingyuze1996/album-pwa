import { verifyToken } from '../_utils/verify.js';
import { getMetadata } from '../_utils/db.js';

export const onRequest = async ({ request, env }) => {
  try {
    const auth = request.headers.get('Authorization');
    const token = auth ? auth.split(' ')[1] : null;
    const username = await verifyToken(token, env);

    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (!key) return new Response('Missing key param', { status: 400 });

    // Ensure the authenticated user owns the object
    const meta = await getMetadata(env, key);
    if (!meta) return new Response('Not found', { status: 404 });
    if (meta.uploadedBy !== username)
      return new Response('Forbidden', { status: 403 });

    const obj = await env.R2.get(key);
    if (!obj) return new Response('Not found', { status: 404 });

    const headers = new Headers();
    if (obj.httpMetadata && obj.httpMetadata.contentType)
      headers.set('Content-Type', obj.httpMetadata.contentType);

    return new Response(obj.body, { status: 200, headers });
  } catch (err) {
    return new Response(String(err), { status: 401 });
  }
};
