"use client";
import { useState } from "react";

const CHUNK_SIZE = 6 * 1024 * 1024; // 6MB per part (must be 5MB+)

export function MultipartUploadForm() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");

    const uploadPart = async (url: string, chunk: Blob): Promise<string> => {
        const res = await fetch(url, { method: "PUT", body: chunk });
        const etag = res.headers.get("ETag");
        if (!etag) throw new Error("Missing ETag from S3 response");
        return etag;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const fileInput = form.elements.namedItem("file") as HTMLInputElement;
        const file = fileInput.files?.[0];

        if (!file) return;

        setStatus("uploading");
        setProgress(0);

        try {
            // Step 1: start the multipart upload
            const startRes = await fetch("/api/multipart/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName: file.name, fileType: file.type }),
            });

            const { uploadId, key } = await startRes.json();

            // Step 2: split the file into chunks and upload each one
            const totalParts = Math.ceil(file.size / CHUNK_SIZE);
            const completedParts: { PartNumber: number; ETag: string }[] = [];

            for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
                const start = (partNumber - 1) * CHUNK_SIZE;
                const chunk = file.slice(start, start + CHUNK_SIZE);

                const presignRes = await fetch("/api/multipart/presign-part", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key, uploadId, partNumber }),
                });

                const { url } = await presignRes.json();

                const etag = await uploadPart(url, chunk);
                completedParts.push({ PartNumber: partNumber, ETag: etag });
                setProgress(Math.round((partNumber / totalParts) * 100));
            }

            // Step 3: tell S3 to assemble the parts into the final file
            await fetch("/api/multipart/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, uploadId, parts: completedParts }),
            });

            setStatus("done");
        } catch (error) {
            console.error("Multipart upload failed:", error);
            setStatus("error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
            <input type="file" name="file" required />
            <button
                type="submit"
                disabled={status === "uploading"}
                className="rounded-lg bg-amber-900 px-4 py-2 text-white disabled:opacity-50"
            >
                {status === "uploading" ? `Uploading... ${progress}%` : "Upload Large File"}
            </button>
            {status === "done" && <p className="text-sm text-green-600">Upload complete!</p>}
            {status === "error" && <p className="text-sm text-destructive">Upload failed.</p>}
        </form>
    );
}
