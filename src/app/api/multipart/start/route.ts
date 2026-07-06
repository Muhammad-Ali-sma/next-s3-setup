import { NextRequest, NextResponse } from "next/server";
import { CreateMultipartUploadCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3-client";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const { fileName, fileType } = await request.json();

  const key = `large-uploads/${randomUUID()}-${fileName}`;

  const { UploadId } = await s3Client.send(
    new CreateMultipartUploadCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    })
  );

  return NextResponse.json({ uploadId: UploadId, key });
}
