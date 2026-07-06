"use client";
import { useState } from "react";

export function PresignedUploadForm() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) return;

    setStatus("uploading");
    setProgress(0);

    // Step 1: ask our server for a presigned URL
    const presignRes = await fetch("/api/presigned-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, fileType: file.type }),
    });

    if (!presignRes.ok) {
      setStatus("error");
      return;
    }

    const { uploadUrl } = await presignRes.json();
    // Step 2: upload the actual file straight to S3, tracking progress

    await new Promise<void>((resolve, reject) => {
     const xhr = new XMLHttpRequest();
     
     xhr.open("PUT", uploadUrl);
     xhr.setRequestHeader("Content-Type", file.type);
     
     xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => (xhr.status === 200 ? resolve() : reject());
      xhr.onerror = () => reject();
      xhr.send(file);
    })
      .then(() => setStatus("done"))
      .catch(() => setStatus("error"));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      <input type="file" name="file" accept="image/*,video/mp4" required />
      <button
        type="submit"
        disabled={status === "uploading"}
       className="rounded-lg bg-blue-800 px-4 py-2 text-white disabled:opacity-50"
      >
        {status === "uploading" ? `Uploading... ${progress}%` : "Upload"}
      </button>
      {status === "done" && <p className="text-sm text-green-600">Upload complete!</p>}
      {status === "error" && <p className="text-sm text-destructive">Upload failed.</p>}
   </form>
  );
}
