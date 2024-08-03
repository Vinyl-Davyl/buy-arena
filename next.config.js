/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "buy-arena.vercel.app/",
      },
    ],
  },
};

module.exports = nextConfig;
