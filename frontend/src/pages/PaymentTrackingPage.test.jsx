import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import App from '../App.jsx';
import PaymentTrackingPage from './PaymentTrackingPage.jsx';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.history.replaceState({}, '', '/');
});

test('test_AC_PAY_01_shows_latest_status_amount_and_synthetic_data_read_only', () => {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);

  render(<PaymentTrackingPage />);

  expect(screen.getByText('Prototype · ข้อมูลสมมติ ไม่ใช่ข้อมูลการเงินจริง')).toBeTruthy();
  expect(screen.getByRole('row', { name: /15,000 บาท.*ชำระแล้ว/ }).textContent).toContain('15,000 บาท | ชำระแล้ว');
  expect(screen.getByRole('row', { name: /9,000 บาท.*ชำระแล้ว/ }).textContent).toContain('9,000 บาท | ชำระแล้ว');
  expect(screen.getByRole('row', { name: /12,000 บาท.*ยังไม่ได้จ่าย/ }).textContent).toContain('12,000 บาท | ยังไม่ได้จ่าย');
  expect(screen.getByRole('row', { name: /17,500 บาท.*มีความผิดปกติ/ }).textContent).toContain('17,500 บาท | มีความผิดปกติ');
  const summary = screen.getByRole('region', { name: 'สรุปสถานะการจ่ายเงิน' });
  expect(within(summary).getByText('2')).toBeTruthy();
  expect(within(summary).getAllByText('1')).toHaveLength(2);
  expect(fetchMock).not.toHaveBeenCalled();
  expect(screen.queryByRole('button', { name: /แก้ไข|เปลี่ยนสถานะ|บันทึก/ })).toBeNull();
});

test('test_AC_PAY_01_sets_payment_tracking_page_title', () => {
  render(<PaymentTrackingPage />);

  expect(document.title).toBe('UC-16 | ติดตามและตรวจสอบการจ่ายเงิน');
});

test('test_AC_PAY_02_marks_unpaid_and_abnormal_records_for_follow_up', () => {
  render(<PaymentTrackingPage />);

  expect(screen.getAllByText('ต้องติดตาม')).toHaveLength(2);
  const paidRow = screen.getByRole('row', { name: /อาทิตยา ใจดี/ });
  expect(within(paidRow).getByText('—')).toBeTruthy();
});

test('test_AC_PAY_03_searches_name_partially_and_worker_or_reference_exactly', () => {
  render(<PaymentTrackingPage />);
  const search = screen.getByRole('searchbox', { name: 'ค้นหาผู้ปฏิบัติงานหรือรายการ' });

  fireEvent.change(search, { target: { value: 'กิตติ' } });
  expect(screen.getByText('กิตติพงษ์ รักเรียน')).toBeTruthy();
  expect(screen.queryByText('อาทิตยา ใจดี')).toBeNull();

  fireEvent.change(search, { target: { value: 'MOCK-WORKER-001' } });
  expect(screen.getByText('อาทิตยา ใจดี')).toBeTruthy();
  fireEvent.change(search, { target: { value: 'MOCK-WORKER' } });
  expect(screen.getByText('ไม่พบรายการที่ตรงกับการค้นหาหรือตัวกรอง')).toBeTruthy();

  fireEvent.change(search, { target: { value: 'MOCK-REF-003' } });
  expect(screen.getByText('มาลี แสงทอง')).toBeTruthy();
  expect(screen.queryByText('อาทิตยา ใจดี')).toBeNull();
});

test('test_AC_PAY_03_filters_by_payment_status', () => {
  render(<PaymentTrackingPage />);
  fireEvent.change(screen.getByRole('combobox', { name: 'กรองตามสถานะ' }), {
    target: { value: 'ABNORMAL' },
  });

  expect(screen.getByText('มาลี แสงทอง')).toBeTruthy();
  expect(screen.queryByText('อาทิตยา ใจดี')).toBeNull();
});

test('test_AC_PAY_01_opens_read_only_payment_details', () => {
  render(<PaymentTrackingPage />);
  fireEvent.click(screen.getByRole('button', { name: 'ดูรายละเอียด MOCK-PAY-002' }));

  const details = screen.getByRole('complementary', { name: 'รายละเอียดรายการจ่ายเงิน' });
  expect(within(details).getByText('MOCK-PAY-002')).toBeTruthy();
  expect(details.textContent).toContain('12,000 บาท | ยังไม่ได้จ่าย');
  expect(within(details).getByText('MOCK-REF-002')).toBeTruthy();
  expect(within(details).getByText('MOCK · ข้อมูลสมมติ')).toBeTruthy();
  expect(within(details).getByText('รายการนี้ต้องติดตามต่อ')).toBeTruthy();
});

test('test_AC_PAY_03_routes_to_prototype_without_replacing_the_existing_home_page', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ applications: [] }),
  }));
  window.history.replaceState({}, '', '/payments');
  render(<App />);
  expect(screen.getByRole('heading', { name: 'ติดตามและตรวจสอบการจ่ายเงิน' })).toBeTruthy();

  cleanup();
  window.history.replaceState({}, '', '/');
  render(<App />);
  expect(screen.getByRole('heading', { name: 'สถานะการสมัคร' })).toBeTruthy();
  expect(await screen.findByText('ไม่พบรายการใบสมัคร')).toBeTruthy();
});
