const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const REGION = process.env.AWS_REGION!;

export function getPublicUrl(key: string): string {
  // encodeURIComponent handles spaces and special characters in the key —
  // a raw key like "public/my photo.jpg" produces an invalid URL without it

  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${encodedKey}`;
}



// const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN!; // e.g. "d111111abcdef8.cloudfront.net"

// export function getPublicUrl(key: string): string {
//   return `https://${CLOUDFRONT_DOMAIN}/${key}`;
// }
