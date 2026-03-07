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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Required for @monaco-editor/react — fixes "Loading chunk ... undefined" error
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
