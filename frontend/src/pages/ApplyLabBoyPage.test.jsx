import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach } from 'vitest';
import App from '../App.jsx';
import ApplyLabBoyPage from '../../../specs/001-apply-lab-boy/ApplyLabBoyPrototype.jsx';

afterEach(() => {
  cleanup();
  window.history.replaceState({}, '', '/');
});

function selectGrade(grade = 'A') {
  fireEvent.change(screen.getByRole('combobox', { name: 'เกรดของนักศึกษา (A–F)' }), {
    target: { value: grade },
  });
}

function confirmApplication() {
  if (!screen.queryByRole('dialog')) {
    fireEvent.click(screen.getByRole('button', { name: /ยืนยันการสมัคร|สมัครประกาศนี้อีกครั้ง/ }));
  }
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'ยืนยันการสมัคร' }));
}

test('test_prototype_AC_LB_02_shows_open_announcement_details_and_conditions', () => {
  render(<ApplyLabBoyPage />);

  expect(screen.getByRole('heading', { name: 'สมัครเป็น Lab Boy' })).toBeTruthy();
  expect(screen.queryByRole('heading', { name: 'ตรวจสอบคุณสมบัติ' })).toBeNull();
  expect(screen.queryByText('ทดลองสถานการณ์')).toBeNull();
  expect(screen.queryByText('ขั้นตอนการสมัคร')).toBeNull();
  expect(screen.queryByText('สมัครแล้ว')).toBeNull();
  expect(screen.queryByText('8 / 12 คน')).toBeNull();
  expect(screen.getByText('เวลาปิดรับสมัคร').parentElement.textContent).toContain('21 พฤศจิกายน 2569');
  expect(screen.getByText('จำนวนที่รับ').parentElement.textContent).toContain('10 คน');
  expect(screen.getByText('ได้เกรด B ขึ้นไปในรายวิชา Computer Programming 1')).toBeTruthy();
  expect(screen.getByText('Prototype · ข้อมูลจำลอง')).toBeTruthy();
});

test('test_prototype_AC_LB_02_places_office_room_below_teacher_name', () => {
  render(<ApplyLabBoyPage />);

  const teacherName = screen.getByText('ผู้สอน อาจารย์ ปัญญนัท อ้นพงษ์');
  const officeRoom = screen.getByText('ห้อง ว.1 ห้อง 1227');
  expect(teacherName.parentElement).toBe(officeRoom.parentElement);
  expect(teacherName.compareDocumentPosition(officeRoom) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(screen.queryByText(/ชั่วโมงปฏิบัติงาน/)).toBeNull();
});

test('test_prototype_AC_LB_01_and_11_confirms_once_with_a_single_application', () => {
  render(<ApplyLabBoyPage />);

  selectGrade('B');
  fireEvent.click(screen.getByRole('button', { name: 'ยืนยันการสมัคร' }));
  expect(screen.getByText('ยืนยันเกรด B และส่งใบสมัครใช่หรือไม่? เกรดนี้ไม่ใช้ตัดสินสิทธิ์สมัคร')).toBeTruthy();
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'ยืนยันการสมัคร' }));

  expect(screen.getByText('สมัครสำเร็จ')).toBeTruthy();
  expect(screen.getByText('เลขใบสมัคร LB-2569-0001')).toBeTruthy();
  expect(screen.getByText('เกรดที่ยืนยัน B')).toBeTruthy();
  expect(screen.getAllByText(/LB-2569-0001/)).toHaveLength(1);
  expect(screen.getByRole('button', { name: 'ถอนใบสมัคร' })).toBeTruthy();
});

test('test_prototype_AC_LB_04_and_06_rejects_missing_fields_and_allows_editing', () => {
  render(<ApplyLabBoyPage />);
  const nameInput = screen.getByRole('textbox', { name: 'ชื่อ-นามสกุล' });
  fireEvent.change(nameInput, { target: { value: '' } });

  confirmApplication();

  expect(screen.getByText('กรุณากรอกชื่อ-นามสกุล')).toBeTruthy();
  expect(screen.queryByText('สมัครสำเร็จ')).toBeNull();
  fireEvent.change(nameInput, { target: { value: 'ชื่อทดสอบ' } });
  expect(nameInput.value).toBe('ชื่อทดสอบ');
  expect(screen.getByText('กรุณาเลือกเกรดเพื่อยืนยัน')).toBeTruthy();
  selectGrade('C');
  expect(screen.queryByText('กรุณาเลือกเกรดเพื่อยืนยัน')).toBeNull();
});

