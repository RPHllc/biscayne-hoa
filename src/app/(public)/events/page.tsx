import { getEvents } from '@/lib/content/events';

function formatRange(startIso: string, endIso?: string) {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : null;

  const datePart = start.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const startTime = start.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (!end) return `${datePart} • ${startTime}`;

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const endTime = end.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (sameDay) return `${datePart} • ${startTime}–${endTime}`;

  // Rare, but handle multi-day events
  const endPart = end.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${datePart} • ${startTime} → ${endPart}`;
}

export default function EventsPage() {
  const events = getEvents();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">Community Events</h2>
          <p className="text-slate-600 mt-2">
            Upcoming meetings and neighborhood activities.
          </p>
        </div>

        <a
          href="/events.ics"
          className="inline-flex items-center justify-center bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-teal-700 hover:border-teal-300 hover:shadow-sm transition"
        >
          Subscribe to Calendar (.ics)
        </a>
      </div>

      {events.length === 0 ? (
        <p className="text-slate-600">No upcoming events scheduled.</p>
      ) : (
        <div className="space-y-6">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {event.title}
                  </h3>

                  <div className="text-sm text-slate-600">
                    {formatRange(event.start, event.end)}
                    {event.location ? ` • ${event.location}` : ''}
                  </div>

                  {event.description && (
                    <p className="text-slate-600 mt-2">{event.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-slate-500">
        Tip: On iPhone/Mac, opening the link will prompt to subscribe. In Google
        Calendar, use “Add by URL” and paste the full events.ics address.
      </div>
    </div>
  );
}
