import { verifyToken } from '../_shared/verify.js';

export const onRequest = async ({ request, env }) => {
  try {
    const auth = request.headers.get('Authorization');
    const token = auth ? auth.split(' ')[1] : null;
    await verifyToken(token, env);

    const form = await request.formData();
    const file = form.get('file');
    if (!file) return new Response('No file provided', { status: 400 });

    const filename =
      file.name || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const arrayBuffer = await file.arrayBuffer();
    await env.MY_BUCKET.put(filename, arrayBuffer, {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
    });

    return new Response(JSON.stringify({ key: filename }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err), { status: 401 });
  }
};
