const BASE = '/api/applications';

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  meta: () => request('/api/meta'),
  reset: () => request('/api/reset', { method: 'POST' }),
  list: () => request(BASE),
  create: (data) =>
    request(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  remove: (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),
  addInterview: (id, data) =>
    request(`${BASE}/${id}/interviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  removeInterview: (id, interviewId) =>
    request(`${BASE}/${id}/interviews/${interviewId}`, { method: 'DELETE' }),
};
