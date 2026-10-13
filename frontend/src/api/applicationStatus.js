const BASE = import.meta.env.VITE_API_BASE ?? '/api';

export const applicationStatusApi = {
  async listApplications() {
    const response = await fetch(`${BASE}/applications`, { cache: 'no-store' });
    if (!response.ok) throw new Error('application status request failed');
    return response.json();
  },
};
