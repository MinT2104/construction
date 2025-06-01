export const blogEndpoints = {
  getBlogCategory: "/blog/category/:categorySlug",
  getPublicBlog: "/blog/public/:slug",
  getBlogSlug: "/blog/slug/:slug",
  getAllBlog: "/blog",
  //   getBlogById: "/blog/:id",
  createBlog: "/blog",
  getBlogById: "/blog/:id",
  updateBlog: "/blog/:id",
  deleteBlog: "/blog/:id",
  updateFeatured: "/blog/featured/:id",

  getBlogFeatured: "/blog/featured",
  incrementView: "/blog/view/:slug",
};
