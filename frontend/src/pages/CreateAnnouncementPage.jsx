import { useMemo, useState } from 'react'
import AnnouncementForm from '../components/AnnouncementForm.jsx'
import { announcementApi } from '../api/client.js'

const REQUIRED_FIELDS = [
  'title',
  'course_id',
  'quota',
  'start_date',
  'end_date',
  'qualifications',
  'required_documents',
]

const EMPTY_FORM = {
  title: '',
  course_id: '',
  department_id: 'department-a',
  quota: '',
  description: '',
  qualifications: '',
  start_date: '',
  end_date: '',
  required_documents: '',
}

export default function CreateAnnouncementPage({ api = announcementApi } = {}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [announcement, setAnnouncement] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const missingFields = useMemo(
    () => REQUIRED_FIELDS.filter((field) => {
      const value = form[field]
      if (field === 'required_documents') {
        return !String(value || '').split(',').map((entry) => entry.trim()).filter(Boolean).length
      }
      if (field === 'quota') {
        return value === '' || Number(value) <= 0
      }
      return !String(value ?? '').trim()
    }),
    [form],
  )

  function handleChange(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
  }

  async function handleSaveDraft() {
    try {
      const payload = {
        ...form,
        quota: form.quota ? Number(form.quota) : undefined,
        required_documents: String(form.required_documents || '')
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      }
      const created = await api.createAnnouncement(payload)
      setAnnouncement(created)
      setMessage('บันทึกฉบับร่างสำเร็จ')
    } catch (saveError) {
      setError(saveError.message || 'ไม่สามารถบันทึกฉบับร่างได้')
    }
  }

  async function handlePublish() {
    try {
      const payload = {
        ...form,
        quota: form.quota ? Number(form.quota) : undefined,
        required_documents: String(form.required_documents || '')
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      }
      if (missingFields.length > 0) {
        setError(`ข้อมูลไม่ครบ: ${missingFields.join(', ')}`)
        return
      }
      let nextAnnouncement = announcement
      if (!nextAnnouncement) {
        nextAnnouncement = await api.createAnnouncement({ ...payload, status: 'Draft' })
        setAnnouncement(nextAnnouncement)
      }
      const published = await api.publishAnnouncement(nextAnnouncement.announcement_id)
      setAnnouncement((current) => ({ ...current, ...published, status: 'Published' }))
      setMessage('เผยแพร่ประกาศสำเร็จ')
      setError('')
    } catch (publishError) {
      setError(publishError.message || 'ไม่สามารถเผยแพร่ประกาศได้')
    }
  }

  return (
    <main style={{ maxWidth: '720px', margin: '24px auto', padding: '24px' }}>
      <AnnouncementForm
        form={form}
        missingFields={missingFields}
        error={error}
        message={message}
        onChange={handleChange}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />
    </main>
  )
}
