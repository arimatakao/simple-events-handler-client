import api from '../api';

export async function addEvent({ user_id, action, metadata }) {
  const body = { user_id, action, metadata };
  return api.post('/events', body);
}

export async function getEvents({ user_id, from, to } = {}) {
  const params = {};
  if (user_id !== undefined && user_id !== null && user_id !== '') params.user_id = user_id;
  if (from) params.from = from;
  if (to) params.to = to;
  return api.get('/events', { params });
}
