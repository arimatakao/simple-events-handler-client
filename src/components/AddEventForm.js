import React, { useState } from 'react';
import { addEvent } from '../services/events';

// Only allow the user to change the page path (e.g. /home, /products/123)
const PAGE_RE = /^\/[A-Za-z0-9_\-\/]*$/;

export default function AddEventForm({ onAdded }) {
  const [userId, setUserId] = useState('');
  const [action, setAction] = useState('');
  const [pagePath, setPagePath] = useState('/');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validatePage = (p) => PAGE_RE.test(p);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!userId || !action) {
      setError('user_id and action are required');
      return;
    }

    if (!validatePage(pagePath)) {
      setError('Page must be a path starting with "/" and contain only letters, numbers, -, _ or /.');
      return;
    }

    setLoading(true);
    try {
      const metadata = { page: pagePath };
      // backend expects user_id as an integer (int64). Send numeric value.
      await addEvent({ user_id: Number(userId), action, metadata });
      setUserId('');
      setAction('');
      setPagePath('/');
      if (onAdded) onAdded();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to add event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <div>
        <label>User ID</label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Action</label>
        <input
          value={action}
          onChange={(e) => setAction(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Page (metadata.page)</label>
        <input
          value={pagePath}
          onChange={(e) => setPagePath(e.target.value)}
          placeholder="/home"
          required
        />
      </div>
      {error && (
        <div style={{ color: 'red', marginTop: 8 }}>{error}</div>
      )}
      <div style={{ marginTop: 8 }}>
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Event'}</button>
      </div>
    </form>
  );
}
