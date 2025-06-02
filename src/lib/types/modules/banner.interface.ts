// Hero item (for heroBanner array)
export interface HeroItem {
  _id?: string;
  name: string;
  url: string;
  isShow: boolean;
  createdAt: string; // ISO string (from JSON)
  updatedAt: string;
}

// Main Banner structure
export interface Banner {
  _id?: string; // optional because sometimes frontend doesn't need it
  headerBanner?: string | null;
  heroBanner: HeroItem[];
  updatedAt?: string;
}
