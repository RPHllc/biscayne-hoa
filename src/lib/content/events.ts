import fs from 'node:fs';
import path from 'node:path';

export type EventItem = {
  title: string;
  start: string; // ISO string
  end?: string;  // ISO string (optional)
  location?: string;
  description?: string;
};

export function getEvents(): EventItem[] {
  const filePath = path.join(process.cwd(), 'content', 'events.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw) as EventItem[];

  // Sort by start time (soonest first)
  return data.sort((a, b) => a.start.localeCompare(b.start));
}
