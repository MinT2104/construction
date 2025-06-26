import withBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "graph.facebook.com",
      "via.placeholder.com",
      "placehold.co",
      "kientrucvietquang.net",
      "i.ytimg.com",
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
  // Tối ưu hóa production build
  compress: true,
  poweredByHeader: false,
  // Asset optimization
  assetPrefix: process.env.NODE_ENV === "production" ? "/" : "",
  // Performance optimizations
  experimental: {
    serverComponentsExternalPackages: ["quill", "react-quill"],
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    // nextScriptWorkers: true,
    // Tối ưu memory và performance
    workerThreads: false,
    esmExternals: true,
    // Tối ưu build time
    swcMinify: true,
    // Tối ưu runtime
    instrumentationHook: process.env.NODE_ENV === "production",
  },
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Split chunks tối ưu
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Vendor chunks
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            chunks: "all",
            maxSize: 244000, // ~240KB
          },
          // UI Framework chunks
          radixui: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: "radix-ui",
            priority: 20,
            chunks: "all",
            maxSize: 200000, // ~200KB
          },
          // Motion/Animation chunks
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: "framer-motion",
            priority: 15,
            chunks: "all",
            maxSize: 150000, // ~150KB
          },
          // Editor chunks (heavy)
          quill: {
            test: /[\\/]node_modules[\\/](react-)?quill[\\/]/,
            name: "quill-editor",
            priority: 30,
            chunks: "all",
          },
          // Icons chunks
          icons: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: "lucide-icons",
            priority: 12,
            chunks: "all",
            maxSize: 100000, // ~100KB
          },
          // Common utilities
          common: {
            name: "common",
            minChunks: 2,
            priority: 5,
            chunks: "all",
            enforce: true,
            maxSize: 200000, // ~200KB
          },
        },
      };

      // Module concatenation for smaller bundles
      config.optimization.concatenateModules = true;

      // Remove console logs in production
      config.optimization.minimizer = config.optimization.minimizer.map(
        (plugin) => {
          if (plugin.constructor.name === "TerserPlugin") {
            plugin.options.terserOptions = {
              ...plugin.options.terserOptions,
              compress: {
                ...plugin.options.terserOptions.compress,
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ["console.log", "console.info", "console.debug"],
              },
            };
          }
          return plugin;
        }
      );
    }

    // Tree shaking optimization (only in production to avoid conflicts)
    if (!dev && !isServer) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    // Bundle analysis
    if (process.env.ANALYZE === "true") {
      config.optimization.concatenateModules = false;
    }

    return config;
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  // Redirect optimizations
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzerConfig(nextConfig);
