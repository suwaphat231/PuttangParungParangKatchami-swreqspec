import { useState } from 'react';
import { checkCalendarPeriod } from '../api/calendarCheckApi.js';

const HOURS = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0'));

// รองรับ FR-CAL-01, FR-CAL-05 และ NFR-INT-01 สำหรับฟอร์มและผลตรวจจาก API.
export default function CheckWorkTimePage() {
  const [startDate, setStartDate] = useState('');
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // รองรับ FR-CAL-01 และ FR-CAL-05 โดยส่งช่วงเวลาที่กรอกไปตรวจสอบ.
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    setIsSubmitting(true);

    try {
      const response = await checkCalendarPeriod({
        startDate: `${startDate}T${startHour}:${startMinute}`,
        endDate: `${endDate}T${endHour}:${endMinute}`,
      });
      setResult(response);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'ไม่สามารถตรวจสอบช่วงเวลาได้');
    } finally {
      setIsSubmitting(false);
    }
  }

  const resultClasses = result?.status === 'PASS'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
    : 'border-rose-200 bg-rose-50 text-rose-900';

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-blue-700">UC-19 · ตรวจสอบปฏิทิน</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            ตรวจสอบวันและเวลาปฏิบัติงาน
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            ระบุวันและเวลาที่ต้องการตรวจสอบกับปฏิทินการศึกษา
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-slate-700">ช่วงเวลาเริ่มต้น</legend>
              <div>
                <label htmlFor="calendar-start-date" className="mb-2 block text-sm font-medium text-slate-700">
                  วันที่เริ่มต้น
                </label>
                <input
                  id="calendar-start-date"
                  name="startDate"
                  type="date"
                  required
                  aria-describedby="calendar-datetime-help"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="calendar-start-hour" className="mb-2 block text-sm font-medium text-slate-700">
                    ชั่วโมงเริ่มต้น
                  </label>
                  <select
                    id="calendar-start-hour"
                    name="startHour"
                    required
                    aria-describedby="calendar-datetime-help"
                    value={startHour}
                    onChange={(event) => setStartHour(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="" disabled>เลือกชั่วโมง</option>
                    {HOURS.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="calendar-start-minute" className="mb-2 block text-sm font-medium text-slate-700">
                    นาทีเริ่มต้น
                  </label>
                  <select
                    id="calendar-start-minute"
                    name="startMinute"
                    required
                    aria-describedby="calendar-datetime-help"
                    value={startMinute}
                    onChange={(event) => setStartMinute(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="" disabled>เลือกนาที</option>
                    {MINUTES.map((minute) => <option key={minute} value={minute}>{minute}</option>)}
                  </select>
                </div>
              </div>
            </fieldset>
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-slate-700">ช่วงเวลาสิ้นสุด</legend>
              <div>
                <label htmlFor="calendar-end-date" className="mb-2 block text-sm font-medium text-slate-700">
                  วันที่สิ้นสุด
                </label>
                <input
                  id="calendar-end-date"
                  name="endDate"
                  type="date"
                  required
                  aria-describedby="calendar-datetime-help"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="calendar-end-hour" className="mb-2 block text-sm font-medium text-slate-700">
                    ชั่วโมงสิ้นสุด
                  </label>
                  <select
                    id="calendar-end-hour"
                    name="endHour"
                    required
                    aria-describedby="calendar-datetime-help"
                    value={endHour}
                    onChange={(event) => setEndHour(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="" disabled>เลือกชั่วโมง</option>
                    {HOURS.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="calendar-end-minute" className="mb-2 block text-sm font-medium text-slate-700">
                    นาทีสิ้นสุด
                  </label>
                  <select
                    id="calendar-end-minute"
                    name="endMinute"
                    required
                    aria-describedby="calendar-datetime-help"
                    value={endMinute}
                    onChange={(event) => setEndMinute(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="" disabled>เลือกนาที</option>
                    {MINUTES.map((minute) => <option key={minute} value={minute}>{minute}</option>)}
                  </select>
                </div>
              </div>
            </fieldset>
          </div>
          <p id="calendar-datetime-help" className="text-xs text-slate-500">
            เลือกวันที่ แล้วเลือกชั่วโมง 00–23 และนาที 00–59 เช่น 09:30 ระบบจะส่งช่วงเวลาในรูปแบบ YYYY-MM-DDTHH:mm
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? 'กำลังตรวจสอบ…' : 'ตรวจสอบช่วงเวลา'}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            {error}
          </p>
        )}

        {result && (
          <section
            aria-labelledby="calendar-result-title"
            aria-live="polite"
            className={`mt-6 rounded-2xl border p-5 sm:p-6 ${resultClasses}`}
          >
            <p className="text-sm font-medium">ผลการตรวจสอบ</p>
            <h2 id="calendar-result-title" className="mt-1 text-2xl font-bold">
              {result.status}
            </h2>
            <p className="mt-3 text-sm">{result.reason}</p>
            <dl className="mt-5 grid gap-3 border-t border-current/15 pt-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium">calendarVersion</dt>
                <dd className="mt-1">{result.calendarVersion}</dd>
              </div>
              <div>
                <dt className="font-medium">effectiveDate</dt>
                <dd className="mt-1">
                  <time dateTime={result.effectiveDate}>{result.effectiveDate}</time>
                </dd>
              </div>
            </dl>
          </section>
        )}
      </div>
    </main>
  );
}
