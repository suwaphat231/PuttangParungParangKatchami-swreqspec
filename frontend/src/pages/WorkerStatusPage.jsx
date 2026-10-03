import { useEffect, useState } from 'react'
import './WorkerStatusPage.css'

const statuses = ['คัดเลือกแล้ว', 'กำลังปฏิบัติงาน', 'ปฏิบัติงานเสร็จสิ้น', 'ยกเลิก/พ้นสภาพ']
const emptyFilters = {
  student_id: '', full_name: '', course_id: '', semester: '', academic_year: '',
  work_period_from: '', work_period_to: '', status: '', department_id: '',
}

// Supports FR-WKS-03 with a complete localized date and time.
function formatDateTime(value) {
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'long', timeStyle: 'medium' }).format(new Date(value))
}

function formatDate(value) {
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'long' }).format(new Date(`${value}T00:00:00`))
}

// Supports FR-WKS-01, FR-WKS-02, FR-WKS-03, and Q-01.
export default function WorkerStatusPage({ api }) {
  const [context, setContext] = useState(null)
  const [filters, setFilters] = useState(emptyFilters)
  const [workers, setWorkers] = useState([])
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [period, setPeriod] = useState({ period_from: '', period_to: '' })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([api.getContext(), api.listWorkers({})])
      .then(([nextContext, nextWorkers]) => {
        if (!active) return
        setContext(nextContext)
        setWorkers(nextWorkers)
      })
      .catch((loadError) => { if (active) setError(loadError.message || 'ไม่สามารถโหลดข้อมูลได้') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [api])

  // Supports FR-WKS-02 by submitting all chosen criteria to the OR-filter API.
  async function submitSearch(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''))
      setWorkers(await api.listWorkers(query))
    } catch (searchError) {
      setError(searchError.message || 'ไม่สามารถค้นหาข้อมูลได้')
    } finally {
      setLoading(false)
    }
  }

  // Supports FR-WKS-03 by loading a principal-scoped detail.
  async function openDetails(worker) {
    setError('')
    try {
      setSelectedWorker(await api.getWorker(worker.worker_id, filters.department_id || undefined))
    } catch (detailError) {
      setError(detailError.message || 'ไม่สามารถโหลดรายละเอียดได้')
    }
  }

  // Supports Q-01 and AC-WKS-04 by requesting a status summary for a period.
  async function submitReport(event) {
    event.preventDefault()
    if (!period.period_from || !period.period_to) return
    setError('')
    try {
      setReport(await api.getStatusReport({ ...period, department_id: filters.department_id || undefined }))
    } catch (reportError) {
      setError(reportError.message || 'ไม่สามารถโหลดรายงานได้')
    }
  }

  function updateField(setter) {
    return (event) => {
      const { name, value } = event.target
      setter((current) => ({ ...current, [name]: value }))
    }
  }

  function clearFilters() {
    setFilters(emptyFilters)
    setError('')
    setLoading(true)
    api.listWorkers({})
      .then(setWorkers)
      .catch((loadError) => setError(loadError.message || 'ไม่สามารถโหลดข้อมูลได้'))
      .finally(() => setLoading(false))
  }

  return (
    <main className="uc13-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">UC-13 · WORKFORCE</p>
          <h1>ตรวจสอบสถานะผู้ปฏิบัติงาน</h1>
          <p className="page-subtitle">รายการ Lab Boy ตามรายวิชาและสิทธิ์ของผู้ใช้งาน</p>
        </div>
        {context && <div className="role-context" aria-label="บทบาทผู้ใช้งาน"><span className="role-indicator" />{context.role}</div>}
      </header>

      <section className="filter-section" aria-labelledby="search-heading">
        <div className="section-heading">
          <div><p className="eyebrow">ค้นหารายการ</p><h2 id="search-heading">ค้นหาและกรอง</h2></div>
          <span className="result-count">{workers.length} รายการ</span>
        </div>
        <form onSubmit={submitSearch} className="filter-grid">
          <label>รหัสนักศึกษา<input name="student_id" value={filters.student_id} onChange={updateField(setFilters)} /></label>
          <label>ชื่อ-นามสกุล<input name="full_name" value={filters.full_name} onChange={updateField(setFilters)} /></label>
          <label>รายวิชา
            <select name="course_id" value={filters.course_id} onChange={updateField(setFilters)}>
              <option value="">ทุกรายวิชา</option>
              {(context?.courses ?? []).map((course) => <option key={course.course_id} value={course.course_id}>{course.course_id}</option>)}
            </select>
          </label>
          <label>ภาคการศึกษา
            <select name="semester" value={filters.semester} onChange={updateField(setFilters)}>
              <option value="">ทุกภาคการศึกษา</option><option value="1">ภาคเรียนที่ 1</option><option value="2">ภาคเรียนที่ 2</option>
            </select>
          </label>
          <label>ปีการศึกษา<input name="academic_year" value={filters.academic_year} onChange={updateField(setFilters)} inputMode="numeric" /></label>
          <label>เริ่มช่วงปฏิบัติงาน<input type="date" name="work_period_from" value={filters.work_period_from} onChange={updateField(setFilters)} /></label>
          <label>สิ้นสุดช่วงปฏิบัติงาน<input type="date" name="work_period_to" value={filters.work_period_to} onChange={updateField(setFilters)} /></label>
          <label>สถานะ
            <select name="status" value={filters.status} onChange={updateField(setFilters)}>
              <option value="">ทุกสถานะ</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          {context?.role === 'Admin' && <label>Department
            <select name="department_id" value={filters.department_id} onChange={updateField(setFilters)}>
              <option value="">ทุก Department</option>{context.departments.map((department) => <option key={department} value={department}>{department}</option>)}
            </select>
          </label>}
          <div className="filter-actions">
            <button type="submit" className="button button-primary">ค้นหา</button>
            <button type="button" className="button button-quiet" onClick={clearFilters}>ล้างตัวกรอง</button>
          </div>
        </form>
      </section>

      {error && <p className="error-banner" role="alert">{error}</p>}

      <section className="results-section" aria-labelledby="results-heading">
        <div className="section-heading"><div><p className="eyebrow">สถานะปัจจุบัน</p><h2 id="results-heading">ผู้ปฏิบัติงาน</h2></div></div>
        {loading ? <p className="loading-state">กำลังโหลดข้อมูล…</p> : workers.length === 0 ? (
          <p className="empty-state">ไม่พบข้อมูลผู้ปฏิบัติงานตามเงื่อนไขที่ระบุ</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead><tr><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th><th>รายวิชา</th><th>ภาค/ปี</th><th>ช่วงปฏิบัติงาน</th><th>สถานะล่าสุด</th><th><span className="sr-only">รายละเอียด</span></th></tr></thead>
              <tbody>{workers.map((worker) => (
                <tr key={worker.worker_id}>
                  <td className="student-id">{worker.student_id}</td><td>{worker.full_name}</td><td>{worker.course_id}</td>
                  <td>{worker.semester}/{worker.academic_year}</td>
                  <td>{formatDate(worker.work_period_start)} – {formatDate(worker.work_period_end)}</td>
                  <td><span className={`status status-${statuses.indexOf(worker.status)}`}>{worker.status}</span></td>
                  <td><button className="text-button" type="button" onClick={() => openDetails(worker)}>รายละเอียด</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>

      <section className="report-section" aria-labelledby="report-heading">
        <div className="report-copy"><p className="eyebrow">ภาพรวมตามช่วงเวลา</p><h2 id="report-heading">รายงานสรุปสถานะ</h2></div>
        <form className="report-form" onSubmit={submitReport}>
          <label>จากวันที่<input required type="date" name="period_from" value={period.period_from} onChange={updateField(setPeriod)} /></label>
          <label>ถึงวันที่<input required type="date" name="period_to" value={period.period_to} onChange={updateField(setPeriod)} /></label>
          <button className="button button-dark" type="submit">สรุปรายงาน</button>
        </form>
        {report && <div className="report-results" aria-live="polite">
          <p className="report-total">รวม <strong>{report.total}</strong> รายการ</p>
          <div className="report-breakdown">{statuses.map((status) => (
            <div className="report-stat" key={status}><span>{status}</span><strong>{report.by_status[status] ?? 0}</strong></div>
          ))}</div>
        </div>}
      </section>

      {selectedWorker && <aside className="detail-panel" aria-label="รายละเอียดผู้ปฏิบัติงาน">
        <div className="detail-heading"><div><p className="eyebrow">รายละเอียด</p><h2>{selectedWorker.full_name}</h2></div>
          <button type="button" className="button button-quiet" onClick={() => setSelectedWorker(null)}>ปิด</button>
        </div>
        <dl>
          <div><dt>รหัสนักศึกษา</dt><dd>{selectedWorker.student_id}</dd></div>
          <div><dt>Department / รายวิชา</dt><dd>{selectedWorker.department_id} / {selectedWorker.course_id}</dd></div>
          <div><dt>สถานะล่าสุด</dt><dd>{selectedWorker.status}</dd></div>
          <div><dt>ช่วงปฏิบัติงาน</dt><dd>{formatDate(selectedWorker.work_period_start)} – {formatDate(selectedWorker.work_period_end)}</dd></div>
          <div><dt>ข้อมูลอัปเดตล่าสุด</dt><dd><time dateTime={selectedWorker.last_updated_at}>{formatDateTime(selectedWorker.last_updated_at)}</time></dd></div>
        </dl>
      </aside>}
    </main>
  )
}