import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import App from '../App.jsx'
import RecruitmentAnnouncementPrototype from '../../../specs/015-create-recruitment-announcement/prototype.jsx'

afterEach(() => {
  cleanup()
  window.history.replaceState({}, '', '/')
})

function chooseRole(role) {
  fireEvent.change(screen.getByRole('combobox', { name: 'จำลอง Role' }), {
    target: { value: role },
  })
}

function openDraft() {
  fireEvent.click(screen.getByRole('button', { name: /ฉบับร่างตัวอย่าง/ }))
}

function fillRequiredFields({ title = 'ประกาศทดสอบ UC-15', omit = [] } = {}) {
  const fields = [
    ['หัวข้อประกาศ', title],
    ['รหัสหลักสูตร', 'course-test'],
    ['จำนวนที่รับ', '2'],
    ['วันที่เริ่มรับสมัคร', '2026-11-13'],
    ['วันที่ปิดรับสมัคร', '2026-12-01'],
    ['คุณสมบัติ', 'คุณสมบัติสำหรับการทดสอบ'],
    ['เอกสารบังคับ', 'ใบแสดงผลการศึกษา'],
  ]

  fields.forEach(([label, value]) => {
    if (!omit.includes(label)) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    }
  })
}

function setJobDate(date) {
  fireEvent.change(screen.getByLabelText('วันที่รัน Scheduled Job จำลอง'), {
    target: { value: date },
  })
  fireEvent.click(screen.getByRole('button', { name: 'รัน Scheduled Job จำลอง' }))
}

function shiftDate(date, days) {
  const shifted = new Date(`${date}T12:00:00+07:00`)
  shifted.setUTCDate(shifted.getUTCDate() + days)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(shifted)
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return `${values.year}-${values.month}-${values.day}`
}

