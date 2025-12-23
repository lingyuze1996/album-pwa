import { createMiddleware } from 'hono/factory';
import { getJWKs } from '../utils/jwks';
import { verifyWithJwks } from 'hono/jwt';
import { HTTPException } from 'hono/http-exception';
import type { User } from '../../types/user';

export const cognitoAuth = createMiddleware<{
  Bindings: Env;
  Variables: {
    user: User;
  };
}>(async (c, next) => {
  const token = c.req.header('Authorization')?.split(' ')?.[1];
  if (!token) throw new HTTPException(401, { message: 'Unauthorized' });
  const jwks = await getJWKs(
    `https://cognito-idp.${c.env.COGNITO_REGION}.amazonaws.com/${c.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
  );
  const payload = await verifyWithJwks(token, { keys: jwks.keys });
  c.set('user', {
    username: payload['cognito:username'] as string,
    email: payload['email'] as string,
  });
  await next();
});
