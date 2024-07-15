/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    VNP_TMN_CODE: process.env.VNP_TMN_CODE,
    VNP_HASH_SECRET: process.env.VNP_HASH_SECRET,
    VNP_URL: process.env.VNP_URL,
    VNP_RETURN_URL: process.env.VNP_RETURN_URL,
  },
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.vietqr.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "vietqr.net",
        pathname: "**",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
