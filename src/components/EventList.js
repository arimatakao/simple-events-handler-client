import React, { useState } from 'react';
import { getEvents } from '../services/events';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso;
  }
}

// Basic RFC3339-ish validation: try to parse date and ensure it's a valid date.
function isValidRFC3339(s) {
  if (!s) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userId, setUserId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  // Timezone configuration from .env (REACT_APP_TIMEZONE)
  // Supported values:
  // - 'LOCAL' (default): interpret datetime-local as user's local timezone
  // - 'UTC': interpret datetime-local as UTC
  // - offset like '+03:00' or '-05:30': interpret as that fixed offset from UTC
  const TZ = process.env.REACT_APP_TIMEZONE || 'LOCAL';

  const ensureSeconds = (s) => {
    if (!s) return '';
    // if e.g. '2025-10-30T10:07' -> make '2025-10-30T10:07:00'
    const parts = s.split(':');
    if (parts.length === 2) return `${s}:00`;
    return s;
  };

  const parseOffset = (tz) => {
    // returns minutes offset east of UTC (e.g. +03:00 -> 180)
    const m = tz.match(/^([+-])(\d{2}):(\d{2})$/);
    if (!m) return null;
    const sign = m[1] === '+' ? 1 : -1;
    const hours = Number(m[2]);
    const mins = Number(m[3]);
    return sign * (hours * 60 + mins);
  };

  const pad2 = (n) => String(n).padStart(2, '0');

  const formatForDatetimeLocal = (date, tz) => {
    if (!date) return '';
    const offsetMinutes = parseOffset(tz);
    let y, mo, da, hh, mm;
    if (tz === 'UTC') {
      y = date.getUTCFullYear();
      mo = date.getUTCMonth() + 1;
      da = date.getUTCDate();
      hh = date.getUTCHours();
      mm = date.getUTCMinutes();
    } else if (offsetMinutes !== null) {
      // convert instant to wall time in the offset timezone
      const adjusted = new Date(date.getTime() + offsetMinutes * 60 * 1000);
      y = adjusted.getUTCFullYear();
      mo = adjusted.getUTCMonth() + 1;
      da = adjusted.getUTCDate();
      hh = adjusted.getUTCHours();
      mm = adjusted.getUTCMinutes();
    } else {
      // LOCAL
      y = date.getFullYear();
      mo = date.getMonth() + 1;
      da = date.getDate();
      hh = date.getHours();
      mm = date.getMinutes();
    }
    return `${y}-${pad2(mo)}-${pad2(da)}T${pad2(hh)}:${pad2(mm)}`;
  };

  const toRFC3339UTC = (localDateTime) => {
    // localDateTime from input[type=datetime-local] like '2025-10-30T10:07' or with seconds
    if (!localDateTime) return '';
    const s = ensureSeconds(localDateTime);
    const [datePart, timePart] = s.split('T');
    if (!datePart || !timePart) return '';
    const [y, m, d] = datePart.split('-').map(Number);
    const [hh, mm, ss] = timePart.split(':').map(Number);

    const offsetMinutes = parseOffset(TZ);
    if (TZ === 'UTC') {
      // treat as UTC directly
      const dt = new Date(Date.UTC(y, m - 1, d, hh, mm, ss));
      return dt.toISOString();
    } else if (offsetMinutes !== null) {
      // local time is in timezone with fixed offset from UTC.
      // convert local (tz) -> UTC by subtracting offset
      const utcMs = Date.UTC(y, m - 1, d, hh, mm, ss) - offsetMinutes * 60 * 1000;
      return new Date(utcMs).toISOString();
    } else {
      // LOCAL: interpret using browser local timezone
      const dt = new Date(s);
      if (Number.isNaN(dt.getTime())) return '';
      return dt.toISOString();
    }
  };

  const fetchEvents = async () => {
    setError(null);

    if (!userId) {
      setError('user_id is required');
      return;
    }
    if (!from || !to) {
      setError('from and to are required');
      return;
    }

    // Convert from datetime-local to RFC3339 UTC (ISO)
    const fromIso = toRFC3339UTC(from);
    const toIso = toRFC3339UTC(to);

    if (!fromIso || !toIso) {
      setError('from and to must be valid date/times');
      return;
    }

    setLoading(true);
    try {
      const resp = await getEvents({ user_id: userId, from: fromIso, to: toIso });
      setEvents(resp.data || []);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block' }}>user_id</label>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="42" />
        <label style={{ display: 'block', marginTop: 8 }}>from</label>
        <input
          type="datetime-local"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <label style={{ display: 'block', marginTop: 8 }}>to</label>
        <input
          type="datetime-local"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          <button type="button" onClick={() => {
            // preset: last 1 hour
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            setFrom(formatForDatetimeLocal(oneHourAgo, TZ));
            setTo(formatForDatetimeLocal(now, TZ));
          }}>Last 1 hour</button>
          <button type="button" onClick={() => {
            // preset: last 24 hours
            const now = new Date();
            const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            setFrom(formatForDatetimeLocal(dayAgo, TZ));
            setTo(formatForDatetimeLocal(now, TZ));
          }} style={{ marginLeft: 8 }}>Last 24 hours</button>
          <button type="button" onClick={() => {
            // preset: today (start of day to now)
            const now = new Date();
            const start = new Date(now);
            start.setHours(0,0,0,0);
            setFrom(formatForDatetimeLocal(start, TZ));
            setTo(formatForDatetimeLocal(now, TZ));
          }} style={{ marginLeft: 8 }}>Today</button>
        </div>
        <div style={{ marginTop: 8 }}>
          <button onClick={fetchEvents} disabled={loading}>{loading ? 'Loading...' : 'Get Events'}</button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>

      <div>
        {loading && <div>Loading events...</div>}
        {!loading && !events.length && <div>No events found</div>}
        {!loading && events.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>User</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Action</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Metadata</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee' }}>{ev.id}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee' }}>{ev.user_id}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee' }}>{ev.action}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee' }}>
                    {ev.metadata_page ? (
                      <a href={ev.metadata_page} target="_blank" rel="noopener noreferrer">view</a>
                    ) : (
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(ev.metadata || {}, null, 2)}</pre>
                    )}
                  </td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee' }}>{formatDate(ev.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
