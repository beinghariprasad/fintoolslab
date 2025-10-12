// Blog post types for dynamic content loading

export interface BlogSection {
  heading: string;
  content: string;
  level?: 'h2' | 'h3';
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogContent {
  introduction: string;
  sections: BlogSection[];
  practicalExample?: string;
  conclusion: string;
  faqs?: BlogFAQ[];
}

export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: string;
  publishDate: string;
  readTime: string;
  featured?: boolean;
  content: BlogContent;
  internalLinks: string[];
  author?: string;
  template: 'calculator-comparison' | 'location-specific' | 'demographic-targeted' | 'calculator-vs-calculator' | 'amount-specific';
}

export interface BlogMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  readTime: string;
  category: string;
  featured: boolean;
  keywords: string[];
  template: string;
}
