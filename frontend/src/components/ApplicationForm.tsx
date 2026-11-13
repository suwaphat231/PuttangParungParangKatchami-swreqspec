import React, { useEffect, useState } from 'react';

const REQUIRED_FIELDS = [
  'full_name',
  'student_id',
  'year_level',
  'email',
  'student_status',
  'grade',
  'emergency_contact',
] as const;

export type ApplicationDraft = Partial<Record<(typeof REQUIRED_FIELDS)[number], string>>;

export default function ApplicationForm({
  initialValues = {},
  onSubmit,
  onCancel,
}: {
  initialValues?: ApplicationDraft;
  onSubmit?: (values: ApplicationDraft) => void;
  onCancel?: (values: ApplicationDraft) => void;
}) {
  const [draft, setDraft] = useState<ApplicationDraft>(initialValues);
  const [lastConfirmed, setLastConfirmed] = useState<ApplicationDraft>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setDraft(initialValues);
    setLastConfirmed(initialValues);
    setErrors({});
  }, [initialValues]);

  const updateField = (field: keyof ApplicationDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validateDraft = (values: ApplicationDraft) => {
    const nextErrors: Record<string, string> = {};

    for (const field of REQUIRED_FIELDS) {
      const value = values[field];
      if (value === undefined || value === null || !String(value).trim()) {
        nextErrors[field] = `กรุณากรอก${field === 'full_name' ? 'ชื่อ-นามสกุล' : field === 'student_id' ? 'รหัสนักศึกษา' : field === 'year_level' ? 'ชั้นปี' : field === 'email' ? 'อีเมลมหาวิทยาลัย' : field === 'student_status' ? 'สถานะนักศึกษา' : field === 'grade' ? 'เกรด' : 'ข้อมูลติดต่อฉุกเฉิน'}`;
      }
    }

    return nextErrors;
  };

  const handleConfirm = () => {
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLastConfirmed(draft);
    onSubmit?.(draft);
  };

  const handleCancel = () => {
    setDraft(lastConfirmed);
    setErrors({});
    onCancel?.(lastConfirmed);
  };

  const fieldLabels: Record<string, string> = {
    full_name: 'ชื่อ-นามสกุล',
    student_id: 'รหัสนักศึกษา',
    year_level: 'ชั้นปี',
    email: 'อีเมลมหาวิทยาลัย',
    student_status: 'สถานะนักศึกษา',
    grade: 'เกรดของนักศึกษา (A–F)',
    emergency_contact: 'ข้อมูลติดต่อฉุกเฉิน',
  };

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div style={{ display: 'grid', gap: '12px' }}>
        {REQUIRED_FIELDS.map((field) => (
          <label key={field} style={{ display: 'grid', gap: '6px' }}>
            <span>{fieldLabels[field]}</span>
            <input
              aria-label={fieldLabels[field]}
              type={field === 'email' ? 'email' : 'text'}
              value={draft[field] ?? ''}
              onChange={(event) => updateField(field, event.target.value)}
            />
            {errors[field] && <small role="alert">{errors[field]}</small>}
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button type="button" onClick={handleCancel}>
          ยกเลิก
        </button>
        <button type="button" onClick={handleConfirm}>
          ยืนยันการสมัคร
        </button>
      </div>
    </form>
  );
}
