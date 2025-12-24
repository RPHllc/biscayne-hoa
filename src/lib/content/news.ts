import newsData from '../../../content/news.json';

export type NewsItem = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category?: string;
  excerpt?: string;
  content: string; // plain text / markdown-ish
};

export function getAllNews(): NewsItem[] {
  const items = newsData as NewsItem[];
  return [...items].sort((a, b) => b.date.localeCompare(a.date)); // newest first
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return getAllNews().find((n) => n.slug === slug);
}

export function getNewsSlugs(): string[] {
  return getAllNews().map((n) => n.slug);
}
