import { Hono } from 'hono';
import type { User } from '../types/user';
import { insert } from '../services/database';

const upload = new Hono<{
  Bindings: Env;
  Variables: {
    user: User;
  };
}>();

upload.post('/init', async (c) => {
  const user = c.get('user');
  const createdBy = user.username;

  const body = await c.req.json();
  await insert(c.env, {
    createdBy,
    key: body.name,
    name: body.name,
    size: body.size,
    type: body.type,
    createdAt: Date.now(),
    lastModifiedAt: body.lastModified,
  });
  return c.json({ status: 'pending' });
});

// upload.post('/data', async (c) => {

//   const body = await c.req.json();
//   await insert(c.env, {
//     createdBy,
//     key: body.name,
//     name: body.name,
//     size: body.size,
//     type: body.type,
//     createdAt: Date.now(),
//     lastModifiedAt: body.lastModified,
//   });
//   return c.json({ success: true });
// });

export default upload;
