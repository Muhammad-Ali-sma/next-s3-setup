import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3-client";
import { getSignedCloudFrontUrl } from "@/lib/cloudfront-signer";
// import { auth } from "@/lib/auth"; // your auth solution of choice

const URL_EXPIRY_SECONDS = 300; // 5 minutes

export async function GET(request: NextRequest) {

    const key = request.nextUrl.searchParams.get("key");
    // uncomment following checks after you have an auth solution in place to protect private images
    //   const session = await auth();

    // if (!session?.userId) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // if (!key || !key.startsWith(`private/${session.userId}/`)) {
    //     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    // S3 Signed Url
    // const command = new GetObjectCommand({
    //     Bucket: process.env.S3_BUCKET_NAME!,
    //     Key: key,
    // });

    // const url = await getSignedUrl(s3Client, command, {
    //     expiresIn: URL_EXPIRY_SECONDS,
    // });

    // CloudFront Signed Url
    const url = getSignedCloudFrontUrl(key);

    return NextResponse.json({ url });
}
