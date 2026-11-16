import { useEffect, useMemo, useState } from 'react';
import { paymentTrackingMockData } from '../mocks/paymentTrackingData.js';

const statusLabels = {
  PAID: 'ชำระแล้ว',
  UNPAID: 'ยังไม่ได้จ่าย',
  ABNORMAL: 'มีความผิดปกติ',
};

const statusClasses = {
  PAID: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  UNPAID: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  ABNORMAL: 'bg-rose-100 text-rose-800 ring-rose-600/20',
};

const statusOptions = [
  { value: 'PAID', label: statusLabels.PAID },
  { value: 'UNPAID', label: statusLabels.UNPAID },
  { value: 'ABNORMAL', label: statusLabels.ABNORMAL },
];

// Supports FR-PAY-02 by formatting a payment amount for presentation.
function formatAmount(payment) {
  const amount = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 2 }).format(payment.amount);
  const currency = payment.currency === 'THB' ? 'บาท' : payment.currency;
  return `${amount} ${currency}`;
}

// Supports FR-PAY-02 and Q-01 by showing the amount and its status in one value.
function AmountAndStatus({ payment }) {
  const label = statusLabels[payment.finance_status] ?? payment.finance_status;
  const statusClass = statusClasses[payment.finance_status] ?? 'bg-slate-100 text-slate-700 ring-slate-500/20';

  return (
    <span className="inline-flex items-center whitespace-nowrap">
      <span className="font-semibold text-slate-900">{formatAmount(payment)}</span>
      {' | '}
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass}`}>
        {label}
      </span>
    </span>
  );
}

// Supports FR-PAY-01 with partial worker-name and exact worker-ID/reference matching.
function filterPayments(payments, query, selectedStatus) {
  const term = query.trim();
  const normalizedTerm = term.toLocaleLowerCase();

  return payments.filter((payment) => {
    const matchesQuery = !term
      || payment.worker_name.toLocaleLowerCase().includes(normalizedTerm)
      || payment.worker_id === term
      || payment.payment_reference === term;
    return matchesQuery && (!selectedStatus || payment.finance_status === selectedStatus);
  });
}

// Supports FR-PAY-01/02/03 and CON: read-only UC-16 presentation with clearly labeled prototype data.
export default function PaymentTrackingPage() {
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'UC-16 | ติดตามและตรวจสอบการจ่ายเงิน';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const payments = paymentTrackingMockData;
  const visiblePayments = useMemo(
    () => filterPayments(payments, query, selectedStatus),
    [payments, query, selectedStatus],
  );
  const summary = useMemo(
    () => payments.reduce((counts, payment) => {
      counts[payment.finance_status] = (counts[payment.finance_status] ?? 0) + 1;
      return counts;
    }, { PAID: 0, UNPAID: 0, ABNORMAL: 0 }),
    [payments],
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
                UC-16 · Payment tracking
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                ติดตามและตรวจสอบการจ่ายเงิน
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
                ตรวจสอบยอด สถานะล่าสุด และรายการที่ต้องติดตาม
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/15 px-3 py-2 text-sm font-medium text-amber-100">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-amber-300" />
              Prototype · ข้อมูลสมมติ ไม่ใช่ข้อมูลการเงินจริง
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section aria-label="สรุปสถานะการจ่ายเงิน" className="grid gap-4 sm:grid-cols-3">
          {statusOptions.map(({ value, label }) => (
            <article key={value} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{summary[value]}</p>
              <p className="mt-1 text-xs text-slate-500">รายการจากข้อมูลจำลองทั้งหมด</p>
            </article>
          ))}
        </section>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.85fr)]">
          <section aria-labelledby="payment-list-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id="payment-list-title" className="text-xl font-semibold text-slate-900">
                    รายการจ่ายเงิน
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    แสดงยอดเงินและสถานะในคอลัมน์เดียวกัน · โหมดอ่านอย่างเดียว
                  </p>
                </div>
                <p className="text-sm text-slate-500" aria-live="polite">
                  พบ {visiblePayments.length} รายการ
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem]">
                <div>
                  <label htmlFor="payment-search" className="mb-1.5 block text-sm font-medium text-slate-700">
                    ค้นหาผู้ปฏิบัติงานหรือรายการ
                  </label>
                  <input
                    id="payment-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="ชื่อบางส่วน, Worker ID หรือเลขอ้างอิง"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label htmlFor="payment-status-filter" className="mb-1.5 block text-sm font-medium text-slate-700">
                    กรองตามสถานะ
                  </label>
                  <select
                    id="payment-status-filter"
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">ทุกสถานะ</option>
                    {statusOptions.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-semibold">ผู้ปฏิบัติงาน</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">ยอดเงิน | สถานะ</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">ติดตามต่อ</th>
                    <th scope="col" className="px-5 py-3.5 text-right font-semibold">รายละเอียด</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visiblePayments.map((payment) => (
                    <tr key={payment.payment_id} className="transition hover:bg-blue-50/50">
                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="font-semibold text-slate-900">{payment.worker_name}</p>
                        <p className="mt-1 text-xs text-slate-500">{payment.worker_id}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <AmountAndStatus payment={payment} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {payment.requires_follow_up
                          ? <span className="font-medium text-rose-700">ต้องติดตาม</span>
                          : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedPayment(payment)}
                          className="rounded-lg px-3 py-2 font-semibold text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
                          aria-label={`ดูรายละเอียด ${payment.payment_id}`}
                        >
                          ดูรายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))}
                  {visiblePayments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-5 py-12 text-center text-sm text-slate-500">
                        ไม่พบรายการที่ตรงกับการค้นหาหรือตัวกรอง
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              ข้อมูลทั้งหมดในหน้านี้เป็นข้อมูลสมมติสำหรับ Prototype เท่านั้น
            </p>
          </section>

          <aside
            aria-label="รายละเอียดรายการจ่ายเงิน"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            {selectedPayment ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-blue-700">รายละเอียดรายการ</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {selectedPayment.payment_id}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPayment(null)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-100"
                  >
                    ปิด
                  </button>
                </div>
                <dl className="mt-6 space-y-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">ผู้ปฏิบัติงาน</dt>
                    <dd className="mt-1 font-semibold text-slate-900">{selectedPayment.worker_name}</dd>
                    <dd className="text-sm text-slate-500">{selectedPayment.worker_id}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">ยอดเงิน | สถานะการจ่าย</dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      <AmountAndStatus payment={selectedPayment} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">เลขอ้างอิง</dt>
                    <dd className="mt-1 font-medium text-slate-900">{selectedPayment.payment_reference}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">สถานะปรับปรุงล่าสุด</dt>
                    <dd className="mt-1 text-sm text-slate-700">
                      <time dateTime={selectedPayment.status_updated_at}>{selectedPayment.status_updated_at}</time>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">ซิงก์ข้อมูลล่าสุด</dt>
                    <dd className="mt-1 text-sm text-slate-700">
                      <time dateTime={selectedPayment.last_synced_at}>{selectedPayment.last_synced_at}</time>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">แหล่งข้อมูล</dt>
                    <dd className="mt-1 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      {selectedPayment.data_source} · ข้อมูลสมมติ
                    </dd>
                  </div>
                  {selectedPayment.requires_follow_up && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-800">
                      รายการนี้ต้องติดตามต่อ
                    </div>
                  )}
                </dl>
                <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
                  Prototype นี้แสดงข้อมูลสมมติและไม่เชื่อมต่อระบบการเงินจริง
                </p>
              </>
            ) : (
              <div className="flex min-h-56 flex-col items-center justify-center text-center">
                <span aria-hidden="true" className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-700">
                  ฿
                </span>
                <h2 className="font-semibold text-slate-900">เลือกรายการเพื่อดูรายละเอียด</h2>
                <p className="mt-1 max-w-xs text-sm text-slate-500">
                  รายละเอียดจะแสดงที่นี่ในรูปแบบอ่านอย่างเดียว
                </p>
              </div>
            )}
          </aside>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          หน้าต้นแบบนี้ไม่ใช่ระบบยืนยันตัวตนหรือขอบเขตบังคับสิทธิ์
        </p>
      </div>
    </main>
  );
}
