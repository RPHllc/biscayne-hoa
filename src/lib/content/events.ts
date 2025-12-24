import fs from 'node:fs';
import path from 'node:path';

export type EventItem = {
  title: string;
  start: string; // ISO string
  location?: string;
  description?: string;
};

export function getEvents(): EventItem[] {
  const filePath = path.join(process.cwd(), 'content', 'events.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw) as EventItem[];

  return data.sort((a, b) => a.start.localeCompare(b.start));
}
