import fs from 'node:fs';
import path from 'node:path';

export type Announcement = {
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
  summary: string;
  href: string;
};

export function getAnnouncements(): Announcement[] {
  const filePath = path.join(process.cwd(), 'content', 'announcements.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw) as Announcement[];

  // Newest first
  return data.sort((a, b) => b.date.localeCompare(a.date));
}
