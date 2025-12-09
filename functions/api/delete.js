import { verifyToken } from '../_shared/verify.js';

export const onRequest = async ({ request, env }) => {
  try {
    const auth = request.headers.get('Authorization');
    const token = auth ? auth.split(' ')[1] : null;
    await verifyToken(token, env);

    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (!key) return new Response('Missing key param', { status: 400 });

    await env.MY_BUCKET.delete(key);
    return new Response(JSON.stringify({ deleted: key }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err), { status: 401 });
  }
};
