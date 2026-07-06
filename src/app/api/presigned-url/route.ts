import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3-client";
import { randomUUID } from "crypto";


const ALLOWED_TYPES = ["image/jpeg", "image/png", "video/mp4"];
const URL_EXPIRY_SECONDS = 60; // presigned URL is valid for 60 seconds

export async function POST(request: NextRequest) {
    try {
        const { fileName, fileType } = await request.json();

        if (!fileName || !fileType) {
            return NextResponse.json({ error: "Missing fileName or fileType" }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(fileType)) {
            return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
        }

        const key = `uploads/${randomUUID()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
            ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, {
            expiresIn: URL_EXPIRY_SECONDS,
        });

        return NextResponse.json({ uploadUrl, key });
    } catch (error) {
        console.error("Presign error:", error);
        return NextResponse.json({ error: "Could not generate upload URL" }, { status: 500 });
    }
}