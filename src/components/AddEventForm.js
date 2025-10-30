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
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row g-2">
        <div className="col-md-3">
          <label className="form-label">User ID</label>
          <input
            type="number"
            className="form-control"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            placeholder="42"
          />
        </div>
        <div className="col-md-5">
          <label className="form-label">Action</label>
          <input
            className="form-control"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            required
            placeholder="e.g. click_button"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Page (metadata.page)</label>
          <input
            className="form-control"
            value={pagePath}
            onChange={(e) => setPagePath(e.target.value)}
            placeholder="/home"
            required
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">{error}</div>
      )}

      <div className="mt-3 d-flex align-items-center">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Adding...
            </>
          ) : (
            'Add Event'
          )}
        </button>
        <button type="button" className="btn btn-outline-secondary ms-2" onClick={() => { setUserId(''); setAction(''); setPagePath('/'); }} disabled={loading}>
          Reset
        </button>
      </div>
    </form>
  );
}
