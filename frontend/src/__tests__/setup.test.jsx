import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

test('หน้า UC-16 เปิดได้', async () => {
  render(<App />)

  expect(await screen.findByRole('heading', { name: 'ติดตามและตรวจสอบการจ่ายเงิน' })).toBeTruthy()
  expect(screen.getByLabelText('รหัสนักศึกษา')).toBeTruthy()
})
