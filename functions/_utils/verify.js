import { CognitoJwtVerifier } from 'aws-jwt-verify';

// Cache verifiers per (userPoolId, clientId, tokenUse) key to avoid recreating
const verifierCache = new Map();

export async function verifyToken(token, env, tokenUse = 'id') {
  if (!token) throw new Error('Missing token');
  const userPoolId = env.COGNITO_USER_POOL_ID;
  const clientId = env.COGNITO_CLIENT_ID;
  const cacheKey = `${userPoolId}::${clientId}::${tokenUse}`;

  let verifier = verifierCache.get(cacheKey);
  if (!verifier) {
    verifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse,
      clientId,
    });
    verifierCache.set(cacheKey, verifier);
  }

  // verify throws if invalid
  const payload = await verifier.verify(token);
  return payload['cognito:username'];
}
