// จุดเดียวที่หน้าจอใช้เรียก API หลังบ้าน (ตามสัญญา API ใน plan.md ข้อ 4)
// ตอน test ให้ส่ง client จำลองเข้าไปในหน้าจอแทน ไม่ต้องรันหลังบ้านจริง
// เรียกผ่าน /api (ดู proxy ใน vite.config.js) หลังบ้านต้องรันอยู่ที่ port 8000
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

async function request(path, options = {}) {
  const hasExplicitOptions = Object.keys(options).length > 0
  const response = hasExplicitOptions
    ? await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
      })
    : await fetch(`${BASE}${path}`)
  const body = typeof response?.json === 'function'
    ? await response.json()
    : typeof response?.text === 'function'
      ? await response.text()
      : null
  if (!response?.ok) {
    throw new Error((typeof body === 'object' && body && body.detail) || body || `API request failed (${response?.status ?? 'unknown'})`)
  }
  return body
}

function queryString(values) {
  const query = new URLSearchParams()
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  })
  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

// Supports FR-WKS-01, FR-WKS-02, FR-WKS-03, and Q-01 through UC-13 API routes.
export const workerStatusApi = {
  getContext() {
    return request('/uc13/context')
  },
  listWorkers(filters = {}) {
    return request(`/uc13/workers${queryString(filters)}`)
  },
  getWorker(workerId, departmentId) {
    return request(`/uc13/workers/${encodeURIComponent(workerId)}${queryString({ department_id: departmentId })}`)
  },
  getStatusReport(period) {
    return request(`/uc13/reports/status${queryString(period)}`)
  },
}

// Supports FR-OFC-01, FR-OFC-02, and FR-OFC-03 for the document review flow.
export const reviewDocumentApi = {
  getApplication(applicationId) {
    return request(`/uc14/applications/${encodeURIComponent(applicationId)}/document-checklist`)
  },
  getDocumentChecklist(applicationId) {
    return request(`/uc14/applications/${encodeURIComponent(applicationId)}/document-checklist`)
  },
  submitReview(applicationId, payload) {
    return request(`/uc14/applications/${encodeURIComponent(applicationId)}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

export const api = {
  async getSlots({ dateFrom, packageCode }) {
    const q = new URLSearchParams({ date_from: dateFrom, package_code: packageCode })
    const res = await fetch(`${BASE}/slots?${q}`)
    return res.json()
  },
  async createBooking({ slotId }) {
    const res = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slotId }),
    })
    return { status: res.status, body: await res.json() }
  },
}
