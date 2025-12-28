import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone', 
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'totayafrica.onrender.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '194.163.175.53' }, // Autoriser l'IP backend pour les images
    ],
  },
  // ✅ CONFIGURATION DU PROXY CORS
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        // On mappe vers ton API Backend Java
        destination: 'http://194.163.175.53:8080/api/v1/:path*', 
      },
    ]
  },
};

export default nextConfig;