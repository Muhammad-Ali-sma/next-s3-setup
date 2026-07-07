import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads-demo-bucket.s3.ap-southeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net", // for Pattern 3 later in this guide
      },
    ],
  },
};

export default nextConfig;
