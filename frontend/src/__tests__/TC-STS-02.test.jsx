import { render, screen } from '@testing-library/react'
import ApplicationStatusDetail from '../components/ApplicationStatusDetail.jsx'

function expectedBangkokTime(timestamp) {
  return new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok',
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(timestamp))
}

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
  expect(screen.getByText(expectedBangkokTime(application.updated_at))).toBeTruthy()
})

test('test_TC_STS_02_2_handles_day_boundary_update_time', () => {
  // Given มีใบสมัครที่เวลาอัปเดตอยู่ตรงขอบเขตการเปลี่ยนวัน โดยค่าขอบเขตเวลาไม่ได้ระบุใน spec
  const application = {
    status: 'ผ่าน',
    updated_at: '2026-10-13T16:59:59Z',
  }

  // When ผู้ใช้เปิดสถานะการสมัคร
  render(<ApplicationStatusDetail application={application} />)

  // Then ระบบต้องแสดงสถานะล่าสุด และเวลาอัปเดตเป็นเวลา Asia/Bangkok
  expect(screen.getByText('ผ่าน')).toBeTruthy()
  expect(screen.getByText(expectedBangkokTime(application.updated_at))).toBeTruthy()

  // ค่าขอบเขตที่ต้องรองรับเป็นประเด็นให้ทีมยืนยัน จึงตรวจเฉพาะผลตามเวลาที่ระบุในตัวอย่างนี้
})

test.todo('test_TC_STS_02_3_handles_missing_application')
