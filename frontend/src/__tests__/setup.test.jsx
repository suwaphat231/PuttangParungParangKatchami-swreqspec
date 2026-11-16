// test ตรวจว่าโครงหน้าจอพร้อมใช้ (ไม่ใช่ test ของ AC ใด)
import { render, screen } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import App from '../App.jsx'

afterEach(() => vi.unstubAllGlobals())

test('หน้าแสดงสถานะการสมัครเปิดได้', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ applications: [] }),
  }))

  render(<App />)
  expect(screen.getByRole('heading', { name: 'สถานะการสมัคร' })).toBeTruthy()
  expect(await screen.findByText('ไม่พบรายการใบสมัคร')).toBeTruthy()
})
