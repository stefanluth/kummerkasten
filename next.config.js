/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
};

module.exports = nextConfig;
