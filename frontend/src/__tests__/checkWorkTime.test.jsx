import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import App from '../App.jsx';
import CheckWorkTimePage from '../pages/CheckWorkTimePage.jsx';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.history.replaceState({}, '', '/');
});

function jsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(payload),
  };
}

function fillPeriodAndSubmit() {
  fireEvent.change(screen.getByLabelText('วันที่เริ่มต้น'), {
    target: { value: '2026-07-21' },
  });
  fireEvent.change(screen.getByLabelText('ชั่วโมงเริ่มต้น'), {
    target: { value: '09' },
  });
  fireEvent.change(screen.getByLabelText('นาทีเริ่มต้น'), {
    target: { value: '00' },
  });
  fireEvent.change(screen.getByLabelText('วันที่สิ้นสุด'), {
    target: { value: '2026-07-21' },
  });
  fireEvent.change(screen.getByLabelText('ชั่วโมงสิ้นสุด'), {
    target: { value: '17' },
  });
  fireEvent.change(screen.getByLabelText('นาทีสิ้นสุด'), {
    target: { value: '00' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'ตรวจสอบช่วงเวลา' }));
}

test('test_AC_CAL_01_posts_the_requested_start_and_end_to_the_calendar_API', async () => {
  const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
    status: 'PASS',
    reason: 'ช่วงเวลาที่ร้องขอไม่ทับซ้อนกับช่วงที่ห้ามปฏิบัติงาน',
    calendarVersion: '12.11.2026',
    effectiveDate: '2026-11-12T00:00:00Z',
  }));
  vi.stubGlobal('fetch', fetchMock);
  render(<CheckWorkTimePage />);

  fillPeriodAndSubmit();

  expect(await screen.findByRole('heading', { name: 'PASS' })).toBeTruthy();
  expect(fetchMock).toHaveBeenCalledWith('/api/calendar/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startDate: '2026-07-21T09:00',
      endDate: '2026-07-21T17:00',
    }),
  });
});

test('test_AC_CAL_02_displays_FAIL_and_the_overlap_reason', async () => {
  const reason = 'ช่วงเวลาที่ร้องขอทับซ้อนกับช่วงสอบ';
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({
    status: 'FAIL',
    reason,
    calendarVersion: '12.11.2026',
    effectiveDate: '2026-11-12T00:00:00Z',
  })));
  render(<CheckWorkTimePage />);

  fillPeriodAndSubmit();

  expect(await screen.findByRole('heading', { name: 'FAIL' })).toBeTruthy();
  expect(screen.getByText(reason)).toBeTruthy();
});

test('test_AC_CAL_03_displays_FAIL_when_calendar_data_is_unavailable', async () => {
  const reason = 'Thailand public holiday data is unavailable.';
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({
    status: 'FAIL',
    reason,
    calendarVersion: '12.11.2026',
    effectiveDate: '2026-11-12T00:00:00Z',
  })));
  render(<CheckWorkTimePage />);

  fillPeriodAndSubmit();

  expect(await screen.findByRole('heading', { name: 'FAIL' })).toBeTruthy();
  expect(screen.queryByRole('heading', { name: 'PASS' })).toBeNull();
  expect(screen.getByText(reason)).toBeTruthy();
});

test('test_AC_CAL_04_displays_PASS_for_an_allowed_period', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({
    status: 'PASS',
    reason: 'ช่วงเวลาที่ร้องขอไม่ทับซ้อนกับช่วงที่ห้ามปฏิบัติงาน',
    calendarVersion: '12.11.2026',
    effectiveDate: '2026-11-12T00:00:00Z',
  })));
  render(<CheckWorkTimePage />);

  fillPeriodAndSubmit();

  expect(await screen.findByRole('heading', { name: 'PASS' })).toBeTruthy();
  expect(screen.getByText('calendarVersion').nextElementSibling.textContent).toBe('12.11.2026');
});

test('test_AC_CAL_05_displays_the_status_reason_and_calendar_reference', async () => {
  const reason = 'ช่วงเวลาที่ร้องขอไม่ทับซ้อนกับช่วงที่ห้ามปฏิบัติงาน';
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({
    status: 'PASS',
    reason,
    calendarVersion: '12.11.2026',
    effectiveDate: '2026-11-12T00:00:00Z',
  })));
  render(<CheckWorkTimePage />);

  fillPeriodAndSubmit();

  expect(await screen.findByRole('heading', { name: 'PASS' })).toBeTruthy();
  expect(screen.getByText(reason)).toBeTruthy();
  expect(screen.getByText('calendarVersion').nextElementSibling.textContent).toBe('12.11.2026');
  expect(screen.getByText('effectiveDate').nextElementSibling.textContent).toBe('2026-11-12T00:00:00Z');
});

test('test_T07_routes_to_the_calendar_page', () => {
  window.history.replaceState({}, '', '/calendar');

  render(<App />);

  expect(screen.getByRole('heading', { name: 'ตรวจสอบวันและเวลาปฏิบัติงาน' })).toBeTruthy();
});

test('test_T06_exposes_hour_and_minute_dropdowns', () => {
  render(<CheckWorkTimePage />);

  expect(screen.getByLabelText('วันที่เริ่มต้น').type).toBe('date');
  expect(screen.getByLabelText('วันที่สิ้นสุด').type).toBe('date');
  expect(screen.getByLabelText('ชั่วโมงเริ่มต้น').tagName).toBe('SELECT');
  expect(screen.getByLabelText('นาทีเริ่มต้น').tagName).toBe('SELECT');
  expect(screen.getByLabelText('ชั่วโมงสิ้นสุด').tagName).toBe('SELECT');
  expect(screen.getByLabelText('นาทีสิ้นสุด').tagName).toBe('SELECT');
  expect(screen.getByLabelText('ชั่วโมงเริ่มต้น').options.length).toBe(25);
  expect(screen.getByLabelText('นาทีเริ่มต้น').options.length).toBe(61);
  expect(screen.getByText(/YYYY-MM-DDTHH:mm/)).toBeTruthy();
  expect(screen.getByLabelText('ชั่วโมงเริ่มต้น').getAttribute('aria-describedby'))
    .toBe('calendar-datetime-help');
});

test('test_T07_surfaces_HTTP_errors_without_presenting_a_calendar_result', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(
    { detail: 'ช่วงเวลาที่ส่งมาไม่ถูกต้อง' },
    422,
  )));
  render(<CheckWorkTimePage />);

  fillPeriodAndSubmit();

  expect((await screen.findByRole('alert')).textContent).toContain('ช่วงเวลาที่ส่งมาไม่ถูกต้อง');
  expect(screen.queryByRole('heading', { name: 'PASS' })).toBeNull();
  expect(screen.queryByRole('heading', { name: 'FAIL' })).toBeNull();
});

test('test_T07_reports_HTTP_status_when_server_returns_an_empty_error_response', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: false,
    status: 500,
    text: async () => '',
  }));
  render(<CheckWorkTimePage />);

  fillPeriodAndSubmit();

  expect((await screen.findByRole('alert')).textContent).toContain('HTTP 500');
  expect(screen.queryByRole('heading', { name: 'PASS' })).toBeNull();
  expect(screen.queryByRole('heading', { name: 'FAIL' })).toBeNull();
});
