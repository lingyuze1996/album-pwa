import { Hono } from 'hono';
import type { User } from '../types/user';
import { list as listMetadataByUser } from '../services/database';

const list = new Hono<{
  Bindings: Env;
  Variables: {
    user: User;
  };
}>();

list.get('/', async (c) => {
  const user = c.get('user');
  const createdBy = user.username;
  const items = await listMetadataByUser(c.env, createdBy);
  return c.json(items);
});

// export const onRequest = async ({ request, env }) => {
//   try {
//     const token = request.headers.get('Authorization')?.split(' ')?.[1];
//     const username = await verifyToken(token, env);

//     // Use D1 metadata for listing
//     const items = await listMetadataByUser(env, username);
//     return new Response(JSON.stringify(items), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (err) {
//     return new Response(String(err), { status: 401 });
//   }
// };

export default list;
