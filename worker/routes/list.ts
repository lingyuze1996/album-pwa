import { Hono } from 'hono';
import type { User } from '../../types/user';
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

  const qPage = c.req.query('page');
  const qPageSize = c.req.query('pageSize');
  const page = qPage ? Math.max(1, Number(qPage) || 1) : 1;
  const pageSize = qPageSize ? Math.max(1, Number(qPageSize) || 20) : 20;

  const result = await listMetadataByUser(c.env, createdBy, page, pageSize);
  return c.json({
    items: result.items,
    total: result.total,
    page,
    pageSize,
  });
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
