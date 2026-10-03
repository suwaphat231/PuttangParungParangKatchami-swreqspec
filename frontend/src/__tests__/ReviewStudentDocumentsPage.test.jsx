import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ReviewStudentDocumentsPage from '../pages/ReviewStudentDocumentsPage.jsx'

const application = {
  application_id: 'application-001',
  student_id: 'std-123',
  student_name: 'นางสาวสมใจ ใจดี',
  department_id: 'department-a',
  course_id: 'course-a',
  announcement_id: 'announcement-001',
  current_status: 'รอตรวจสอบ',
  last_updated_at: '2026-09-20T09:30:00+00:00',
  last_review_reason: '',
  problem_documents: [],
  audit_log: [],
}

function makeApi(overrides = {}) {
  return {
    getApplication: vi.fn().mockResolvedValue(application),
    getDocumentChecklist: vi.fn().mockResolvedValue({
      application_id: 'application-001',
      current_status: application.current_status,
      last_updated_at: application.last_updated_at,
      audit_log: application.audit_log,
      required_documents: ['สำเนาบัตรประชาชน', 'Transcript', 'รูปถ่าย'],
    }),
    submitReview: vi.fn().mockImplementation(async (_applicationId, payload) => ({
      status: payload.review_status,
      application_status: payload.review_status === 'ส่งกลับเพื่อแก้ไข'
        ? 'ส่งกลับแก้ไข'
        : payload.review_status,
      last_updated_at: '2026-10-03T09:30:00+00:00',
      audit_log: [{
        reviewed_at: '2026-10-03T09:30:00+00:00',
        reviewer_id: 'department-staff-001',
        reviewer_name: 'เจ้าหน้าที่ภาควิชา',
        status: payload.review_status,
        problem_documents: payload.problem_documents,
        reason: payload.reason,
      }],
      notifications: {
        in_app: { created: payload.review_status === 'ส่งกลับเพื่อแก้ไข' },
        email: { created: payload.review_status === 'ส่งกลับเพื่อแก้ไข' },
      },
    })),
    ...overrides,
  }
}

test('test_AC_OFC_01', async () => {
  render(<ReviewStudentDocumentsPage api={makeApi()} />)

  expect(await screen.findByText('ตรวจสอบเอกสารนักศึกษา')).toBeTruthy()
  expect(await screen.findByText('สำเนาบัตรประชาชน')).toBeTruthy()
  expect(screen.getByText('Transcript')).toBeTruthy()
  expect(screen.getByText('รูปถ่าย')).toBeTruthy()
})

test('test_AC_OFC_02', async () => {
  render(<ReviewStudentDocumentsPage api={makeApi()} />)

  await screen.findByText('สำเนาบัตรประชาชน')
  fireEvent.click(screen.getByLabelText('ผ่าน'))
  fireEvent.change(screen.getByLabelText('เหตุผล/ข้อความแจ้งแก้ไข'), { target: { value: 'เอกสารครบถ้วน' } })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกผลตรวจสอบ' }))

  await waitFor(() => {
    expect(screen.getByText('บันทึกผลตรวจสอบสำเร็จ')).toBeTruthy()
  })
  expect(screen.getByText('ประวัติการตรวจสอบ')).toBeTruthy()
  expect(screen.getByText(/department-staff-001/)).toBeTruthy()
})

test('test_AC_OFC_03', async () => {
  const api = makeApi()

  render(<ReviewStudentDocumentsPage api={api} />)
  await screen.findByText('สำเนาบัตรประชาชน')

  fireEvent.click(screen.getByLabelText('ส่งกลับเพื่อแก้ไข'))
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกผลตรวจสอบ' }))
  await waitFor(() => {
    expect(screen.getByText('ต้องระบุเอกสารที่มีปัญหาและเหตุผลก่อนส่งกลับแก้ไข')).toBeTruthy()
  })
  expect(api.submitReview).not.toHaveBeenCalled()

  fireEvent.change(screen.getByLabelText('เหตุผล/ข้อความแจ้งแก้ไข'), { target: { value: 'เอกสาร Transcript ไม่ชัดเจน' } })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกผลตรวจสอบ' }))
  await waitFor(() => {
    expect(screen.getByText('ต้องระบุเอกสารที่มีปัญหาและเหตุผลก่อนส่งกลับแก้ไข')).toBeTruthy()
  })
  expect(api.submitReview).not.toHaveBeenCalled()

  fireEvent.click(screen.getByRole('checkbox', { name: 'Transcript' }))
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกผลตรวจสอบ' }))
  await waitFor(() => {
    expect(screen.getByText('ส่งกลับแก้ไขสำเร็จ')).toBeTruthy()
  })
  expect(api.submitReview).toHaveBeenCalledWith('application-001', {
    review_status: 'ส่งกลับเพื่อแก้ไข',
    reason: 'เอกสาร Transcript ไม่ชัดเจน',
    problem_documents: ['Transcript'],
  })
  expect(screen.getByText(/department-staff-001/)).toBeTruthy()
})
