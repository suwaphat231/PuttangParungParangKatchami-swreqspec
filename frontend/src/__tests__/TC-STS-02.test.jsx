import { render, screen } from '@testing-library/react'
import ApplicationStatusDetail from '../components/ApplicationStatusDetail.jsx'

test('test_TC_STS_02_1_shows_latest_status_and_bangkok_time', () => {
  // Given มีใบสมัครที่มีสถานะล่าสุดและเวลาอัปเดตจากระบบ
  const application = {
    status: 'รอตรวจสอบ',
    updated_at: '2026-10-13T04:30:00Z',
  }

  // When ผู้ใช้เปิดสถานะการสมัคร
  render(<ApplicationStatusDetail application={application} />)

  // Then ระบบแสดงสถานะล่าสุด และแสดงเวลาอัปเดตเป็นเวลา Asia/Bangkok
  expect(screen.getByText('รอตรวจสอบ')).toBeTruthy()
  expect(screen.getByText('13 ต.ค. 2569 11:30:00')).toBeTruthy()
})

test('test_TC_STS_02_2_handles_day_boundary_update_time', () => {
  // Given มีใบสมัครที่เวลาอัปเดตอยู่ตรงขอบเขตการเปลี่ยนวัน โดยค่าขอบเขตเวลาไม่ได้ระบุใน spec
  const application = {
    status: 'ผ่าน',
    updated_at: '2026-10-13T17:00:00Z',
  }

  // When ผู้ใช้เปิดสถานะการสมัคร
  render(<ApplicationStatusDetail application={application} />)

  // Then ระบบต้องแสดงสถานะล่าสุด และเวลาอัปเดตเป็นเวลา Asia/Bangkok
  expect(screen.getByText('ผ่าน')).toBeTruthy()
  expect(screen.getByText('14 ต.ค. 2569 00:00:00')).toBeTruthy()

  // ค่าขอบเขตที่ต้องรองรับเป็นประเด็นให้ทีมยืนยัน จึงตรวจเฉพาะจุดเปลี่ยนวันตามตัวอย่างนี้
})

test.todo('test_TC_STS_02_3_handles_missing_application')
