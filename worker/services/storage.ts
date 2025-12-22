// import {
//   S3Client,
//   GetObjectCommand,
//   PutObjectCommand,
// } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// const S3 = new S3Client({
//   region: 'auto',
//   endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: '<ACCESS_KEY_ID>',
//     secretAccessKey: '<SECRET_ACCESS_KEY>',
//   },
// });

// // Generate presigned URL for reading (GET)
// const getUrl = await getSignedUrl(
//   S3,
//   new GetObjectCommand({ Bucket: 'my-bucket', Key: 'image.png' }),
//   { expiresIn: 3600 } // Valid for 1 hour
// );
// // https://my-bucket.<ACCOUNT_ID>.r2.cloudflarestorage.com/image.png?X-Amz-Algorithm=...

// // Generate presigned URL for writing (PUT)
// // Specify ContentType to restrict uploads to a specific file type
// const putUrl = await getSignedUrl(
//   S3,
//   new PutObjectCommand({
//     Bucket: 'my-bucket',
//     Key: 'image.png',
//     ContentType: 'image/png',
//   }),
//   { expiresIn: 3600 }
// );
