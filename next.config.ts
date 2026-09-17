import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuración para el túnel de ngrok (petición de Next.js)
  allowedDevOrigins: [
    'shelled-unabsorbingly-toi.ngrok-free.dev',
    '192.168.0.200',
    'localhost',
    '[IP_ADDRESS]',
  ],

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
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
