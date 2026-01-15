import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Evita que Next infiera mal el root (por lockfiles fuera del proyecto)
    // En Windows, usar fileURLToPath para evitar rutas tipo /C:/...
    root: projectRoot,
  },
  // Evita warnings de CORS cuando accedes desde otra IP (LAN)
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://192.168.137.1:3000',
    'http://192.168.137.1:3001',
    'http://192.168.137.1:3002',
  ],
};

export default nextConfig;
