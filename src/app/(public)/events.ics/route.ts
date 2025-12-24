import { getEvents } from '@/lib/content/events';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

// Convert date to UTC iCal format: YYYYMMDDTHHMMSSZ
function toIcsUtc(dt: Date) {
  return (
    dt.getUTCFullYear() +
    pad2(dt.getUTCMonth() + 1) +
    pad2(dt.getUTCDate()) +
    'T' +
    pad2(dt.getUTCHours()) +
    pad2(dt.getUTCMinutes()) +
    pad2(dt.getUTCSeconds()) +
    'Z'
  );
}

// Escape text per RFC 5545 basics
function esc(text: string) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

// Default event duration when end is missing
const DEFAULT_DURATION_MINUTES = 60;

export const runtime = 'nodejs';

export function GET() {
  const events = getEvents();

  const now = new Date();
  const dtstamp = toIcsUtc(now);

  const lines: string[] = [];
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Biscayne Point HOA//Events//EN');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');
  lines.push('X-WR-CALNAME:Biscayne Point HOA Events');
  lines.push('X-WR-TIMEZONE:America/New_York');

  for (const e of events) {
    const start = new Date(e.start);

    const end = e.end
      ? new Date(e.end)
      : new Date(start.getTime() + DEFAULT_DURATION_MINUTES * 60 * 1000);

    // Stable-ish UID (good enough for HOA; change later if you add real ids)
    const uid = `${esc(e.title)}-${start.toISOString()}@biscaynepoint`;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART:${toIcsUtc(start)}`);
    lines.push(`DTEND:${toIcsUtc(end)}`);
    lines.push(`SUMMARY:${esc(e.title)}`);
    if (e.location) lines.push(`LOCATION:${esc(e.location)}`);
    if (e.description) lines.push(`DESCRIPTION:${esc(e.description)}`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  const body = lines.join('\r\n') + '\r\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="biscayne-point-events.ics"',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
