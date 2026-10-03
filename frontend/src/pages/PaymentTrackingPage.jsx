import { useEffect, useState } from 'react'
import PaymentStatusBadge from '../components/PaymentStatusBadge.jsx'

const emptyFilters = {
  student_id: '',
  course_id: '',
  semester: '',
  academic_year: '',
  status: '',
  department_id: '',
}

function formatDateTime(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function PaymentTrackingPage({ api }) {
  const [context, setContext] = useState(null)
  const [filters, setFilters] = useState(emptyFilters)
  const [records, setRecords] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([
      api.getContext(),
      api.listPayments({}),
    ])
      .then(([nextContext, nextRecords]) => {
        if (!active) return
        setContext(nextContext)
        setRecords(nextRecords)
      })
      .catch((loadError) => {
        if (!active) return
        setError(loadError.message || 'ไม่สามารถโหลดข้อมูลการจ่ายเงินได้')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [api])

  async function submitSearch(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const query = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined && value !== null),
      )
      setRecords(await api.listPayments(query))
    } catch (searchError) {
      setError(searchError.message || 'ไม่สามารถค้นหาข้อมูลได้')
    } finally {
      setLoading(false)
    }
  }

  async function openDetails(record) {
    setError('')
    try {
      setSelectedPayment(await api.getPayment(record.payment_id))
    } catch (detailError) {
      setError(detailError.message || 'ไม่สามารถโหลดรายละเอียดการจ่ายเงินได้')
    }
  }

  function updateField(event) {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function clearFilters() {
    setFilters(emptyFilters)
    setError('')
    setLoading(true)
    api.listPayments({})
      .then(setRecords)
      .catch((loadError) => setError(loadError.message || 'ไม่สามารถโหลดข้อมูลได้'))
      .finally(() => setLoading(false))
  }

  return (
    <main className="uc16-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">UC-16 · PAYMENT TRACKING</p>
          <h1>ติดตามและตรวจสอบการจ่ายเงิน</h1>
          <p className="page-subtitle">ตรวจสอบสถานะการจ่ายเงินตามสิทธิ์และระบุรายการที่ต้องดำเนินการต่อ</p>
        </div>
        {context && (
          <div className="role-context" aria-label="บทบาทผู้ใช้งาน">
            <span className="role-indicator" />
            {context.role}
          </div>
        )}
      </header>

      <section className="filter-section" aria-labelledby="search-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ค้นหารายการ</p>
            <h2 id="search-heading">ค้นหาและกรอง</h2>
          </div>
          <span className="result-count">{records.length} รายการ</span>
        </div>

        <form onSubmit={submitSearch} className="filter-grid">
          <label>
            รหัสนักศึกษา
            <input name="student_id" value={filters.student_id} onChange={updateField} />
          </label>
          <label>
            รายวิชา
            <select name="course_id" value={filters.course_id} onChange={updateField}>
              <option value="">ทุกรายวิชา</option>
              {(context?.courses ?? []).map((course) => (
                <option key={course.course_id} value={course.course_id}>{course.course_id}</option>
              ))}
            </select>
          </label>
          <label>
            ภาคการศึกษา
            <select name="semester" value={filters.semester} onChange={updateField}>
              <option value="">ทุกภาค</option>
              <option value="1">ภาคเรียนที่ 1</option>
              <option value="2">ภาคเรียนที่ 2</option>
            </select>
          </label>
          <label>
            ปีการศึกษา
            <input name="academic_year" value={filters.academic_year} onChange={updateField} />
          </label>
          <label>
            สถานะการจ่าย
            <select name="status" value={filters.status} onChange={updateField}>
              <option value="">ทุกสถานะ</option>
              <option value="จ่ายแล้ว">จ่ายแล้ว</option>
              <option value="ยังไม่จ่าย">ยังไม่จ่าย</option>
              <option value="ข้อมูลผิดปกติ">ข้อมูลผิดปกติ</option>
            </select>
          </label>
          {context?.role === 'Admin' && (
            <label>
              Department
              <select name="department_id" value={filters.department_id} onChange={updateField}>
                <option value="">ทุก Department</option>
                {(context.departments ?? []).map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </label>
          )}
          <div className="filter-actions">
            <button type="submit" className="button button-primary">ค้นหา</button>
            <button type="button" className="button button-quiet" onClick={clearFilters}>ล้างตัวกรอง</button>
          </div>
        </form>
      </section>

      {error && <p className="error-banner" role="alert">{error}</p>}

      <section className="results-section" aria-labelledby="results-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">สถานะปัจจุบัน</p>
            <h2 id="results-heading">รายการจ่ายเงิน</h2>
          </div>
        </div>

        {loading ? (
          <p className="loading-state">กำลังโหลดข้อมูล…</p>
        ) : records.length === 0 ? (
          <p className="empty-state">ไม่พบข้อมูลการจ่ายเงินตามเงื่อนไขที่ระบุ</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>รหัสนักศึกษา</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>รายวิชา</th>
                  <th>ภาค/ปี</th>
                  <th>จำนวนเงิน</th>
                  <th>สถานะ</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.payment_id}>
                    <td>{record.student_id}</td>
                    <td>{record.full_name}</td>
                    <td>{record.course_id}</td>
                    <td>{record.semester}/{record.academic_year}</td>
                    <td>{record.amount.toLocaleString('th-TH')}</td>
                    <td>
                      <PaymentStatusBadge status={record.status} flagged={record.needs_action} />
                    </td>
                    <td>
                      <button type="button" className="text-button" onClick={() => openDetails(record)}>รายละเอียด</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedPayment && (
        <aside className="detail-panel" aria-label="รายละเอียดรายการจ่ายเงิน">
          <div className="detail-heading">
            <div>
              <p className="eyebrow">รายละเอียด</p>
              <h2>{selectedPayment.full_name}</h2>
            </div>
            <button type="button" className="button button-quiet" onClick={() => setSelectedPayment(null)}>ปิด</button>
          </div>
          <dl>
            <div><dt>รหัสนักศึกษา</dt><dd>{selectedPayment.student_id}</dd></div>
            <div><dt>รายวิชา</dt><dd>{selectedPayment.course_id}</dd></div>
            <div><dt>Department</dt><dd>{selectedPayment.department_id}</dd></div>
            <div><dt>สถานะล่าสุด</dt><dd><PaymentStatusBadge status={selectedPayment.status} flagged={selectedPayment.needs_action} /></dd></div>
            <div><dt>ยอดเงิน</dt><dd>{selectedPayment.amount.toLocaleString('th-TH')} บาท</dd></div>
            <div><dt>อัปเดตล่าสุด</dt><dd>{formatDateTime(selectedPayment.last_updated_at)}</dd></div>
          </dl>
        </aside>
      )}
    </main>
  )
}
