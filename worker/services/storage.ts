import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let S3: S3Client;

const init = (env: Env) => {
  if (S3) return;

  S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
};

export const signGetUrl = async (env: Env, key: string) => {
  init(env);

  const getUrl = await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: key })
  );

  return getUrl;
};

export const signPutUrl = async (env: Env, key: string, type: string) => {
  init(env);

  const putUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      ContentType: type,
    })
  );

  return putUrl;
};
