const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
          shared: {
            name: (module, chunks) => {
              return `shared-${chunks.map(c => c.name).join('-')}`;
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      };
    }

    // Handle large files
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          publicPath: '/_next/static/images/',
          outputPath: 'static/images/',
        },
      },
    });

    return config;
  },
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    optimizePackageImports: [
      '@chakra-ui/react',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
    ],
  },
  // Increase chunk loading timeout
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

module.exports = withBundleAnalyzer(nextConfig); 