import { verifyToken } from '../_shared/verify.js';

export const onRequest = async ({ request, env }) => {
  try {
    const auth = request.headers.get('Authorization');
    const token = auth ? auth.split(' ')[1] : null;
    await verifyToken(token, env);

    const res = await env.MY_BUCKET.list({ limit: 100 });
    const items = (res.objects || []).map((o) => ({
      key: o.key,
      size: o.size,
      httpMetadata: o.httpMetadata,
    }));
    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err), { status: 401 });
  }
};
