/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.a-w.ch',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
