import { useEffect, useState } from 'react';

const announcement = {
  title: 'รับสมัคร Lab Boy ประจำห้องปฏิบัติการ',
  department: 'ภาควิชาวิทยาการคอมพิวเตอร์',
  period: '1–30 พฤศจิกายน 2569',
  capacity: 12,
  requirements: [
    'เป็นนักศึกษาที่มีสถานะปกติ',
    'ข้อมูลบัญชีผู้ใช้ต้องครบถ้วนก่อนยืนยัน',
  ],
};

const initialForm = {
  fullName: 'ปาริชาติ ใจดี',
  studentId: '6501234567',
  grade: '',
};

const scenarios = [
  { value: 'normal', label: 'นักศึกษาสถานะปกติ' },
  { value: 'registry-unavailable', label: 'ระบบทะเบียนตรวจสอบไม่ได้' },
  { value: 'inactive', label: 'สถานะนักศึกษาไม่ปกติ' },
  { value: 'full', label: 'จำนวนผู้สมัครเต็ม' },
  { value: 'save-failure', label: 'จำลองการบันทึกล้มเหลว' },
];

function formatApplicationTime(date) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok',
  }).format(date);
}

export default function ApplyLabBoyPage() {
  const [form, setForm] = useState(initialForm);
  const [scenario, setScenario] = useState('normal');
  const [application, setApplication] = useState(null);
  const [nextApplicationNumber, setNextApplicationNumber] = useState(1);
  const [dialog, setDialog] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'สมัครเป็น Lab Boy | Prototype';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const isApplied = application && application.status !== 'withdrawn';

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
    setError('');
  }

  function submitApplication() {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = 'กรุณากรอกชื่อ-นามสกุล';
    if (!form.studentId.trim()) errors.studentId = 'กรุณากรอกรหัสนักศึกษา';
    if (!form.grade) errors.grade = 'กรุณาเลือกเกรดเพื่อยืนยัน';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setDialog(null);
      return;
    }

    if (scenario === 'inactive') {
      setError('ไม่สามารถสมัครได้ เนื่องจากสถานะนักศึกษาไม่ปกติ');
      setDialog(null);
      return;
    }
    if (scenario === 'full') {
      setError('ประกาศนี้มีผู้สมัครครบจำนวนที่รับแล้ว');
      setDialog(null);
      return;
    }
    if (scenario === 'save-failure') {
      setError('บันทึกใบสมัครไม่สำเร็จ ระบบไม่ได้สร้างใบสมัคร');
      setDialog(null);
      return;
    }

    const applicationNumber = `LB-2569-${String(nextApplicationNumber).padStart(4, '0')}`;
    const status = scenario === 'registry-unavailable' ? 'pending' : 'confirmed';
    setApplication({
      number: applicationNumber,
      fullName: form.fullName.trim(),
      studentId: form.studentId.trim(),
      grade: form.grade,
      submittedAt: formatApplicationTime(new Date()),
      status,
    });
    setNextApplicationNumber((current) => current + 1);
    setError('');
    setFieldErrors({});
    setDialog(null);
  }

  function withdrawApplication() {
    setApplication((current) => ({ ...current, status: 'withdrawn' }));
    setDialog(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
                UC-01 · สมัครเป็น Lab Boy
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">สมัครเป็น Lab Boy</h1>
              <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
                ดูประกาศและยืนยันใบสมัคร
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/15 px-3 py-2 text-sm font-medium text-amber-100">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-amber-300" />
              Prototype · ข้อมูลจำลอง
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong>ตัวอย่างเพื่อทดลองหน้าจอ</strong>
            {' '}ข้อมูลและการส่งใบสมัครไม่เชื่อมต่อระบบจริง
          </p>
          <p className="text-blue-800">ใช้ข้อมูลบัญชีและยืนยันเกรด · ไม่ต้องแนบเอกสาร</p>
        </div>

        <div className="mx-auto max-w-5xl space-y-6">
          <section aria-labelledby="announcement-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-blue-700">ประกาศที่เปิดรับสมัคร</p>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    เปิดรับสมัคร
                  </span>
                </div>
                <h2 id="announcement-title" className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  {announcement.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{announcement.department}</p>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">ช่วงเวลารับสมัคร</p>
                  <p className="mt-1 font-semibold text-slate-900">{announcement.period}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">จำนวนที่รับ</p>
                  <p className="mt-1 font-semibold text-slate-900">{announcement.capacity} คน</p>
                </div>
              </div>

              <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
                <h3 className="font-semibold text-slate-900">คุณสมบัติและเงื่อนไข</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {announcement.requirements.map((requirement) => (
                    <li key={requirement} className="flex gap-2">
                      <span aria-hidden="true" className="font-bold text-emerald-600">✓</span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
          </section>

          <section aria-labelledby="application-form-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 id="application-form-title" className="text-xl font-semibold text-slate-900">
                    ข้อมูลผู้สมัคร
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    ตรวจสอบและแก้ไขข้อมูลก่อนยืนยันการสมัคร
                  </p>
                </div>
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  ข้อมูลบัญชี · เกรดกรอกโดยผู้สมัคร
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="full-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    id="full-name"
                    name="fullName"
                    value={form.fullName}
                    onChange={updateField}
                    disabled={Boolean(isApplied)}
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    aria-describedby={fieldErrors.fullName ? 'full-name-error' : undefined}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                  />
                  {fieldErrors.fullName ? <p id="full-name-error" className="mt-1 text-sm text-rose-700">{fieldErrors.fullName}</p> : null}
                </div>
                <div>
                  <label htmlFor="student-id" className="mb-1.5 block text-sm font-medium text-slate-700">
                    รหัสนักศึกษา
                  </label>
                  <input
                    id="student-id"
                    name="studentId"
                    value={form.studentId}
                    onChange={updateField}
                    disabled={Boolean(isApplied)}
                    aria-invalid={Boolean(fieldErrors.studentId)}
                    aria-describedby={fieldErrors.studentId ? 'student-id-error' : undefined}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                  />
                  {fieldErrors.studentId ? <p id="student-id-error" className="mt-1 text-sm text-rose-700">{fieldErrors.studentId}</p> : null}
                </div>
                <div>
                  <label htmlFor="student-grade" className="mb-1.5 block text-sm font-medium text-slate-700">
                    เกรดของนักศึกษา (A–F)
                  </label>
                  <select
                    id="student-grade"
                    name="grade"
                    value={form.grade}
                    onChange={updateField}
                    disabled={Boolean(isApplied)}
                    aria-invalid={Boolean(fieldErrors.grade)}
                    aria-describedby={fieldErrors.grade ? 'student-grade-error' : 'student-grade-hint'}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                  >
                    <option value="">เลือกเกรด</option>
                    {'ABCDEF'.split('').map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                  {fieldErrors.grade ? (
                    <p id="student-grade-error" className="mt-1 text-sm text-rose-700">{fieldErrors.grade}</p>
                  ) : (
                    <p id="student-grade-hint" className="mt-1 text-xs text-slate-500">
                      กรอกและยืนยันเกรดตัวอักษร เกรดนี้ไม่ใช้ตัดสินสิทธิ์สมัคร
                    </p>
                  )}
                </div>
              </div>

            <div className="mt-4 max-w-sm">
              <label htmlFor="demo-scenario" className="mb-1.5 block text-sm font-medium text-slate-700">
                ผลจำลองเมื่อยืนยัน
              </label>
              <select
                id="demo-scenario"
                value={scenario}
                disabled={Boolean(isApplied)}
                onChange={(event) => {
                  setScenario(event.target.value);
                  setError('');
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
              >
                {scenarios.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {error ? (
                <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  {error}
                </p>
            ) : null}

            {isApplied ? (
              <ApplicationConfirmation application={application} onWithdraw={() => setDialog('withdraw')} />
            ) : application?.status === 'withdrawn' ? (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="font-semibold text-amber-900">ถอนใบสมัครแล้ว</p>
                <p className="mt-1 text-sm text-amber-800">
                  เลขใบสมัครเดิม {application.number} · สมัครใหม่จะได้รับเลขใบสมัครใหม่
                </p>
              </div>
            ) : null}

            {!isApplied ? (
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setForm(initialForm);
                      setFieldErrors({});
                      setError('');
                    }}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    คืนค่าข้อมูลตัวอย่าง
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setDialog('apply');
                    }}
                    className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    {application?.status === 'withdrawn' ? 'สมัครประกาศนี้อีกครั้ง' : 'ยืนยันการสมัคร'}
                  </button>
                </div>
            ) : null}
          </section>
        </div>
      </div>

      {dialog ? (
        <ConfirmationDialog
          kind={dialog}
          application={application}
          grade={form.grade}
          onCancel={() => setDialog(null)}
          onConfirm={dialog === 'withdraw' ? withdrawApplication : submitApplication}
        />
      ) : null}
    </main>
  );
}

function ApplicationConfirmation({ application, onWithdraw }) {
  const pending = application.status === 'pending';

  return (
    <div className={`mt-5 rounded-xl border p-4 ${pending ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={`font-semibold ${pending ? 'text-amber-900' : 'text-emerald-900'}`}>
            {pending ? 'ส่งใบสมัครแล้ว · รอตรวจสอบ' : 'สมัครสำเร็จ'}
          </p>
          <p className={`mt-1 text-sm ${pending ? 'text-amber-800' : 'text-emerald-800'}`}>
            เลขใบสมัคร {application.number}
          </p>
          <p className={`mt-1 text-sm ${pending ? 'text-amber-800' : 'text-emerald-800'}`}>
            เกรดที่ยืนยัน {application.grade}
          </p>
          <p className={`mt-1 text-sm ${pending ? 'text-amber-800' : 'text-emerald-800'}`}>
            ยืนยันเมื่อ {application.submittedAt}
          </p>
          {pending ? (
            <p className="mt-2 text-sm text-amber-800">ระบบทะเบียนตรวจสอบไม่ได้ จึงส่งให้อาจารย์ดำเนินการต่อ</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onWithdraw}
          className="w-fit rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ถอนใบสมัคร
        </button>
      </div>
    </div>
  );
}

function ConfirmationDialog({ kind, application, grade, onCancel, onConfirm }) {
  const withdrawing = kind === 'withdraw';

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-950/50 p-4" role="presentation">
      <section
        aria-labelledby="confirmation-title"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
      >
        <h2 id="confirmation-title" className="text-xl font-bold text-slate-900">
          {withdrawing ? 'ยืนยันการถอนใบสมัคร' : 'ตรวจสอบก่อนยืนยัน'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {withdrawing
            ? `ต้องการถอนใบสมัคร ${application.number} ใช่หรือไม่? สามารถสมัครประกาศนี้ใหม่ได้ก่อนปิดรับสมัคร`
            : `ยืนยันเกรด ${grade} และส่งใบสมัครใช่หรือไม่? เกรดนี้ไม่ใช้ตัดสินสิทธิ์สมัคร`}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            กลับไปแก้ไข
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${withdrawing ? 'bg-rose-700 hover:bg-rose-800' : 'bg-blue-700 hover:bg-blue-800'}`}
          >
            {withdrawing ? 'ยืนยันถอนใบสมัคร' : 'ยืนยันการสมัคร'}
          </button>
        </div>
      </section>
    </div>
  );
}
