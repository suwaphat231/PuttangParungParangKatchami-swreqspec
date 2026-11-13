import React from 'react';

export type ApplicationStatusCardProps = {
  application?: {
    number?: string;
    grade?: string;
    submittedAt?: string;
    status?: 'pending' | 'confirmed' | 'withdrawn';
  };
  onWithdraw?: () => void;
};

export default function ApplicationStatusCard({
  application,
  onWithdraw,
}: ApplicationStatusCardProps) {
  if (!application) {
    return null;
  }

  const pending = application.status === 'pending';
  const withdrawn = application.status === 'withdrawn';

  return (
    <div className={`mt-5 rounded-xl border p-4 ${pending ? 'border-amber-200 bg-amber-50' : withdrawn ? 'border-slate-200 bg-slate-50' : 'border-emerald-200 bg-emerald-50'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={`font-semibold ${pending ? 'text-amber-900' : withdrawn ? 'text-slate-900' : 'text-emerald-900'}`}>
            {pending ? 'ส่งใบสมัครแล้ว · รอตรวจสอบ' : withdrawn ? 'ถอนใบสมัครแล้ว' : 'สมัครสำเร็จ'}
          </p>
          {application.number ? (
            <p className={`mt-1 text-sm ${pending ? 'text-amber-800' : withdrawn ? 'text-slate-700' : 'text-emerald-800'}`}>
              เลขใบสมัคร {application.number}
            </p>
          ) : null}
          {application.grade ? (
            <p className={`mt-1 text-sm ${pending ? 'text-amber-800' : withdrawn ? 'text-slate-700' : 'text-emerald-800'}`}>
              เกรดที่ยืนยัน {application.grade}
            </p>
          ) : null}
          {application.submittedAt ? (
            <p className={`mt-1 text-sm ${pending ? 'text-amber-800' : withdrawn ? 'text-slate-700' : 'text-emerald-800'}`}>
              ยืนยันเมื่อ {application.submittedAt}
            </p>
          ) : null}
          {pending ? (
            <p className="mt-2 text-sm text-amber-800">ระบบทะเบียนตรวจสอบไม่ได้ จึงส่งให้อาจารย์ดำเนินการต่อ</p>
          ) : null}
          {withdrawn && application.number ? (
            <p className="mt-2 text-sm text-slate-700">เลขใบสมัครเดิม {application.number} · สมัครใหม่จะได้รับเลขใบสมัครใหม่</p>
          ) : null}
        </div>

        {!withdrawn && onWithdraw ? (
          <button
            type="button"
            onClick={onWithdraw}
            className="w-fit rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ถอนใบสมัคร
          </button>
        ) : null}
      </div>
    </div>
  );
}
