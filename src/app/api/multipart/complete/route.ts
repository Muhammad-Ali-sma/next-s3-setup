import { NextRequest, NextResponse } from "next/server";
import { CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3-client";

export async function POST(request: NextRequest) {
  const { key, uploadId, parts } = await request.json();
  // parts: { PartNumber: number; ETag: string }[]

  await s3Client.send(
    new CompleteMultipartUploadCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    })
  );

  return NextResponse.json({ success: true, key });
}
