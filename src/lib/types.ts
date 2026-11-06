/** Tipos de dominio compartidos por la capa de datos (DB o demo) y la UI. */

export type ProductFeatures = Record<string, string>;

export interface FaqItem {
  question: string;
  answer: string;
}

/** Autoría E-E-A-T: quién escribe, por qué es experto y dónde verificarlo. */
export interface ArticleAuthor {
  name: string;
  slug?: string;
  role?: string;
  bio?: string;
  avatar?: string;
  url?: string;
  sameAs?: string[];
  credentials?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parentId: string | null;
}

export interface Product {
  id: string;
  asin: string;
  title: string;
  slug: string;
  brand: string | null;
  description: string | null;
  verdict: string | null;
  features: ProductFeatures;
  pros: string[];
  cons: string[];
  priceCurrent: number | null;
  priceOriginal: number | null;
  currency: string;
  discountPercent: number | null;
  amazonUrlEs: string | null;
  amazonUrlUs: string | null;
  imageUrl: string | null;
  galleryImages: string[];
  categoryId: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  rating: number | null;
  reviewCount: number;
  editorialRating: number | null;
  badge: string | null;
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author: ArticleAuthor | null;
  featuredImage: string | null;
  categoryId: string | null;
  faqs: FaqItem[];
  seoTitle: string | null;
  seoDescription: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  relatedProductIds: string[];
}

export type ArticleSummary = Omit<Article, "content" | "faqs">;

export type Marketplace = "es" | "us";
