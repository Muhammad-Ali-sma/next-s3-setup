import { MultipartUploadForm } from "@/components/multipart-upload-form";
import { PresignedUploadForm } from "@/components/presigned-upload-form";
import { PrivateImage } from "@/components/private-image";
import { ProxyUploadForm } from "@/components/proxy-upload-form";
import { PublicAvatar } from "@/components/public-avatar";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 gap-3">
      <div className="bg-gray-100 w-fit p-5 rounded-lg">
        <h2 className="font-bold">Pattern 1: Server-Side Proxying</h2>
        <ProxyUploadForm />
      </div>

      <div className="bg-gray-100 w-fit p-5 rounded-lg">
        <h2 className="font-bold">Pattern 2: Direct-to-S3 Presigned URLs</h2>
        <PresignedUploadForm />
      </div>

      <div className="bg-gray-100 w-fit p-5 rounded-lg">
        <h2 className="font-bold">Pattern 3: Multipart Uploads for Large Files</h2>
        <MultipartUploadForm />
      </div>

      <PublicAvatar objectKey="public/Backend Integration & Authentication for Nextjs.png" alt="test"/>
      <PrivateImage objectKey="private/{user session id}/mug.png" alt="test"/>
    </div>
  );
}
