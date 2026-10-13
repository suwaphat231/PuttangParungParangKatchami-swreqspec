// จุดเดียวที่หน้าจอใช้เรียก API หลังบ้าน (ตามสัญญา API ใน plan.md ข้อ 4)
// ตอน test ให้ส่ง client จำลองเข้าไปในหน้าจอแทน ไม่ต้องรันหลังบ้านจริง
// เรียกผ่าน /api (ดู proxy ใน vite.config.js) หลังบ้านต้องรันอยู่ที่ port 8000
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

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
    const res = await fetch(`${BASE}/uc13/workers?${params}`)
    return res.json()
  },
}
