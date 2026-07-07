"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  objectKey: string;
  alt: string;
}

export function PrivateImage({ objectKey, alt }: Props) {

  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/image-url?key=${encodeURIComponent(objectKey)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setUrl(data.url ?? null);
      });

    return () => {
      cancelled = true;
    };
  }, [objectKey]);

  if (!url) {
    return <div className="h-24 w-24 rounded-lg bg-muted animate-pulse" />;
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={96}
      height={96}
      unoptimized // presigned URLs change every load, so caching them via the optimizer adds little value
      className="rounded-lg object-cover"
    />
  );
}
