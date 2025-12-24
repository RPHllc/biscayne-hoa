import eventsData from '../../../content/events.json';

export type EventItem = {
  title: string;
  start: string; // ISO string
  end?: string; // ISO string
  location?: string;
  description?: string;
};

export function getEvents(): EventItem[] {
  const data = eventsData as EventItem[];
  return [...data].sort((a, b) => a.start.localeCompare(b.start));
}
