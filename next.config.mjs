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
  },
  // Tối ưu hóa production build
  swcMinify: true,
  // Sử dụng compilation cache để tăng tốc độ build
  reactStrictMode: true,
};

// Áp dụng bundle analyzer configuration
export default withBundleAnalyzerConfig(nextConfig);
