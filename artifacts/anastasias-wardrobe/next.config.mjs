/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  allowedDevOrigins: [
    "*.pike.replit.dev",
    "*.replit.dev",
    "127.0.0.1",
    "localhost",
  ],
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
