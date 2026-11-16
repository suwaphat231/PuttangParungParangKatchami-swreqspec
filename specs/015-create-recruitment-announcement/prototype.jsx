import { useEffect, useMemo, useState } from 'react'

const TIME_ZONE = 'Asia/Bangkok'
const CURRENT_DEPARTMENT = 'department-a'
const ROLE_OPTIONS = ['Department Staff', 'Admin', 'Student']
const REQUIRED_FIELDS = [
  ['title', 'หัวข้อประกาศ'],
  ['course_id', 'รหัสหลักสูตร'],
  ['quota', 'จำนวนที่รับ'],
  ['start_date', 'วันที่เริ่มรับสมัคร'],
  ['end_date', 'วันที่ปิดรับสมัคร'],
  ['qualifications', 'คุณสมบัติ'],
  ['required_documents', 'เอกสารบังคับ'],
]
const FORM_FIELDS = [
  ['title', 'หัวข้อประกาศ', 'text'],
  ['course_id', 'รหัสหลักสูตร', 'text'],
  ['department_id', 'รหัสภาควิชา', 'text'],
  ['quota', 'จำนวนที่รับ', 'number'],
  ['description', 'คำอธิบาย', 'textarea'],
  ['qualifications', 'คุณสมบัติ', 'textarea'],
  ['start_date', 'วันที่เริ่มรับสมัคร', 'date'],
  ['end_date', 'วันที่ปิดรับสมัคร', 'date'],
  ['required_documents', 'เอกสารบังคับ', 'textarea'],
]
const STATUS_LABELS = {
  Draft: 'Draft · ฉบับร่าง',
  Published: 'Published · เผยแพร่แล้ว',
  Expired: 'Expired · หมดอายุ',
  Archived: 'Archived · เก็บถาวร',
}
const STATUS_STYLES = {
  Draft: 'bg-amber-100 text-amber-900',
  Published: 'bg-emerald-100 text-emerald-900',
  Expired: 'bg-slate-200 text-slate-700',
  Archived: 'bg-violet-100 text-violet-900',
}

function bangkokDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return `${values.year}-${values.month}-${values.day}`
}

function shiftBangkokDate(date, days) {
  const shifted = new Date(`${date}T12:00:00+07:00`)
  shifted.setUTCDate(shifted.getUTCDate() + days)
  return bangkokDate(shifted)
}

// สร้างรายการประวัติจำลองสำหรับ AC-ANN-03 โดยไม่เปิดทางแก้ไขหรือลบใน UI
function makeAuditEntry(announcement, action, operator, role, changedFields, timestamp = new Date().toISOString()) {
  return {
    id: `${announcement.id}-${timestamp}-${action}`,
    announcementId: announcement.id,
    action,
    operator,
    role,
    timestamp,
    changedFields,
  }
}

// เตรียมข้อมูลตัวอย่างครบทุกสถานะเพื่อสาธิต AC-ANN-01 และ AC-ANN-04
function createInitialState() {
  const today = bangkokDate()
  const announcements = [
    {
      id: 1001,
      title: 'รับสมัคร Lab Boy: ฉบับร่างตัวอย่าง',
      course_id: '',
      department_id: CURRENT_DEPARTMENT,
      quota: '',
      description: '',
      qualifications: '',
      start_date: '',
      end_date: '',
      required_documents: '',
      status: 'Draft',
      created_by: 'staff-dept-a-01',
      created_at: new Date().toISOString(),
      published_by: '',
      published_at: '',
    },
    {
      id: 1002,
      title: 'รับสมัคร Lab Boy ภาควิชาตัวอย่าง',
      course_id: 'course-a',
      department_id: CURRENT_DEPARTMENT,
      quota: '2',
      description: 'ประกาศตัวอย่างที่เผยแพร่แล้ว',
      qualifications: 'ผ่านรายวิชาที่เกี่ยวข้อง',
      start_date: today,
      end_date: shiftBangkokDate(today, 14),
      required_documents: 'ใบแสดงผลการศึกษา',
      status: 'Published',
      created_by: 'staff-dept-a-01',
      created_at: new Date().toISOString(),
      published_by: 'admin-01',
      published_at: new Date().toISOString(),
    },
    {
      id: 1003,
      title: 'รับสมัคร Lab Boy: ตัวอย่างหมดอายุ',
      course_id: 'course-b',
      department_id: CURRENT_DEPARTMENT,
      quota: '1',
      description: 'ประกาศตัวอย่างสถานะ Expired',
      qualifications: 'คุณสมบัติตัวอย่าง',
      start_date: shiftBangkokDate(today, -10),
      end_date: shiftBangkokDate(today, -1),
      required_documents: 'สำเนาบัตรนักศึกษา',
      status: 'Expired',
      created_by: 'staff-dept-a-01',
      created_at: new Date().toISOString(),
      published_by: 'staff-dept-a-01',
      published_at: new Date().toISOString(),
    },
    {
      id: 1004,
      title: 'รับสมัคร Lab Boy: ตัวอย่างเก็บถาวร',
      course_id: 'course-c',
      department_id: CURRENT_DEPARTMENT,
      quota: '1',
      description: 'ประกาศตัวอย่างสถานะ Archived',
      qualifications: 'คุณสมบัติตัวอย่าง',
      start_date: shiftBangkokDate(today, -40),
      end_date: shiftBangkokDate(today, -20),
      required_documents: 'ใบแสดงผลการศึกษา',
      status: 'Archived',
      created_by: 'admin-01',
      created_at: new Date().toISOString(),
      published_by: 'admin-01',
      published_at: new Date().toISOString(),
    },
  ]

  const auditLogs = [
    makeAuditEntry(announcements[0], 'CREATE', 'staff-dept-a-01', 'Department Staff', [
      'title',
      'department_id',
      'status',
    ]),
    makeAuditEntry(announcements[1], 'CREATE', 'staff-dept-a-01', 'Department Staff', [
      'title',
      'course_id',
      'department_id',
      'quota',
      'description',
      'qualifications',
      'start_date',
      'end_date',
      'required_documents',
      'status',
    ]),
    makeAuditEntry(announcements[1], 'PUBLISH', 'admin-01', 'Admin', ['status']),
  ]

  return { announcements, auditLogs }
}

