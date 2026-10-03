import { render, screen } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import App from '../App.jsx'

afterEach(() => vi.unstubAllGlobals())

test('หน้า UC-13 เปิดได้', async () => {
  vi.stubGlobal('fetch', vi.fn(async (url) => ({
    ok: true,
    json: async () => url.endsWith('/context')
      ? { role: 'Department Staff', department_id: 'department-a', departments: ['department-a'], courses: [] }
      : [{
        worker_id: 'worker-001', student_id: '66010001', full_name: 'อรทัย ใจดี',
        department_id: 'department-a', course_id: 'course-a', semester: '1', academic_year: '2026',
        work_period_start: '2026-01-05', work_period_end: '2026-05-30', status: 'ปฏิบัติงานเสร็จสิ้น',
        last_updated_at: '2026-06-01T09:30:00Z',
      }],
  })))

  render(<App />)
  expect(await screen.findByRole('heading', { name: 'ตรวจสอบสถานะผู้ปฏิบัติงาน' })).toBeTruthy()
  expect(await screen.findByText('66010001')).toBeTruthy()
})
