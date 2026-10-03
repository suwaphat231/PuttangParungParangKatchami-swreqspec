import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import CreateAnnouncementPage from '../pages/CreateAnnouncementPage.jsx'

function makeApi(overrides = {}) {
  return {
    listAnnouncements: vi.fn().mockResolvedValue([]),
    createAnnouncement: vi.fn().mockImplementation(async (payload) => ({
      announcement_id: 'ann-001',
      ...payload,
      status: 'Draft',
      audit_log: [{ action: 'created', operator_role: 'Department Staff', timestamp: '2026-10-03T10:00:00Z' }],
    })),
    publishAnnouncement: vi.fn().mockImplementation(async (announcementId) => ({
      announcement_id: announcementId,
      title: 'ประกาศรับสมัคร Lab Boy',
      status: 'Published',
      published_by: 'department-staff-001',
      published_at: '2026-10-03T10:00:00Z',
      audit_log: [{ action: 'published', operator_role: 'Department Staff', timestamp: '2026-10-03T10:00:00Z' }],
    })),
    ...overrides,
  }
}

test('test_AC_ANN_01', async () => {
  render(<CreateAnnouncementPage api={makeApi()} />)

  expect(await screen.findByText('จัดทำประกาศรับสมัคร')).toBeTruthy()
  fireEvent.change(screen.getByLabelText('หัวข้อประกาศ'), { target: { value: 'ประกาศรับสมัคร Lab Boy' } })
  fireEvent.change(screen.getByLabelText('รหัสหลักสูตร'), { target: { value: 'course-a' } })
  fireEvent.change(screen.getByLabelText('จำนวนที่รับ'), { target: { value: '5' } })
  fireEvent.change(screen.getByLabelText('วันที่เริ่มรับสมัคร'), { target: { value: '2026-10-01' } })
  fireEvent.change(screen.getByLabelText('วันที่ปิดรับสมัคร'), { target: { value: '2026-10-31' } })
  fireEvent.change(screen.getByLabelText('คุณสมบัติ'), { target: { value: 'นักศึกษาชั้นปี 2 ขึ้นไป' } })
  fireEvent.change(screen.getByLabelText('เอกสารบังคับ'), { target: { value: 'สำเนาบัตรประชาชน, Transcript' } })

  fireEvent.click(screen.getByRole('button', { name: 'บันทึกฉบับร่าง' }))

  await waitFor(() => {
    expect(screen.getByText('บันทึกฉบับร่างสำเร็จ')).toBeTruthy()
  })
})

test('test_AC_ANN_02', async () => {
  const api = makeApi()
  render(<CreateAnnouncementPage api={api} />)

  fireEvent.click(screen.getByRole('button', { name: 'เผยแพร่ประกาศ' }))

  await waitFor(() => {
    expect(screen.getByRole('alert').textContent).toMatch(/ข้อมูลไม่ครบ|title/i)
  })
  expect(api.publishAnnouncement).not.toHaveBeenCalled()
})

test('test_AC_ANN_03', async () => {
  const api = makeApi()
  render(<CreateAnnouncementPage api={api} />)

  fireEvent.change(screen.getByLabelText('หัวข้อประกาศ'), { target: { value: 'ประกาศรับสมัคร Lab Boy' } })
  fireEvent.change(screen.getByLabelText('รหัสหลักสูตร'), { target: { value: 'course-a' } })
  fireEvent.change(screen.getByLabelText('จำนวนที่รับ'), { target: { value: '5' } })
  fireEvent.change(screen.getByLabelText('วันที่เริ่มรับสมัคร'), { target: { value: '2026-10-01' } })
  fireEvent.change(screen.getByLabelText('วันที่ปิดรับสมัคร'), { target: { value: '2026-10-31' } })
  fireEvent.change(screen.getByLabelText('คุณสมบัติ'), { target: { value: 'นักศึกษาชั้นปี 2 ขึ้นไป' } })
  fireEvent.change(screen.getByLabelText('เอกสารบังคับ'), { target: { value: 'สำเนาบัตรประชาชน, Transcript' } })

  fireEvent.click(screen.getByRole('button', { name: 'เผยแพร่ประกาศ' }))

  await waitFor(() => {
    expect(api.publishAnnouncement).toHaveBeenCalled()
  })
  expect(await screen.findByText('เผยแพร่ประกาศสำเร็จ')).toBeTruthy()
})
