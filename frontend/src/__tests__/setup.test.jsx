import { render, screen } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import App from '../App.jsx'

afterEach(() => vi.unstubAllGlobals())

test('หน้า UC-14 เปิดได้', async () => {
  vi.stubGlobal('fetch', vi.fn(async (url) => ({
    ok: true,
    json: async () => ({
      application_id: 'application-001',
      announcement_id: 'announcement-001',
      student_name: 'นางสาวสมใจ ใจดี',
      department_id: 'department-a',
      current_status: 'รอตรวจสอบ',
      required_documents: ['สำเนาบัตรประชาชน', 'Transcript', 'รูปถ่าย'],
    }),
  })))

  render(<App />)
  expect(await screen.findByRole('heading', { name: 'ตรวจสอบเอกสารนักศึกษา' })).toBeTruthy()
  expect(await screen.findByText('Transcript')).toBeTruthy()
})
