/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com', 'cdn.pixabay.com', 'unsplash.com']
  },
  // Disable font optimization to prevent network issues
  optimizeFonts: false,
  // Add experimental features to help with font loading issues
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Configure webpack to handle potential font loading issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;