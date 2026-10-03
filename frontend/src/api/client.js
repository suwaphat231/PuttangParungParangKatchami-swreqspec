// จุดเดียวที่หน้าจอใช้เรียก API หลังบ้าน (ตามสัญญา API ใน plan.md ข้อ 4)
// ตอน test ให้ส่ง client จำลองเข้าไปในหน้าจอแทน ไม่ต้องรันหลังบ้านจริง
// เรียกผ่าน /api (ดู proxy ใน vite.config.js) หลังบ้านต้องรันอยู่ที่ port 8000
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

async function request(path) {
  const response = await fetch(`${BASE}${path}`)
  const body = await response.json()
  if (!response.ok) {
    throw new Error(body.detail || `UC-13 API request failed (${response.status})`)
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
