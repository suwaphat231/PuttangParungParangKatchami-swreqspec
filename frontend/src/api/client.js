// จุดเดียวที่หน้าจอใช้เรียก API หลังบ้าน (ตามสัญญา API ใน plan.md ข้อ 4)
// ตอน test ให้ส่ง client จำลองเข้าไปในหน้าจอแทน ไม่ต้องรันหลังบ้านจริง
// เรียกผ่าน /api (ดู proxy ใน vite.config.js) หลังบ้านต้องรันอยู่ที่ port 8000
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

// รองรับ NFR-SEC-01
function isLocalHostname(hostname = '') {
  return ['localhost', '127.0.0.1', '::1'].includes(hostname)
}

// รองรับ NFR-USE-01
function getErrorMessage(payload, fallbackMessage) {
  if (!payload) return fallbackMessage
  if (typeof payload === 'string') return payload
  return payload.message || payload.error || payload.detail || fallbackMessage
}

// รองรับ NFR-SEC-01
async function fetchJson(url, options = {}) {
  const validationUrl = typeof window !== 'undefined' ? new URL(url, window.location.origin) : new URL(url)
  const protocol = validationUrl.protocol
  const hostname = validationUrl.hostname

  if (protocol === 'http:' && !isLocalHostname(hostname)) {
    throw new Error('การส่งข้อมูลต้องใช้ HTTPS หรือช่องทางที่เข้ารหัส')
  }

  const fetchArgs = Object.keys(options).length > 0 ? [url, options] : [url]
  const res = await fetch(...fetchArgs)
  if (!res.ok) {
    let payload = null
    try {
      payload = await res.json()
    } catch {
      payload = null
    }
    throw new Error(getErrorMessage(payload, 'เกิดข้อผิดพลาดระหว่างส่งข้อมูล กรุณาลองใหม่อีกครั้ง'))
  }

  const contentType = res.headers?.get?.('content-type') || ''
  if (contentType.includes('application/json') || typeof res.json === 'function') {
    return res.json()
  }
  if (typeof res.text === 'function') {
    return res.text()
  }
  return null
}

export const api = {
  async getSlots({ dateFrom, packageCode }) {
    const q = new URLSearchParams({ date_from: dateFrom, package_code: packageCode })
    return fetchJson(`${BASE}/slots?${q}`)
  },
  async createBooking({ slotId }) {
    const res = await fetchJson(`${BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slotId }),
    })
    return { status: 200, body: res }
  },
}

const workerStatusFilterKeys = [
  'student_id',
  'full_name',
  'department_id',
  'course_id',
  'semester',
  'academic_year',
  'work_period_from',
  'work_period_to',
  'status',
]

export const workerStatusApi = {
  async listWorkers(filters = {}) {
    const params = new URLSearchParams()
    workerStatusFilterKeys.forEach((key) => {
      const value = filters[key]
      if (value !== undefined && value !== null && value !== '') params.set(key, value)
    })
    return fetchJson(`${BASE}/uc13/workers?${params}`)
  },
}

export { fetchJson }
