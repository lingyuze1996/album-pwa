import { verifyToken } from '../_utils/verify.js';
import { listMetadataByUser } from '../_utils/db.js';

export const onRequest = async ({ request, env }) => {
  try {
    const token = request.headers.get('Authorization')?.split(' ')?.[1];
    const username = await verifyToken(token, env);

    // Use D1 metadata for listing
    const items = await listMetadataByUser(env, username);
    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err), { status: 401 });
  }
};
