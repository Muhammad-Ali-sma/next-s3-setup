import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN!;
const PRIVATE_KEY = process.env.CLOUDFRONT_PRIVATE_KEY!;
const KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID!;

export function getSignedCloudFrontUrl(key: string): string {
  return getSignedUrl({
    url: `https://${CLOUDFRONT_DOMAIN}/${key}`,
    keyPairId: KEY_PAIR_ID,
    privateKey: PRIVATE_KEY,
    dateLessThan: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
  });
}
