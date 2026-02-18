/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' is only needed for Docker — removed for Vercel
  reactStrictMode: true,
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev'],
  },
  experimental: {
    serverComponentsExternalPackages: ['winston'],
  },
}

module.exports = nextConfig
