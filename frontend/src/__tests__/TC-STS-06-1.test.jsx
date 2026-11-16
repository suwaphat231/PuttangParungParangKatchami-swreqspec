import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from '../App.jsx';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test('AC-STS-06: เปิดหน้าใหม่แล้วแสดงสถานะล่าสุดโดยไม่แสดงข้อมูลเก่าค้าง', async () => {
  // Given สถานะใบสมัครถูกอัปเดตในระบบแล้ว
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      status: 'รอตรวจสอบ',
      updated_at: '2026-10-13T09:00:00+07:00',
    }),
  });
  vi.stubGlobal('fetch', fetchMock);

  // When ผู้ใช้เปิดหน้าใหม่
  render(<App />);

  // Then ระบบแสดงข้อมูลล่าสุด
  expect(await screen.findByText('รอตรวจสอบ')).toBeTruthy();
  // Then ระบบไม่ใช้ข้อมูลเก่าค้าง
  expect(screen.queryByText('ยื่นแล้ว')).toBeNull();
  expect(fetchMock).toHaveBeenCalled();
});
