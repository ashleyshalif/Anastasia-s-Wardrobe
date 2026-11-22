const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://api.razorpay.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https: http://127.0.0.1:8000 http://localhost:8000;
  font-src 'self' https://fonts.gstatic.com data:;
  connect-src 'self' http://127.0.0.1:8000 http://localhost:8000 https://api.razorpay.com https://lumberjack.razorpay.com;
  frame-src 'self' https://api.razorpay.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: cspHeader,
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "*.pike.replit.dev",
    "*.replit.dev",
    "127.0.0.1",
    "localhost",
    "192.168.29.239",
    "192.168.*",
    "10.114.247.129",
    "10.130.250.129",
    "*.trycloudflare.com",
    "*.loca.lt",
    "*.ngrok-free.app",
    "*.ngrok.io",
  ],
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
      {
        source: "/media/:path*",
        destination: "http://127.0.0.1:8000/media/:path*",
      },
    ];
  },
};

export default nextConfig;
