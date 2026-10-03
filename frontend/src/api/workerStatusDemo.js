const statuses = [
  'คัดเลือกแล้ว',
  'กำลังปฏิบัติงาน',
  'ปฏิบัติงานเสร็จสิ้น',
  'ยกเลิก/พ้นสภาพ',
]

const workers = [
  { worker_id: 'worker-001', student_id: '66010001', full_name: 'อรทัย ใจดี', department_id: 'department-a', course_id: 'course-a', semester: '1', academic_year: '2026', work_period_start: '2026-01-05', work_period_end: '2026-05-30', status: 'ปฏิบัติงานเสร็จสิ้น', last_updated_at: '2026-06-01T09:30:00+00:00' },
  { worker_id: 'worker-002', student_id: '66010002', full_name: 'กิตติพงษ์ รักเรียน', department_id: 'department-a', course_id: 'course-b', semester: '2', academic_year: '2026', work_period_start: '2026-08-01', work_period_end: '2026-12-20', status: 'กำลังปฏิบัติงาน', last_updated_at: '2026-09-25T13:15:00+00:00' },
  { worker_id: 'worker-003', student_id: '66010003', full_name: 'มาลี แสงทอง', department_id: 'department-b', course_id: 'course-c', semester: '2', academic_year: '2026', work_period_start: '2026-11-01', work_period_end: '2027-03-15', status: 'คัดเลือกแล้ว', last_updated_at: '2026-09-27T08:00:00+00:00' },
  { worker_id: 'worker-004', student_id: '66010004', full_name: 'ธนา พูนผล', department_id: 'department-b', course_id: 'course-d', semester: '1', academic_year: '2026', work_period_start: '2026-02-01', work_period_end: '2026-06-30', status: 'ยกเลิก/พ้นสภาพ', last_updated_at: '2026-03-12T10:20:00+00:00' },
]

const context = {
  role: 'Department Staff',
  department_id: 'department-a',
  departments: ['department-a'],
  courses: [
    { course_id: 'course-a', department_id: 'department-a' },
    { course_id: 'course-b', department_id: 'department-a' },
  ],
}

function overlaps(worker, filters) {
  return (!filters.work_period_from || worker.work_period_end >= filters.work_period_from)
    && (!filters.work_period_to || worker.work_period_start <= filters.work_period_to)
}

// Supports FR-WKS-02 with deterministic mock responses for T-06 through T-10.
async function listWorkers(filters = {}) {
  let visibleWorkers = workers
  if (context.role === 'Department Staff') {
    visibleWorkers = visibleWorkers.filter((worker) => worker.department_id === context.department_id)
  }
  if (context.role === 'Admin' && filters.department_id) {
    visibleWorkers = visibleWorkers.filter((worker) => worker.department_id === filters.department_id)
  }

  const criteria = []
  if (filters.student_id) {
    const value = filters.student_id.toLocaleLowerCase()
    criteria.push((worker) => worker.student_id.toLocaleLowerCase().includes(value))
  }
  if (filters.full_name) {
    const value = filters.full_name.toLocaleLowerCase()
    criteria.push((worker) => worker.full_name.toLocaleLowerCase().includes(value))
  }
  if (filters.course_id) criteria.push((worker) => worker.course_id === filters.course_id)
  if (filters.semester) criteria.push((worker) => worker.semester === filters.semester)
  if (filters.academic_year) criteria.push((worker) => worker.academic_year === filters.academic_year)
  if (filters.work_period_from || filters.work_period_to) criteria.push((worker) => overlaps(worker, filters))
  if (filters.status) criteria.push((worker) => worker.status === filters.status)
  if (criteria.length === 0) return [...visibleWorkers]
  return visibleWorkers.filter((worker) => criteria.some((criterion) => criterion(worker)))
}

// Supports FR-WKS-03 with a full ISO date-time in the mock detail response.
async function getWorker(workerId) {
  return workers.find((worker) => worker.worker_id === workerId) ?? null
}

// Supports Q-01 and AC-WKS-04 with latest status over overlapping work periods.
async function getStatusReport({ period_from, period_to, department_id }) {
  const matching = await listWorkers({
    work_period_from: period_from,
    work_period_to: period_to,
    department_id,
  })
  const by_status = Object.fromEntries(statuses.map((status) => [status, 0]))
  matching.forEach((worker) => { by_status[worker.status] += 1 })
  return { period_from, period_to, total: matching.length, by_status }
}

export const workerStatusDemoApi = {
  async getContext() { return context },
  listWorkers,
  getWorker,
  getStatusReport,
}