test('test_prototype_AC_LB_06_shows_confirm_and_no_op_cancel_buttons', () => {
  render(<ApplyLabBoyPage />);
  const nameInput = screen.getByRole('textbox', { name: 'ชื่อ-นามสกุล' });
  const gradeSelect = screen.getByRole('combobox', { name: 'เกรดของนักศึกษา (A–F)' });
  fireEvent.change(nameInput, { target: { value: 'ชื่อที่แก้ไขแล้ว' } });
  selectGrade('B');

  fireEvent.click(screen.getByRole('button', { name: 'ยกเลิก' }));

  expect(screen.getByRole('button', { name: 'ยืนยันการสมัคร' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'คืนค่าข้อมูลตัวอย่าง' })).toBeNull();
  expect(nameInput.value).toBe('ชื่อที่แก้ไขแล้ว');
  expect(gradeSelect.value).toBe('B');
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('test_prototype_AC_LB_05_and_10_does_not_create_an_application_on_failure_or_when_full', () => {
  render(<ApplyLabBoyPage />);
  const scenarioSelect = screen.getByRole('combobox', { name: 'ผลจำลองเมื่อยืนยัน' });
  selectGrade();

  fireEvent.change(scenarioSelect, { target: { value: 'save-failure' } });
  confirmApplication();
  expect(screen.getByRole('alert').textContent).toContain('ไม่ได้สร้างใบสมัคร');
  expect(screen.queryByText(/เลขใบสมัคร LB-/)).toBeNull();

  fireEvent.change(scenarioSelect, { target: { value: 'full' } });
  confirmApplication();
  expect(screen.getByRole('alert').textContent).toContain('ครบจำนวนที่รับแล้ว');
  expect(screen.queryByText(/เลขใบสมัคร LB-/)).toBeNull();
});

test('test_prototype_AC_LB_03_and_09_shows_ineligible_and_registry_unavailable_outcomes', () => {
  const { unmount } = render(<ApplyLabBoyPage />);
  fireEvent.change(screen.getByRole('combobox', { name: 'ผลจำลองเมื่อยืนยัน' }), {
    target: { value: 'inactive' },
  });
  selectGrade();
  confirmApplication();
  expect(screen.getByRole('alert').textContent).toContain('สถานะนักศึกษาไม่ปกติ');

  unmount();
  render(<ApplyLabBoyPage />);
  fireEvent.change(screen.getByRole('combobox', { name: 'ผลจำลองเมื่อยืนยัน' }), {
    target: { value: 'registry-unavailable' },
  });
  selectGrade();
  confirmApplication();
  expect(screen.getByText('ส่งใบสมัครแล้ว · รอตรวจสอบ')).toBeTruthy();
  expect(screen.getByText('ระบบทะเบียนตรวจสอบไม่ได้ จึงส่งให้อาจารย์ดำเนินการต่อ')).toBeTruthy();
});

test('test_prototype_AC_LB_07_and_08_withdraws_and_reapplies_with_a_new_number', () => {
  render(<ApplyLabBoyPage />);

  selectGrade();
  confirmApplication();
  fireEvent.click(screen.getByRole('button', { name: 'ถอนใบสมัคร' }));
  fireEvent.click(screen.getByRole('button', { name: 'ยืนยันถอนใบสมัคร' }));
  expect(screen.getByText(/ถอนใบสมัครแล้ว/)).toBeTruthy();

  confirmApplication();
  expect(screen.getByText('เลขใบสมัคร LB-2569-0002')).toBeTruthy();
});

test('test_prototype_route_does_not_replace_existing_pages', () => {
  window.history.replaceState({}, '', '/apply-lab-boy');
  render(<App />);
  expect(screen.getByRole('heading', { name: 'สมัครเป็น Lab Boy' })).toBeTruthy();
});
