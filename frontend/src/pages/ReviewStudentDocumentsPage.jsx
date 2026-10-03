import { useEffect, useState } from 'react'
import './ReviewStudentDocumentsPage.css'

// Supports FR-OFC-01, FR-OFC-02, and FR-OFC-03 for the document review workflow.
export default function ReviewStudentDocumentsPage({ api }) {
  const [application, setApplication] = useState(null)
  const [requiredDocuments, setRequiredDocuments] = useState([])
  const [reviewStatus, setReviewStatus] = useState('ผ่าน')
  const [reason, setReason] = useState('')
  const [problemDocuments, setProblemDocuments] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const nextApplication = await api.getApplication('application-001')
        const checklist = await api.getDocumentChecklist('application-001')
        if (!active) return
        setApplication(nextApplication)
        setRequiredDocuments(checklist.required_documents || [])
      } catch (loadError) {
        if (!active) return
        setError(loadError.message || 'ไม่สามารถโหลดข้อมูลได้')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [api])

  function toggleDocument(documentName, checked) {
    setProblemDocuments((current) =>
      checked
        ? [...new Set([...current, documentName])]
        : current.filter((item) => item !== documentName),
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      const selectedProblemDocuments = reviewStatus === 'ผ่าน' ? [] : problemDocuments

      const payload = {
        review_status: reviewStatus,
        reason,
        problem_documents: selectedProblemDocuments,
      }

      if (reviewStatus === 'ส่งกลับเพื่อแก้ไข') {
        if (!selectedProblemDocuments.length || !reason.trim()) {
          throw new Error('ต้องระบุเอกสารที่มีปัญหาและเหตุผลก่อนส่งกลับแก้ไข')
        }
      } else if (reviewStatus === 'ไม่ผ่าน' && !reason.trim()) {
        throw new Error('ต้องระบุเหตุผลหรือข้อบกพร่องสำหรับผลตรวจสอบที่ไม่ผ่าน')
      }

      const result = await api.submitReview('application-001', payload)
      if (reviewStatus === 'ส่งกลับเพื่อแก้ไข') {
        setSuccess('ส่งกลับแก้ไขสำเร็จ')
      } else {
        setSuccess('บันทึกผลตรวจสอบสำเร็จ')
      }
      setApplication((current) => ({
        ...current,
        current_status: result.application_status || result.status || reviewStatus,
        last_review_reason: result.reason || reason,
        problem_documents: result.problem_documents || selectedProblemDocuments,
        last_updated_at: result.last_updated_at || current.last_updated_at,
        audit_log: result.audit_log || current.audit_log || [],
      }))
    } catch (submitError) {
      setError(submitError.message || 'ไม่สามารถบันทึกผลตรวจสอบได้')
    }
  }

  if (loading) {
    return <div className="review-doc-shell">กำลังโหลดข้อมูล…</div>
  }

  return (
    <main className="review-doc-shell">
      <header className="review-doc-header">
        <div>
          <p className="eyebrow">UC-14 · DOCUMENT CHECK</p>
          <h1>ตรวจสอบเอกสารนักศึกษา</h1>
          <div className="review-doc-subtitle">
            {application?.student_name || 'นางสาวสมใจ ใจดี'} · {application?.department_id || 'department-a'}
          </div>
        </div>
      </header>

      <section className="review-doc-card">
        <h2>รายการเอกสารที่ต้องตรวจสอบ</h2>
        <div className="doc-list">
          {requiredDocuments.map((documentName) => {
            const inputId = `document-${documentName.replace(/\s+/g, '-').toLowerCase()}`
            return (
              <div key={documentName} className="doc-item">
                <input
                  id={inputId}
                  type="checkbox"
                  checked={problemDocuments.includes(documentName)}
                  onChange={(event) => toggleDocument(documentName, event.target.checked)}
                  aria-label={documentName}
                />
                <label htmlFor={inputId}>{documentName}</label>
              </div>
            )
          })}
        </div>
      </section>

      <form className="review-doc-card review-form" onSubmit={handleSubmit}>
        <h2>ผลการตรวจสอบ</h2>
        <div className="review-status-group">
          <label className="review-status-option">
            <input
              type="radio"
              name="review_status"
              value="ผ่าน"
              checked={reviewStatus === 'ผ่าน'}
              onChange={() => setReviewStatus('ผ่าน')}
              aria-label="ผ่าน"
            />
            <span>ผ่าน</span>
          </label>
          <label className="review-status-option">
            <input
              type="radio"
              name="review_status"
              value="ไม่ผ่าน"
              checked={reviewStatus === 'ไม่ผ่าน'}
              onChange={() => setReviewStatus('ไม่ผ่าน')}
              aria-label="ไม่ผ่าน"
            />
            <span>ไม่ผ่าน</span>
          </label>
          <label className="review-status-option">
            <input
              type="radio"
              name="review_status"
              value="ส่งกลับเพื่อแก้ไข"
              checked={reviewStatus === 'ส่งกลับเพื่อแก้ไข'}
              onChange={() => setReviewStatus('ส่งกลับเพื่อแก้ไข')}
              aria-label="ส่งกลับเพื่อแก้ไข"
            />
            <span>ส่งกลับเพื่อแก้ไข</span>
          </label>
        </div>

        <div className="review-meta">
          <div>
            <strong>รหัสใบสมัคร</strong>
            <span>{application?.application_id || 'application-001'}</span>
          </div>
          <div>
            <strong>สถานะปัจจุบัน</strong>
            <span>{application?.current_status || 'รอตรวจสอบ'}</span>
          </div>
          <div>
            <strong>ตรวจสอบล่าสุด</strong>
            <time dateTime={application?.last_updated_at || undefined}>
              {application?.last_updated_at
                ? new Date(application.last_updated_at).toLocaleString('th-TH')
                : 'ยังไม่มีประวัติการตรวจสอบ'}
            </time>
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label htmlFor="review-reason">เหตุผล/ข้อความแจ้งแก้ไข</label>
          <textarea
            id="review-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            aria-label="เหตุผล/ข้อความแจ้งแก้ไข"
            placeholder="ระบุเหตุผลหรือข้อความแจ้งแก้ไข"
          />
        </div>

        <div className="review-actions">
          <button type="submit" className="primary-button">บันทึกผลตรวจสอบ</button>
          <button type="button" className="secondary-button" onClick={() => setProblemDocuments([])}>
            ล้างรายการ
          </button>
        </div>

        {error && <div className="error-banner" role="alert">{error}</div>}
        {success && <div className="success-banner">{success}</div>}
      </form>

      <section className="review-doc-card audit-section" aria-label="ประวัติการตรวจสอบ">
        <h2>ประวัติการตรวจสอบ</h2>
        {application?.audit_log?.length ? (
          <ol className="audit-list">
            {application.audit_log.map((entry, index) => (
              <li key={`${entry.reviewed_at}-${entry.reviewer_id}-${index}`}>
                <div className="audit-heading">
                  <strong>{entry.status}</strong>
                  <time dateTime={entry.reviewed_at}>
                    {new Date(entry.reviewed_at).toLocaleString('th-TH')}
                  </time>
                </div>
                <div>ผู้ตรวจสอบ: {entry.reviewer_name} ({entry.reviewer_id})</div>
                {entry.problem_documents?.length > 0 && (
                  <div>เอกสารที่มีปัญหา: {entry.problem_documents.join(', ')}</div>
                )}
                {entry.reason && <div>เหตุผล: {entry.reason}</div>}
              </li>
            ))}
          </ol>
        ) : (
          <p>ยังไม่มีประวัติการตรวจสอบ</p>
        )}
      </section>
    </main>
  )
}
