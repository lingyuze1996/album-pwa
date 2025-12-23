import { Hono } from 'hono';
import type { User } from '../../types/user';
import { insert, update } from '../services/database';
import { signPutUrl } from '../services/storage';

const upload = new Hono<{
  Bindings: Env;
  Variables: {
    user: User;
  };
}>();

upload.post('/init', async (c) => {
  const user = c.get('user');
  const createdBy = user.username;
  const id = crypto.randomUUID();
  const objectKey = `${id}/original`;

  const body = await c.req.json();
  await insert(c.env, {
    createdBy,
    id,
    name: body.name,
    size: body.size,
    type: body.type,
    createdAt: Date.now(),
    lastModifiedAt: body.lastModified,
  });

  const putUrl = await signPutUrl(c.env, objectKey, body.type);
  return c.json({ status: 'pending', uploadUrl: putUrl, id });
});

upload.put('/complete', async (c) => {
  const body = await c.req.json();

  const id = body.id;
  await update(c.env, id, 'status', 'complete');
  return c.json({ status: 'complete', id });
});

export default upload;
