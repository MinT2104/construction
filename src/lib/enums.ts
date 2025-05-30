export const BlogStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const BlogValidation = {
  TITLE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 100,
  },
  CONTENT: {
    MIN_LENGTH: 100,
  },
  EXCERPT: {
    MAX_LENGTH: 160,
    MIN_LENGTH: 10,
  },
  IMAGE_ALT: {
    MAX_LENGTH: 100,
  },
  SEO: {
    TITLE_MAX_LENGTH: 60,
    DESCRIPTION_MAX_LENGTH: 160,
  },
} as const;

export const RegexPatterns = {
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
} as const;
