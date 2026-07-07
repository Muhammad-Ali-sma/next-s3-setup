import Image from "next/image";
import { getPublicUrl } from "@/lib/s3-urls";

interface Props {
  objectKey: string; // e.g. "public/avatars/uuid-photo.jpg
  alt: string;
}

export function PublicAvatar({ objectKey, alt }: Props) {
  return (
    <Image
      src={getPublicUrl(objectKey)}
      alt={alt}
      width={96}
      height={96}
      className="rounded-full object-cover"
    />
  );
}
