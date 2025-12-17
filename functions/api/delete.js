import { verifyToken } from '../_utils/verify.js';
import { deleteMetadata } from '../_utils/db.js';

export const onRequest = async ({ request, env }) => {
  try {
    const auth = request.headers.get('Authorization');
    const token = auth ? auth.split(' ')[1] : null;
    await verifyToken(token, env);

    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (!key) return new Response('Missing key param', { status: 400 });

    await env.R2.delete(key);
    try {
      await deleteMetadata(env, key);
    } catch (e) {
      // ignore DB errors
    }
    return new Response(JSON.stringify({ deleted: key }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err), { status: 401 });
  }
};
