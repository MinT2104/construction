export const promotionEndpoints = {
  getAllPromotion: "/promotion",
  createPromotion: "/promotion",
  getPromotionById: "/promotion/:id",
  getPromotionBySlug: "/promotion/slug/:slug",
  updatePromotion: "/promotion/:id",
  deletePromotion: "/promotion/:id",
  updateFeatured: "/promotion/featured/:id",

  getPromotionFeatured: "/promotion/featured",
  incrementView: "/promotion/view/:slug",
};
