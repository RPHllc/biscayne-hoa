import fs from 'node:fs';
import path from 'node:path';

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  body: string;
};

const NEWS_DIR = path.join(process.cwd(), 'content', 'news');

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid frontmatter');
  }

  const frontmatterLines = match[1].split('\n');
  const body = match[2].trim();

  const data: Record<string, string> = {};
  for (const line of frontmatterLines) {
    const [key, ...rest] = line.split(':');
    data[key.trim()] = rest.join(':').trim().replace(/^"|"$/g, '');
  }

  return { data, body };
}

export function getAllNews(): NewsItem[] {
  const files = fs.readdirSync(NEWS_DIR);

  return files
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(NEWS_DIR, file), 'utf8');
      const { data, body } = parseFrontmatter(raw);

      return {
        slug,
        title: data.title,
        date: data.date,
        category: data.category,
        summary: data.summary,
        body,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getNewsBySlug(slug: string): NewsItem | null {
  const filePath = path.join(NEWS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, body } = parseFrontmatter(raw);

  return {
    slug,
    title: data.title,
    date: data.date,
    category: data.category,
    summary: data.summary,
    body,
  };
}
