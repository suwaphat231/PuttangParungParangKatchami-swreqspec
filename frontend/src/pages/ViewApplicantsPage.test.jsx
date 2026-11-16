import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import ViewApplicantsPage, { TEACHER_VISIBLE_FIELDS, toTeacherView } from './ViewApplicantsPage.jsx';

describe('ViewApplicantsPage', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/list-applicants');
  });

  test('test_AC_APP_01 แสดงเฉพาะรายชื่อผู้สมัครในรอบที่อาจารย์รับผิดชอบ', () => {
    render(<ViewApplicantsPage />);

    expect(screen.getByRole('heading', { name: 'รายชื่อผู้สมัคร' })).toBeTruthy();
    expect(screen.getByText('รอบรับสมัครปีการศึกษา 2569')).toBeTruthy();

    const table = screen.getByRole('table');
    expect(within(table).getByText('กมลชนก ใจดี')).toBeTruthy();
    expect(within(table).getByText('ธนกฤต มีสุข')).toBeTruthy();
    expect(within(table).queryByText('ผู้สมัครรอบอื่น')).toBeNull();
  });

  // AC-APP-02 (FR-APP-02): ค้นหา/กรองตามชื่อ รหัสนักศึกษา รอบรับสมัคร หรือสถานะ
  test('test_AC_APP_02 ค้นหาและกรองรายชื่อผู้สมัครตามเงื่อนไข', () => {
    // Given มีผู้สมัครหลายรายในรอบเดียวกัน
    render(<ViewApplicantsPage />);
    const table = screen.getByRole('table');
    const search = screen.getByLabelText('ค้นหาชื่อหรือรหัสนักศึกษา');
    expect(within(table).getAllByRole('row').length - 1).toBeGreaterThan(1);

    // When ค้นหาตามชื่อ / Then เห็นเฉพาะผู้สมัครที่ชื่อตรง
    fireEvent.change(search, { target: { value: 'กมลชนก' } });
    expect(within(table).getByText('กมลชนก ใจดี')).toBeTruthy();
    expect(within(table).queryByText('ธนกฤต มีสุข')).toBeNull();
    expect(within(table).queryByText('ศิริพร แสงทอง')).toBeNull();

    // When ค้นหาตามรหัสนักศึกษา / Then เห็นเฉพาะผู้สมัครที่รหัสตรง
    fireEvent.change(search, { target: { value: '65010002' } });
    expect(within(table).getByText('ธนกฤต มีสุข')).toBeTruthy();
    expect(within(table).queryByText('กมลชนก ใจดี')).toBeNull();
    expect(within(table).queryByText('ศิริพร แสงทอง')).toBeNull();
    fireEvent.change(search, { target: { value: '' } });

    // When กรองตามสถานะ / Then เห็นเฉพาะผู้สมัครที่สถานะตรง
    fireEvent.click(screen.getByRole('button', { name: 'ผ่าน' }));
    expect(within(table).getByText('ศิริพร แสงทอง')).toBeTruthy();
    expect(within(table).queryByText('กมลชนก ใจดี')).toBeNull();
    expect(within(table).queryByText('ธนกฤต มีสุข')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'ทุกสถานะ' }));

    // When กรองตามรอบรับสมัคร / Then เห็นเฉพาะผู้สมัครของรอบนั้น และไม่มีรอบที่ไม่มีสิทธิ์ให้เลือก
    const roundSelect = screen.getByLabelText('เลือกรอบรับสมัคร');
    expect(within(roundSelect).queryByText(/Software Project Management/)).toBeNull();
    fireEvent.change(roundSelect, { target: { value: 'round-3' } });
    expect(within(table).getByText('วีรภัทร ดวงดี')).toBeTruthy();
    expect(within(table).queryByText('กมลชนก ใจดี')).toBeNull();
    expect(within(table).queryByText('ผู้สมัครรอบอื่น')).toBeNull();
  });

  // AC-APP-03 (FR-APP-03): ปฏิเสธการเข้าถึงรอบที่อาจารย์ไม่มีสิทธิ์
  test('test_AC_APP_03 ปฏิเสธการเข้าถึงรอบที่ไม่มีสิทธิ์และไม่แสดงรายละเอียดผู้สมัคร', () => {
    // Given อาจารย์ไม่มีสิทธิ์ในรอบรับสมัคร round-2
    // When พยายามเปิดดูข้อมูลของรอบดังกล่าวผ่าน URL
    window.history.pushState({}, '', '/list-applicants?round=round-2');
    render(<ViewApplicantsPage />);

    // Then ระบบปฏิเสธการเข้าถึง
    expect(screen.getByRole('alert').textContent).toBe('คุณไม่มีสิทธิ์เข้าถึงข้อมูลผู้สมัครของรอบรับสมัครนี้');

    // Then ไม่แสดงรายละเอียดใด ๆ ของผู้สมัครหรือของรอบนั้น
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.queryByText('ผู้สมัครรอบอื่น')).toBeNull();
    expect(screen.queryByText('64020001')).toBeNull();
    expect(screen.queryByText(/รอบรับสมัครปีการศึกษา 2568/)).toBeNull();
    expect(screen.queryByText(/Software Project Management/)).toBeNull();
  });

  test('test_AC_APP_01 แสดงตารางว่างและข้อความเมื่อรอบที่มีสิทธิ์ไม่มีผู้สมัคร', () => {
    // Given ไม่มีผู้สมัครในรอบรับสมัครที่อาจารย์รับผิดชอบ
    window.history.pushState({}, '', '/list-applicants?round=round-4');

    // When เปิดรอบรับสมัคร
    render(<ViewApplicantsPage />);

    // Then ระบบแสดงตารางว่างและข้อความ “ไม่พบผู้สมัคร”
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(2);
    expect(within(table).getByText('ไม่พบผู้สมัคร')).toBeTruthy();
  });

  // T-04 (NFR-SEC-01, Q-01): ไม่มี AC ตรง ๆ ตรวจว่าแสดงเฉพาะข้อมูลที่ทีมยืนยันใน Q-01
  test('test_Q_01 แสดงเฉพาะข้อมูลผู้สมัครที่อาจารย์มีสิทธิ์ดูตาม Q-01', () => {
    render(<ViewApplicantsPage />);
    const table = screen.getByRole('table');

    // หัวตารางมีเฉพาะข้อมูลที่ Q-01 อนุญาต และไม่มีเอกสารประกอบ
    const headers = within(table).getAllByRole('columnheader').map((th) => th.textContent);
    expect(headers).toEqual(['#', 'นักศึกษา', 'เกรด', 'ข้อมูลติดต่อ', 'วันที่สมัคร', 'สถานะ', 'การดำเนินการ']);
    expect(within(table).queryByText(/เอกสาร/)).toBeNull();

    // หน้านี้มีแค่ดูรายชื่อ ค้นหา และกรอง ไม่มีการคัดเลือกผู้สมัคร (UC-08 อยู่ใน Out of scope)
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.queryByRole('button', { name: /รับ/ })).toBeNull();
    expect(screen.queryByText(/Lab Boy ที่รับแล้ว/)).toBeNull();
    expect(within(table).getByRole('button', { name: 'ดู กมลชนก ใจดี' })).toBeTruthy();

    // แถวของผู้สมัครแสดง ชื่อ รหัส เกรด อีเมล เบอร์โทร วันที่สมัคร และสถานะ
    const row = within(table).getByText('กมลชนก ใจดี').closest('tr');
    for (const value of ['65010001', 'B+', 'kamonchanok.j@example.com', '081-000-0001', '12 พ.ย. 69', 'รอตรวจสอบ']) {
      expect(within(row).getByText(value)).toBeTruthy();
    }

    // ฟิลด์ที่ไม่อยู่ในรายการ Q-01 ถูกตัดทิ้งก่อนแสดงผล
    const view = toTeacherView({ id: 'x', name: 'ทดสอบ', documents: ['transcript.pdf'], nationalId: '1234567890123' });
    expect(Object.keys(view)).toEqual(TEACHER_VISIBLE_FIELDS);
    expect(view).not.toHaveProperty('documents');
    expect(view).not.toHaveProperty('nationalId');
  });
});