test('test_TC_ANN_01_1_department_staff_saves_an_incomplete_draft', () => {
  render(<RecruitmentAnnouncementPrototype />)
  fireEvent.click(screen.getByRole('button', { name: 'สร้างประกาศ' }))
  fireEvent.change(screen.getByLabelText('หัวข้อประกาศ'), {
    target: { value: 'Draft จากเจ้าหน้าที่ภาควิชา' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกฉบับ Draft' }))

  expect(screen.getByRole('status').textContent).toContain('บันทึกประกาศฉบับ Draft')
  expect(screen.getByRole('button', { name: /Draft จากเจ้าหน้าที่ภาควิชา.*Draft/ })).toBeTruthy()
})

test('test_TC_ANN_01_2_admin_saves_an_incomplete_draft', () => {
  render(<RecruitmentAnnouncementPrototype />)
  chooseRole('Admin')
  fireEvent.click(screen.getByRole('button', { name: 'สร้างประกาศ' }))
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกฉบับ Draft' }))

  expect(screen.getByRole('status').textContent).toContain('บันทึกประกาศฉบับ Draft')
  expect(screen.getAllByText('admin-01').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Draft · ฉบับร่าง').length).toBeGreaterThan(0)
  expect(screen.getByRole('row', { name: /CREATE admin-01 Admin/ })).toBeTruthy()
})

test('test_TC_ANN_01_3_student_cannot_create_or_save_a_draft', () => {
  render(<RecruitmentAnnouncementPrototype />)
  chooseRole('Student')

  expect(screen.queryByRole('button', { name: 'สร้างประกาศ' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'บันทึกฉบับ Draft' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'รัน Scheduled Job จำลอง' })).toBeNull()
})

test('test_TC_ANN_01_4_student_sees_only_published_announcements', () => {
  render(<RecruitmentAnnouncementPrototype />)
  chooseRole('Student')

  expect(screen.getByRole('button', { name: /ภาควิชาตัวอย่าง.*Published/ })).toBeTruthy()
  expect(screen.queryByRole('button', { name: /ฉบับร่างตัวอย่าง/ })).toBeNull()
  expect(screen.queryByRole('button', { name: /ตัวอย่างหมดอายุ/ })).toBeNull()
  expect(screen.queryByRole('button', { name: /ตัวอย่างเก็บถาวร/ })).toBeNull()
  expect(screen.queryByRole('heading', { name: /Audit Log/ })).toBeNull()
})

test('test_TC_ANN_02_1_publish_rejects_all_seven_missing_fields', () => {
  render(<RecruitmentAnnouncementPrototype />)
  fireEvent.click(screen.getByRole('button', { name: 'สร้างประกาศ' }))
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกฉบับ Draft' }))
  fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

  const alert = screen.getByRole('alert').textContent
  for (const field of [
    'title',
    'course_id',
    'quota',
    'start_date',
    'end_date',
    'qualifications',
    'required_documents',
  ]) {
    expect(alert).toContain(field)
  }
  expect(screen.queryByText('เผยแพร่ประกาศสำเร็จ')).toBeNull()
})

test('test_TC_ANN_02_2_publish_reports_a_single_missing_required_document', () => {
  render(<RecruitmentAnnouncementPrototype />)
  openDraft()
  fillRequiredFields({ omit: ['เอกสารบังคับ'] })
  fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

  expect(screen.getByRole('alert').textContent).toContain('required_documents')
  expect(screen.getByRole('alert').textContent).not.toContain('course_id')
})

test('test_TC_ANN_02_3_department_staff_publishes_a_complete_draft', () => {
  render(<RecruitmentAnnouncementPrototype />)
  openDraft()
  fillRequiredFields()
  fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

  expect(screen.getByRole('status').textContent).toContain('เผยแพร่ประกาศสำเร็จ')
  expect(screen.getByRole('button', { name: /ประกาศทดสอบ UC-15.*Published/ })).toBeTruthy()
  expect(screen.getAllByText('staff-dept-a-01').length).toBeGreaterThan(0)
})

test('test_TC_ANN_02_4_student_publish_attempt_is_rejected_without_changing_draft', () => {
  render(<RecruitmentAnnouncementPrototype />)
  fireEvent.click(screen.getByRole('button', { name: 'สร้างประกาศ' }))
  fillRequiredFields({ title: 'ประกาศสำหรับทดสอบสิทธิ์ Student' })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกฉบับ Draft' }))
  chooseRole('Student')

  fireEvent.click(screen.getByRole('button', { name: 'ทดลองกด Publish' }))
  expect(screen.getByRole('alert').textContent).toContain('Student ไม่มีสิทธิ์')

  chooseRole('Admin')
  expect(screen.getByRole('button', { name: /ประกาศสำหรับทดสอบสิทธิ์ Student.*Draft/ })).toBeTruthy()
  expect(screen.queryByRole('button', { name: /ประกาศสำหรับทดสอบสิทธิ์ Student.*Published/ })).toBeNull()
})

test('test_TC_ANN_03_1_department_staff_publish_shows_creator_publisher_and_audit_fields', () => {
  render(<RecruitmentAnnouncementPrototype />)
  openDraft()
  fillRequiredFields()
  fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

  expect(screen.getByText('ผู้เผยแพร่')).toBeTruthy()
  expect(screen.getByText('เวลาเผยแพร่')).toBeTruthy()
  expect(screen.getAllByText('staff-dept-a-01').length).toBeGreaterThan(0)
  expect(screen.getAllByText('PUBLISH').length).toBeGreaterThan(0)
  expect(screen.getAllByText(/course_id.*quota.*qualifications.*start_date.*end_date.*required_documents.*status/).length).toBeGreaterThan(0)
  expect(screen.getAllByText('Department Staff').length).toBeGreaterThan(0)
  const publishRow = Array.from(screen.getByRole('table').querySelectorAll('tbody tr'))
    .find((row) => row.textContent.includes('PUBLISH') && row.textContent.includes('staff-dept-a-01'))
  expect(publishRow).toBeTruthy()
  expect(publishRow.querySelectorAll('td')[2].textContent.trim()).not.toBe('')
})

test('test_TC_ANN_03_2_admin_publish_is_recorded_in_the_mock_audit_log', () => {
  render(<RecruitmentAnnouncementPrototype />)
  chooseRole('Admin')
  openDraft()
  fillRequiredFields()
  fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

  expect(screen.getAllByText('PUBLISH').length).toBeGreaterThan(0)
  expect(screen.getAllByText('admin-01').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Admin').length).toBeGreaterThan(0)
})

test('test_TC_ANN_03_3_audit_log_is_append_only_and_has_no_edit_or_delete_controls', () => {
  render(<RecruitmentAnnouncementPrototype />)
  openDraft()
  fireEvent.change(screen.getByLabelText('คุณสมบัติ'), {
    target: { value: 'ปรับคุณสมบัติใน Draft' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกการแก้ไข Draft' }))

  const auditHeading = screen.getByRole('heading', { name: 'Audit Log · อ่านอย่างเดียว' })
  const auditSection = auditHeading.closest('section')
  expect(auditSection).toBeTruthy()
  const actions = within(auditSection).getAllByRole('cell')
    .map((cell) => cell.textContent)
    .filter((action) => action === 'CREATE' || action === 'UPDATE_DRAFT')
  expect(actions).toContain('CREATE')
  expect(actions.at(-1)).toBe('UPDATE_DRAFT')
  expect(within(auditSection).queryByRole('button')).toBeNull()
})

test('test_TC_ANN_03_4_editing_a_draft_appends_changed_fields_to_audit', () => {
  render(<RecruitmentAnnouncementPrototype />)
  openDraft()
  fireEvent.change(screen.getByLabelText('คำอธิบาย'), {
    target: { value: 'รายละเอียดที่แก้ไข' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกการแก้ไข Draft' }))

  const auditHeading = screen.getByRole('heading', { name: 'Audit Log · อ่านอย่างเดียว' })
  const auditSection = auditHeading.closest('section')
  expect(within(auditSection).getByText('UPDATE_DRAFT')).toBeTruthy()
  expect(within(auditSection).getAllByText('description').length).toBeGreaterThan(0)
})

test('test_TC_ANN_04_1_published_announcement_expires_after_end_date', () => {
  render(<RecruitmentAnnouncementPrototype />)
  fireEvent.click(screen.getByRole('button', { name: /ภาควิชาตัวอย่าง.*Published/ }))
  const endDate = screen.getByLabelText('วันที่ปิดรับสมัคร').value

  setJobDate(shiftDate(endDate, 1))

  expect(screen.getByRole('button', { name: /ภาควิชาตัวอย่าง.*Expired/ })).toBeTruthy()
  expect(screen.getByText('EXPIRE')).toBeTruthy()
  expect(screen.getByText('scheduled-job')).toBeTruthy()
  expect(screen.getByText('SYSTEM')).toBeTruthy()
})

test('test_TC_ANN_04_2_announcement_remains_published_at_0005_on_end_date', () => {
  render(<RecruitmentAnnouncementPrototype />)
  fireEvent.click(screen.getByRole('button', { name: /ภาควิชาตัวอย่าง.*Published/ }))
  const endDate = screen.getByLabelText('วันที่ปิดรับสมัคร').value

  setJobDate(endDate)

  expect(screen.getByRole('button', { name: /ภาควิชาตัวอย่าง.*Published/ })).toBeTruthy()
})

test('test_TC_ANN_04_3_future_end_date_remains_published', () => {
  render(<RecruitmentAnnouncementPrototype />)
  fireEvent.click(screen.getByRole('button', { name: /ภาควิชาตัวอย่าง.*Published/ }))
  const endDate = screen.getByLabelText('วันที่ปิดรับสมัคร').value

  setJobDate(shiftDate(endDate, -1))

  expect(screen.getByRole('button', { name: /ภาควิชาตัวอย่าง.*Published/ })).toBeTruthy()
})

test('test_TC_ANN_04_4_expiry_audit_timestamp_uses_bangkok_0005', () => {
  render(<RecruitmentAnnouncementPrototype />)
  fireEvent.click(screen.getByRole('button', { name: /ภาควิชาตัวอย่าง.*Published/ }))
  const endDate = screen.getByLabelText('วันที่ปิดรับสมัคร').value
  const nextDay = shiftDate(endDate, 1)

  setJobDate(nextDay)

  const expectedTimestamp = new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(`${nextDay}T00:05:00+07:00`))
  expect(screen.getByText(expectedTimestamp)).toBeTruthy()
})

test('test_TC_ANN_04_5_draft_does_not_expire_even_when_end_date_is_past', () => {
  render(<RecruitmentAnnouncementPrototype />)
  fireEvent.click(screen.getByRole('button', { name: /ภาควิชาตัวอย่าง.*Published/ }))
  const futureEndDate = screen.getByLabelText('วันที่ปิดรับสมัคร').value
  const pastDate = shiftDate(futureEndDate, -20)
  const jobDate = shiftDate(futureEndDate, -14)
  fireEvent.click(screen.getByRole('button', { name: 'สร้างประกาศ' }))
  fireEvent.change(screen.getByLabelText('หัวข้อประกาศ'), {
    target: { value: 'Draft ที่มี end_date ผ่านแล้ว' },
  })
  fireEvent.change(screen.getByLabelText('วันที่ปิดรับสมัคร'), {
    target: { value: pastDate },
  })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกฉบับ Draft' }))
  setJobDate(jobDate)

  expect(screen.getByRole('button', { name: /Draft ที่มี end_date ผ่านแล้ว.*Draft/ })).toBeTruthy()
})

test('test_TC_ANN_04_6_expired_and_archived_records_keep_their_status', () => {
  render(<RecruitmentAnnouncementPrototype />)
  fireEvent.click(screen.getByRole('button', { name: /ภาควิชาตัวอย่าง.*Published/ }))
  const endDate = screen.getByLabelText('วันที่ปิดรับสมัคร').value

  setJobDate(shiftDate(endDate, 1))

  expect(screen.getByRole('button', { name: /ตัวอย่างเก็บถาวร.*Archived/ })).toBeTruthy()
  expect(screen.getByRole('button', { name: /ตัวอย่างหมดอายุ.*Expired/ })).toBeTruthy()
})

test('test_TC_ANN_01_5_app_route_opens_the_recruitment_announcement_prototype', () => {
  window.history.replaceState({}, '', '/create-announcement')
  render(<App />)

  expect(screen.getByRole('heading', { name: 'จัดทำประกาศรับสมัคร Lab Boy' })).toBeTruthy()
})
