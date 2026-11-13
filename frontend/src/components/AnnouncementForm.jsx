export default function AnnouncementForm({
  form,
  missingFields,
  error,
  message,
  onChange,
  onSaveDraft,
  onPublish,
}) {
  const fieldConfig = [
    { key: 'title', label: 'หัวข้อประกาศ', type: 'text' },
    { key: 'course_id', label: 'รหัสหลักสูตร', type: 'text' },
    { key: 'department_id', label: 'รหัสภาควิชา', type: 'text' },
    { key: 'quota', label: 'จำนวนที่รับ', type: 'number' },
    { key: 'description', label: 'คำอธิบาย', type: 'text' },
    { key: 'qualifications', label: 'คุณสมบัติ', type: 'text' },
    { key: 'start_date', label: 'วันที่เริ่มรับสมัคร', type: 'date' },
    { key: 'end_date', label: 'วันที่ปิดรับสมัคร', type: 'date' },
    { key: 'required_documents', label: 'เอกสารบังคับ', type: 'text' },
  ]

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <h2>จัดทำประกาศรับสมัคร</h2>
      <div style={{ display: 'grid', gap: '12px' }}>
        {fieldConfig.map(({ key, label, type }) => (
          <label key={key} style={{ display: 'grid', gap: '4px' }}>
            <span>{label}</span>
            <input
              aria-label={label}
              type={type}
              value={form[key] ?? ''}
              onChange={(event) => onChange(key, event.target.value)}
            />
          </label>
        ))}
      </div>

      <div style={{ marginTop: '12px' }}>
        <strong>ข้อมูลบังคับก่อนเผยแพร่:</strong>
        <ul>
          {['title', 'course_id', 'quota', 'start_date', 'end_date', 'qualifications', 'required_documents'].map((field) => (
            <li key={field} style={{ color: missingFields.includes(field) ? '#a00' : '#222' }}>
              {field}
            </li>
          ))}
        </ul>
      </div>

      {error && <div role="alert">{error}</div>}
      {message && <div>{message}</div>}

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button type="button" onClick={onSaveDraft}>บันทึกฉบับร่าง</button>
        <button type="button" onClick={onPublish}>เผยแพร่ประกาศ</button>
      </div>
    </form>
  )
}
