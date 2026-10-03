import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import WorkerStatusPage from './WorkerStatusPage.jsx'

const rows = [
  { worker_id: 'w1', student_id: '66010001', full_name: 'อรทัย ใจดี', department_id: 'department-a', course_id: 'course-a', semester: '1', academic_year: '2026', work_period_start: '2026-01-05', work_period_end: '2026-05-30', status: 'ปฏิบัติงานเสร็จสิ้น', last_updated_at: '2026-06-01T09:30:00+00:00' },
  { worker_id: 'w2', student_id: '66010002', full_name: 'กิตติพงษ์ รักเรียน', department_id: 'department-a', course_id: 'course-b', semester: '2', academic_year: '2026', work_period_start: '2026-08-01', work_period_end: '2026-12-20', status: 'กำลังปฏิบัติงาน', last_updated_at: '2026-09-25T13:15:00+00:00' },
  { worker_id: 'w3', student_id: '66010003', full_name: 'มาลี แสงทอง', department_id: 'department-a', course_id: 'course-a', semester: '2', academic_year: '2026', work_period_start: '2026-11-01', work_period_end: '2027-03-15', status: 'คัดเลือกแล้ว', last_updated_at: '2026-09-27T08:00:00+00:00' },
  { worker_id: 'w4', student_id: '66010004', full_name: 'ธนา พูนผล', department_id: 'department-a', course_id: 'course-b', semester: '1', academic_year: '2026', work_period_start: '2026-02-01', work_period_end: '2026-06-30', status: 'ยกเลิก/พ้นสภาพ', last_updated_at: '2026-03-12T10:20:00+00:00' },
]

function makeApi(overrides = {}) {
  return {
    getContext: vi.fn().mockResolvedValue({ role: 'Department Staff', department_id: 'department-a', departments: ['department-a'], courses: [
      { course_id: 'course-a', department_id: 'department-a' },
      { course_id: 'course-b', department_id: 'department-a' },
    ] }),
    listWorkers: vi.fn().mockResolvedValue(rows),
    getWorker: vi.fn(async (workerId) => rows.find((worker) => worker.worker_id === workerId)),
    getStatusReport: vi.fn().mockResolvedValue({
      period_from: '2026-01-01', period_to: '2026-12-31', total: 4,
      by_status: { 'คัดเลือกแล้ว': 1, 'กำลังปฏิบัติงาน': 1, 'ปฏิบัติงานเสร็จสิ้น': 1, 'ยกเลิก/พ้นสภาพ': 1 },
    }),
    ...overrides,
  }
}

test('test_AC_WKS_02_shows_all_search_and_filter_controls', async () => {
  render(<WorkerStatusPage api={makeApi()} />)
  expect(await screen.findByLabelText('รหัสนักศึกษา')).toBeTruthy()
  expect(screen.getByLabelText('ชื่อ-นามสกุล')).toBeTruthy()
  expect(screen.getByLabelText('รายวิชา')).toBeTruthy()
  expect(screen.getByLabelText('ภาคการศึกษา')).toBeTruthy()
  expect(screen.getByLabelText('ปีการศึกษา')).toBeTruthy()
  expect(screen.getByLabelText('เริ่มช่วงปฏิบัติงาน')).toBeTruthy()
  expect(screen.getByLabelText('สิ้นสุดช่วงปฏิบัติงาน')).toBeTruthy()
  expect(screen.getByLabelText('สถานะ')).toBeTruthy()
})

test('test_AC_WKS_01_shows_current_statuses', async () => {
  render(<WorkerStatusPage api={makeApi()} />)
  expect((await screen.findAllByText('คัดเลือกแล้ว')).length).toBeGreaterThanOrEqual(1)
  expect(screen.getAllByText('กำลังปฏิบัติงาน').length).toBeGreaterThanOrEqual(1)
  expect(screen.getAllByText('ปฏิบัติงานเสร็จสิ้น').length).toBeGreaterThanOrEqual(1)
  expect(screen.getAllByText('ยกเลิก/พ้นสภาพ').length).toBeGreaterThanOrEqual(1)
})

test('test_AC_WKS_02_shows_required_no_results_message', async () => {
  render(<WorkerStatusPage api={makeApi({ listWorkers: vi.fn().mockResolvedValue([]) })} />)
  expect(await screen.findByText('ไม่พบข้อมูลผู้ปฏิบัติงานตามเงื่อนไขที่ระบุ')).toBeTruthy()
})

test('test_AC_WKS_03_displays_full_last_updated_datetime', async () => {
  render(<WorkerStatusPage api={makeApi()} />)
  await screen.findByText('อรทัย ใจดี')
  fireEvent.click(screen.getAllByRole('button', { name: 'รายละเอียด' })[0])
  const timestamp = await screen.findByText((_, element) => element?.tagName === 'TIME')
  expect(timestamp.getAttribute('datetime')).toBe('2026-06-01T09:30:00+00:00')
  expect(timestamp.textContent).toMatch(/\d{2}:\d{2}:\d{2}/)
})

test('test_AC_WKS_04_requests_and_displays_period_status_report', async () => {
  const api = makeApi()
  render(<WorkerStatusPage api={api} />)
  fireEvent.change(screen.getByLabelText('จากวันที่'), { target: { value: '2026-01-01' } })
  fireEvent.change(screen.getByLabelText('ถึงวันที่'), { target: { value: '2026-12-31' } })
  fireEvent.click(screen.getByRole('button', { name: 'สรุปรายงาน' }))
  await waitFor(() => expect(api.getStatusReport).toHaveBeenCalledWith({
    period_from: '2026-01-01', period_to: '2026-12-31', department_id: undefined,
  }))
  const total = await screen.findByText((_, element) => element?.classList.contains('report-total'))
  expect(total.textContent).toContain('4')
  expect(screen.getAllByText('ยกเลิก/พ้นสภาพ').length).toBeGreaterThanOrEqual(1)
})

test('test_AC_WKS_01_admin_can_select_department', async () => {
  const api = makeApi({ getContext: vi.fn().mockResolvedValue({
    role: 'Admin', department_id: null, departments: ['department-a', 'department-b'],
    courses: [
      { course_id: 'course-a', department_id: 'department-a' },
      { course_id: 'course-c', department_id: 'department-b' },
    ],
  }) })
  render(<WorkerStatusPage api={api} />)
  expect(await screen.findByLabelText('Department')).toBeTruthy()
  fireEvent.change(screen.getByLabelText('Department'), { target: { value: 'department-b' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหา' }))
  await waitFor(() => expect(api.listWorkers).toHaveBeenLastCalledWith({ department_id: 'department-b' }))
})