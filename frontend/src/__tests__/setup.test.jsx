import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

test('หน้า UC-15 เปิดได้', async () => {
  render(<App />)

  expect(await screen.findByRole('heading', { name: 'จัดทำประกาศรับสมัคร' })).toBeTruthy()
  expect(screen.getByLabelText('หัวข้อประกาศ')).toBeTruthy()
})