function emptyForm(departmentId = CURRENT_DEPARTMENT) {
  return {
    title: '',
    course_id: '',
    department_id: departmentId,
    quota: '',
    description: '',
    qualifications: '',
    start_date: '',
    end_date: '',
    required_documents: '',
  }
}

function toForm(announcement) {
  return Object.fromEntries(
    FORM_FIELDS.map(([key]) => [key, announcement[key] ?? '']),
  )
}

// รองรับ FR-ANN-02 และ AC-ANN-02
function missingFields(announcement) {
  return REQUIRED_FIELDS
    .filter(([key]) => !String(announcement[key] ?? '').trim())
    .map(([key]) => key)
}

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: TIME_ZONE,
  }).format(new Date(timestamp))
}

function roleIdentity(role) {
  if (role === 'Admin') return 'admin-01'
  if (role === 'Student') return 'student-01'
  return 'staff-dept-a-01'
}

function mayManageAnnouncement(role, announcement) {
  return role === 'Admin'
    || (role === 'Department Staff' && announcement.department_id === CURRENT_DEPARTMENT)
}

// สาธิต AC-ANN-01 ถึง AC-ANN-04 ด้วย Mock Data และ Local State เท่านั้น
export default function RecruitmentAnnouncementPrototype() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'UC-15 | จัดทำประกาศรับสมัคร'
    return () => {
      document.title = previousTitle
    }
  }, [])

  const [role, setRole] = useState('Department Staff')
  const [initialState] = useState(createInitialState)
  const [announcements, setAnnouncements] = useState(initialState.announcements)
  const [auditLogs, setAuditLogs] = useState(initialState.auditLogs)
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(() => emptyForm())
  const [nextId, setNextId] = useState(1005)
  const [simulationDate, setSimulationDate] = useState(() => bangkokDate())
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  const visibleAnnouncements = useMemo(() => announcements.filter((announcement) => {
    if (role === 'Student') return announcement.status === 'Published'
    if (role === 'Department Staff') return announcement.department_id === CURRENT_DEPARTMENT
    return true
  }), [announcements, role])
  const selectedAnnouncement = announcements.find(({ id }) => id === selectedId) ?? null
  const canEdit = role !== 'Student'
    && (!selectedAnnouncement
      || (selectedAnnouncement.status === 'Draft' && mayManageAnnouncement(role, selectedAnnouncement)))
  const currentMissingFields = missingFields(form)
  const visibleIds = new Set(visibleAnnouncements.map(({ id }) => id))
  const visibleAuditLogs = role === 'Student'
    ? []
    : auditLogs.filter((entry) => visibleIds.has(entry.announcementId))

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
    setFeedback('')
  }

  function startNewDraft() {
    setSelectedId(null)
    setForm(emptyForm())
    setError('')
    setFeedback('')
  }

  function selectAnnouncement(announcement) {
    setSelectedId(announcement.id)
    setForm(toForm(announcement))
    setError('')
    setFeedback('')
  }

  // รองรับ FR-ANN-01 และ AC-ANN-01: บันทึก Draft ใน Local State แม้ข้อมูลไม่ครบ
  function saveDraft() {
    if (role === 'Student') {
      setError('Student ไม่มีสิทธิ์สร้างหรือแก้ไขประกาศ')
      return
    }

    if (selectedAnnouncement && !mayManageAnnouncement(role, selectedAnnouncement)) {
      setError('ไม่มีสิทธิ์จัดการประกาศของภาควิชานี้')
      return
    }

    if (selectedAnnouncement && selectedAnnouncement.status !== 'Draft') {
      setError('แก้ไขได้เฉพาะประกาศสถานะ Draft')
      return
    }

    if (selectedAnnouncement) {
      const changedFields = FORM_FIELDS
        .map(([key]) => key)
        .filter((key) => String(selectedAnnouncement[key] ?? '') !== String(form[key] ?? ''))
      const updated = { ...selectedAnnouncement, ...form }
      setAnnouncements((items) => items.map((item) => item.id === updated.id ? updated : item))
      setAuditLogs((items) => [
        ...items,
        makeAuditEntry(updated, 'UPDATE_DRAFT', roleIdentity(role), role, changedFields),
      ])
      setFeedback('บันทึกการแก้ไข Draft แล้ว')
      return
    }

    const created = {
      ...form,
      id: nextId,
      status: 'Draft',
      created_by: roleIdentity(role),
      created_at: new Date().toISOString(),
      published_by: '',
      published_at: '',
    }
    setAnnouncements((items) => [created, ...items])
    setAuditLogs((items) => [
      ...items,
      makeAuditEntry(created, 'CREATE', roleIdentity(role), role, [
        ...FORM_FIELDS.filter(([key]) => String(form[key] ?? '').trim()).map(([key]) => key),
        'status',
      ]),
    ])
    setNextId((id) => id + 1)
    setSelectedId(created.id)
    setFeedback('บันทึกประกาศฉบับ Draft แล้ว สามารถบันทึกได้แม้ข้อมูลยังไม่ครบ')
  }

  // รองรับ FR-ANN-02, FR-ANN-03 และ AC-ANN-02/03: ตรวจข้อมูลและสิทธิ์ก่อนจำลอง Publish
  function publishAnnouncement() {
    if (role === 'Student') {
      setError('ปฏิเสธการเผยแพร่: Student ไม่มีสิทธิ์เปลี่ยนสถานะเป็น Published')
      setFeedback('')
      return
    }

    if (!selectedAnnouncement) {
      setError('บันทึกประกาศเป็น Draft ก่อนจึงจะเผยแพร่ได้')
      return
    }

    if (!mayManageAnnouncement(role, selectedAnnouncement)) {
      setError('ไม่มีสิทธิ์เผยแพร่ประกาศของภาควิชานี้')
      return
    }

    if (selectedAnnouncement.status !== 'Draft') {
      setError('เผยแพร่ได้เฉพาะประกาศสถานะ Draft')
      return
    }

    const candidate = { ...selectedAnnouncement, ...form }
    const missing = missingFields(candidate)
    if (missing.length > 0) {
      setError(`เผยแพร่ไม่ได้ ข้อมูลที่ขาด: ${missing.join(', ')}`)
      setFeedback('')
      return
    }

    const timestamp = new Date().toISOString()
    const published = {
      ...candidate,
      status: 'Published',
      published_by: roleIdentity(role),
      published_at: timestamp,
    }
    const changedFields = FORM_FIELDS
      .map(([key]) => key)
      .filter((key) => String(selectedAnnouncement[key] ?? '') !== String(form[key] ?? ''))
    setAnnouncements((items) => items.map((item) => item.id === published.id ? published : item))
    setAuditLogs((items) => [
      ...items,
      makeAuditEntry(published, 'PUBLISH', roleIdentity(role), role, [...changedFields, 'status'], timestamp),
    ])
    setForm(toForm(published))
    setFeedback('เผยแพร่ประกาศสำเร็จ')
    setError('')
  }

  // รองรับ Lifecycle Constraint, ASM-02 และ AC-ANN-04 ตามเวลา Asia/Bangkok
  function runScheduledJob() {
    if (!simulationDate) {
      setError('กรุณาเลือกวันที่รัน Scheduled Job จำลอง')
      setFeedback('')
      return
    }

    const jobTime = new Date(`${simulationDate}T00:05:00+07:00`)
    const expiredItems = announcements.filter((announcement) => {
      if (announcement.status !== 'Published' || !announcement.end_date) return false
      const endOfDay = new Date(`${announcement.end_date}T23:59:59+07:00`)
      return jobTime > endOfDay
    })

    if (expiredItems.length === 0) {
      setFeedback(`รัน Scheduled Job จำลองเวลา 00:05 Asia/Bangkok (${simulationDate}) แล้ว: ไม่มีประกาศที่หมดอายุ`)
      setError('')
      return
    }

    const timestamp = jobTime.toISOString()
    const expiredIds = new Set(expiredItems.map(({ id }) => id))
    setAnnouncements((items) => items.map((item) => (
      expiredIds.has(item.id) ? { ...item, status: 'Expired' } : item
    )))
    setAuditLogs((items) => [
      ...items,
      ...expiredItems.map((item) => makeAuditEntry(
        { ...item, status: 'Expired' },
        'EXPIRE',
        'scheduled-job',
        'SYSTEM',
        ['status'],
        timestamp,
      )),
    ])
    setFeedback(`รัน Scheduled Job จำลองเวลา 00:05 Asia/Bangkok แล้ว: เปลี่ยน ${expiredItems.length} ประกาศเป็น Expired`)
    setError('')
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-800 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
              UC-15 · Recruitment announcement
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">จัดทำประกาศรับสมัคร Lab Boy</h1>
            <p className="mt-2 text-sm text-blue-100">จัดการ Draft, เผยแพร่ และตรวจสอบประวัติประกาศ</p>
          </div>
          <span className="w-fit rounded-full border border-amber-300/40 bg-amber-300/15 px-3 py-2 text-sm font-medium text-amber-100">
            Prototype · Mock Data / Local State
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-blue-950">จำลองผู้ใช้งาน</h2>
            <p className="mt-1 text-sm text-blue-800">
              การเลือก Role ใช้สาธิตการแสดงผลเท่านั้น ไม่ใช่ระบบ Authentication หรือ RBAC สำหรับ Production
            </p>
          </div>
          <label className="grid gap-1 text-sm font-medium text-blue-950">
            Role
            <select
              aria-label="จำลอง Role"
              className="rounded-lg border border-blue-300 bg-white px-3 py-2"
              value={role}
              onChange={(event) => {
                setRole(event.target.value)
                setSelectedId(null)
                setForm(emptyForm())
                setError('')
                setFeedback('')
              }}
            >
              {ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        </section>

        {error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p> : null}
        {feedback ? <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{feedback}</p> : null}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.5fr)]">
          <section aria-labelledby="announcement-list-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 id="announcement-list-title" className="text-lg font-semibold">รายการประกาศ</h2>
                <p className="mt-1 text-sm text-slate-500">พบ {visibleAnnouncements.length} รายการ</p>
              </div>
              {role !== 'Student' ? (
                <button type="button" onClick={startNewDraft} className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800">
                  สร้างประกาศ
                </button>
              ) : null}
            </div>

            <ul className="mt-4 space-y-3">
              {visibleAnnouncements.map((announcement) => (
                <li key={announcement.id}>
                  <button
                    type="button"
                    onClick={() => selectAnnouncement(announcement)}
                    className={`w-full rounded-xl border p-3 text-left transition hover:border-blue-400 ${
                      selectedId === announcement.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                    }`}
                  >
                    <span className="block font-medium">{announcement.title || 'ประกาศไม่มีหัวข้อ'}</span>
                    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[announcement.status]}`}>
                      {STATUS_LABELS[announcement.status]}
                    </span>
                    <span className="mt-2 block text-xs text-slate-500">
                      ภาควิชา {announcement.department_id} · รหัส {announcement.id}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {visibleAnnouncements.length === 0 ? <p className="mt-4 text-sm text-slate-500">ไม่มีประกาศที่แสดงได้</p> : null}
            {role === 'Student' ? (
              <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                Student เห็นเฉพาะประกาศสถานะ Published
              </p>
            ) : null}
          </section>

          <div className="space-y-6">
            {role === 'Student' ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">สิทธิ์การเผยแพร่</h2>
                <p className="mt-2 text-sm text-slate-600">Student ไม่มีสิทธิ์เปลี่ยนสถานะประกาศเป็น Published</p>
                <button
                  type="button"
                  onClick={publishAnnouncement}
                  className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  ทดลองกด Publish
                </button>
              </section>
            ) : (
              <section aria-labelledby="announcement-form-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 id="announcement-form-title" className="text-lg font-semibold">
                      {selectedAnnouncement ? 'รายละเอียดประกาศ' : 'สร้างประกาศ Draft'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedAnnouncement
                        ? `รหัส ${selectedAnnouncement.id} · ${STATUS_LABELS[selectedAnnouncement.status]}`
                        : 'บันทึก Draft ได้แม้ยังกรอกข้อมูลไม่ครบ'}
                    </p>
                  </div>
                  {selectedAnnouncement ? (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[selectedAnnouncement.status]}`}>
                      {selectedAnnouncement.status}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {FORM_FIELDS.map(([key, label, type]) => (
                    <label key={key} className={`grid gap-1.5 text-sm font-medium text-slate-700 ${type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                      {label}
                      {type === 'textarea' ? (
                        <textarea
                          aria-label={label}
                          className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 font-normal"
                          value={form[key]}
                          onChange={(event) => updateForm(key, event.target.value)}
                          readOnly={!canEdit}
                        />
                      ) : (
                        <input
                          aria-label={label}
                          className="rounded-lg border border-slate-300 px-3 py-2 font-normal read-only:bg-slate-50"
                          type={type}
                          value={form[key]}
                          onChange={(event) => updateForm(key, event.target.value)}
                          readOnly={!canEdit || (key === 'department_id' && role === 'Department Staff')}
                        />
                      )}
                    </label>
                  ))}
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <h3 className="font-semibold">Checklist ข้อมูลบังคับก่อนเผยแพร่</h3>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                    {REQUIRED_FIELDS.map(([key, label]) => {
                      const missing = currentMissingFields.includes(key)
                      return (
                        <li key={key} className={`text-sm ${missing ? 'text-rose-700' : 'text-emerald-700'}`}>
                          <span aria-hidden="true">{missing ? '○' : '✓'}</span> {label}
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {selectedAnnouncement?.published_by ? (
                  <dl className="mt-4 grid gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm sm:grid-cols-2">
                    <div><dt className="font-semibold">ผู้เผยแพร่</dt><dd>{selectedAnnouncement.published_by}</dd></div>
                    <div><dt className="font-semibold">เวลาเผยแพร่</dt><dd>{formatTimestamp(selectedAnnouncement.published_at)}</dd></div>
                  </dl>
                ) : null}

                {canEdit ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button type="button" onClick={saveDraft} className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-50">
                      {selectedAnnouncement ? 'บันทึกการแก้ไข Draft' : 'บันทึกฉบับ Draft'}
                    </button>
                    {selectedAnnouncement?.status === 'Draft' ? (
                      <button type="button" onClick={publishAnnouncement} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
                        Publish
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </section>
            )}

            {role !== 'Student' ? (
              <section aria-labelledby="scheduler-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 id="scheduler-title" className="text-lg font-semibold">จำลอง Scheduled Job</h2>
                <p className="mt-1 text-sm text-slate-600">
                  จำลองรอบทำงานเวลา 00:05 ทุกวัน ตาม Asia/Bangkok (UTC+7); จะเปลี่ยนเป็น Expired หลังผ่านสิ้นวัน end_date
                </p>
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <label className="grid gap-1 text-sm font-medium">
                    วันที่รันจำลอง (เวลา 00:05)
                    <input
                      aria-label="วันที่รัน Scheduled Job จำลอง"
                      type="date"
                      value={simulationDate}
                      onChange={(event) => setSimulationDate(event.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </label>
                  <button type="button" onClick={runScheduledJob} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">
                    รัน Scheduled Job จำลอง
                  </button>
                </div>
              </section>
            ) : null}

            {role !== 'Student' ? (
              <section aria-labelledby="audit-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 id="audit-title" className="text-lg font-semibold">Audit Log · อ่านอย่างเดียว</h2>
                <p className="mt-1 text-sm text-slate-500">แสดง action, operator, role, timestamp และ changed_fields · แก้ไข/ลบไม่ได้</p>
                {visibleAuditLogs.length > 0 ? (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-3 py-2">Action</th>
                          <th className="px-3 py-2">Operator / Role</th>
                          <th className="px-3 py-2">Timestamp</th>
                          <th className="px-3 py-2">Changed fields</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleAuditLogs.map((entry) => (
                          <tr key={entry.id} className="border-b border-slate-100 align-top">
                            <td className="px-3 py-3 font-semibold">{entry.action}</td>
                            <td className="px-3 py-3">{entry.operator}<br /><span className="text-xs text-slate-500">{entry.role}</span></td>
                            <td className="whitespace-nowrap px-3 py-3">{formatTimestamp(entry.timestamp)}</td>
                            <td className="px-3 py-3">{entry.changedFields.join(', ') || 'ไม่มีการเปลี่ยนแปลง'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="mt-4 text-sm text-slate-500">ยังไม่มีรายการ Audit Log</p>}
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
