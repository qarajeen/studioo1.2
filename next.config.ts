
import type { NextConfig } from 'next';

const repoName = process.env.NODE_ENV === 'production' ? '/studioo1.1' : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: repoName,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
   webpack: (config, { isServer }) => {
    // This is a workaround for a bug in ffmpeg.wasm.
    // It prevents the library from trying to load a worker on the server.
    if (isServer) {
      config.externals.push('@ffmpeg/ffmpeg', '@ffmpeg/util');
    }
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
    }

    return config;
  },
};

export default nextConfig;
