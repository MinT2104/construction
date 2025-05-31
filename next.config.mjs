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
};

export default nextConfig;
