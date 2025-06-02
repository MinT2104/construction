export const bannerEndpoints = {
  getAllBanner: "/banners",
  updateHeaderBanner: "/banners/header",
  addHeroBanner: "/banners/hero",
  updateHeroBanner: (id: string) => `/banners/hero/${id}`,
  deleteHeroBanner: (id: string) => `/banners/hero/${id}`,
  toggleHeroBannerVisibility: (id: string) => `/banners/hero/${id}/toggle`,
  createBanner: "/banners",
  getBannerById: (id: string) => `/banners/${id}`,
  updateBanner: (id: string) => `/banners/${id}`,
  deleteBanner: (id: string) => `/banners/${id}`,
};
