import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuración para el túnel de ngrok (petición de Next.js)
  allowedDevOrigins: ['shelled-unabsorbingly-toi.ngrok-free.dev'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'acdn.mitiendanube.com',
      }
    ],
  },
};

export default nextConfig;
