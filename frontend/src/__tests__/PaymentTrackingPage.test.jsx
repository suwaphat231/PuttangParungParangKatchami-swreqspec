import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import PaymentTrackingPage from '../pages/PaymentTrackingPage.jsx'

const records = [
  {
    payment_id: 'payment-001',
    student_id: 'std-123',
    full_name: 'สมใจ ใจดี',
    department_id: 'department-a',
    course_id: 'course-a',
    semester: '1',
    academic_year: '2026',
    amount: 12000,
    status: 'จ่ายแล้ว',
    needs_action: false,
    last_updated_at: '2026-09-15T09:00:00+00:00',
    audit_log: [{ event: 'read', timestamp: '2026-09-15T09:00:00+00:00' }],
  },
  {
    payment_id: 'payment-002',
    student_id: 'std-456',
    full_name: 'กิตติพงษ์ รักเรียน',
    department_id: 'department-a',
    course_id: 'course-b',
    semester: '1',
    academic_year: '2026',
    amount: 8000,
    status: 'ยังไม่จ่าย',
    needs_action: true,
    last_updated_at: '2026-09-20T08:30:00+00:00',
    audit_log: [{ event: 'read', timestamp: '2026-09-20T08:30:00+00:00' }],
  },
]

function makeApi(overrides = {}) {
  return {
    getContext: vi.fn().mockResolvedValue({
      role: 'Department Staff',
      department_id: 'department-a',
      departments: ['department-a'],
      courses: [{ course_id: 'course-a', department_id: 'department-a' }, { course_id: 'course-b', department_id: 'department-a' }],
    }),
    listPayments: vi.fn().mockResolvedValue(records),
    getPayment: vi.fn(async (paymentId) => records.find((record) => record.payment_id === paymentId)),
    ...overrides,
  }
}

test('test_AC_PAY_03_shows_filter_inputs_and_payment_list', async () => {
  render(<PaymentTrackingPage api={makeApi()} />)

  expect(await screen.findByLabelText('รหัสนักศึกษา')).toBeTruthy()
  expect(screen.getByLabelText('รายวิชา')).toBeTruthy()
  expect(screen.getByLabelText('ภาคการศึกษา')).toBeTruthy()
  expect(screen.getByLabelText('สถานะการจ่าย')).toBeTruthy()
  expect(await screen.findByText('สมใจ ใจดี')).toBeTruthy()
  expect(screen.getAllByText('ยังไม่จ่าย')[0]).toBeTruthy()
})

test('test_AC_PAY_02_marks_nonpayment_and_anomaly_rows', async () => {
  render(<PaymentTrackingPage api={makeApi()} />)

  await screen.findByText('สมใจ ใจดี')
  const badge = screen.getAllByText('ยังไม่จ่าย').find((element) => element.hasAttribute('data-flagged'))
  expect(badge).toBeTruthy()
  expect(badge.getAttribute('data-flagged')).toBe('true')
})

test('test_AC_PAY_01_opens_payment_detail_and_shows_latest_status', async () => {
  const api = makeApi()
  render(<PaymentTrackingPage api={api} />)

  await screen.findByText('สมใจ ใจดี')
  fireEvent.click(screen.getAllByRole('button', { name: 'รายละเอียด' })[0])

  await waitFor(() => expect(api.getPayment).toHaveBeenCalledWith('payment-001'))
  expect((await screen.findAllByText('จ่ายแล้ว')).length).toBeGreaterThan(0)
})

test('test_AC_PAY_03_search_uses_filter_values', async () => {
  const api = makeApi()
  render(<PaymentTrackingPage api={api} />)

  fireEvent.change(screen.getByLabelText('รหัสนักศึกษา'), { target: { value: 'std-123' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหา' }))

  await waitFor(() => expect(api.listPayments).toHaveBeenLastCalledWith({ student_id: 'std-123' }))
})
