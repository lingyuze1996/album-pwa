import type { HonoJsonWebKey } from 'hono/utils/jwt/jws';

export const getJWKs = async (
  jwksUrl: string
): Promise<{ keys: HonoJsonWebKey[] }> => {
  const cache = caches.default;
  const req = new Request(jwksUrl);

  const cached = await cache.match(req);
  console.info('JWKS cache hit: ', Boolean(cached));
  if (cached) {
    return cached.json();
  }

  const cacheable = await fetch(req);
  await cache.put(req, cacheable.clone());
  return cacheable.json();
};
