const rounds = [
  {
    id: 'round-1',
    name: 'รอบรับสมัครปีการศึกษา 2569',
    course: 'วิชา Software Requirement Specification',
    isManagedByTeacher: true,
  },
  {
    id: 'round-2',
    name: 'รอบรับสมัครปีการศึกษา 2568',
    course: 'วิชา Software Project Management',
    isManagedByTeacher: false,
  },
];

const applicants = [
  { id: 'applicant-1', studentId: '65010001', name: 'กมลชนก ใจดี', roundId: 'round-1', status: 'รอตรวจสอบ' },
  { id: 'applicant-2', studentId: '65010002', name: 'ธนกฤต มีสุข', roundId: 'round-1', status: 'รอตรวจสอบ' },
  { id: 'applicant-3', studentId: '64020001', name: 'ผู้สมัครรอบอื่น', roundId: 'round-2', status: 'รอตรวจสอบ' },
];

// Supports FR-APP-01 and NFR-SEC-01 by showing only applicants in rounds managed by the teacher.
export default function ViewApplicantsPage() {
  const managedRounds = rounds.filter((round) => round.isManagedByTeacher);
  const selectedRound = managedRounds[0];
  const visibleApplicants = applicants.filter((applicant) => applicant.roundId === selectedRound.id);

  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#172554]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-5">
            <button type="button" aria-label="เปิดเมนู" className="text-2xl leading-none text-[#273d98]">☰</button>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-500">อาจารย์</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-[#172554]">รายชื่อผู้สมัคร</span>
            </div>
          </div>
          <div className="flex items-center gap-5 text-[#172554]">
            <span className="relative text-xl" aria-label="การแจ้งเตือน">
              ♧<span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">1</span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-lg">●</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-9">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">รายชื่อผู้สมัคร</h1>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="rounded-lg bg-[#17a34a] px-5 py-3 text-sm font-semibold text-white shadow-sm">
              ✓ รับทั้งหมด ({visibleApplicants.length})
            </button>
            <label htmlFor="round-select" className="sr-only">เลือกรอบรับสมัคร</label>
            <select id="round-select" value={selectedRound.id} onChange={() => {}} className="min-w-[21rem] rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-[#172554] shadow-sm">
              <option value={selectedRound.id}>[{selectedRound.course.replace('วิชา ', '')}] — {visibleApplicants.length} ผู้สมัคร</option>
            </select>
          </div>
        </div>

        <section aria-label="สรุปผู้สมัคร" className="mt-6 grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[10rem_1fr_21rem]">
          <p className="sr-only">{selectedRound.name}</p>
          <div className="border-b border-slate-200 pb-4 md:border-b-0 md:border-r md:pb-0">
            <p className="text-sm text-slate-500">ผู้สมัครทั้งหมด</p>
            <p className="mt-2 text-2xl font-bold">{visibleApplicants.length} <span className="text-base font-normal">คน</span></p>
          </div>
          <div className="md:px-2">
            <div className="flex justify-between text-sm">
              <p className="text-slate-500">Lab Boy ที่รับแล้ว</p>
              <strong>0 / 5 คน</strong>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div className="h-full w-0 rounded-full bg-[#3949ab]" />
            </div>
            <p className="mt-2 text-xs text-slate-500">ยังรับได้อีก 5 คน</p>
          </div>
          <div className="border-t border-slate-200 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <p className="text-sm text-slate-500">กำลังดู</p>
            <p className="mt-2 text-sm font-semibold">Sec 1 · พุธ 14:50–16:35 · ห้อง 1227/1,1227/2 จ.1</p>
          </div>
        </section>

        <section aria-labelledby="applicant-list-title" className="mt-6">
          <h2 id="applicant-list-title" className="sr-only">รายการผู้สมัครในรอบนี้</h2>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['ทุกสถานะ', 'รอพิจารณา', 'ผ่าน', 'ไม่ผ่าน', 'ถอน'].map((tab, index) => (
                <button key={tab} type="button" className={`whitespace-nowrap rounded-full border px-5 py-2 text-sm ${index === 0 ? 'border-[#3949ab] bg-[#3949ab] font-semibold text-white' : 'border-slate-200 bg-white text-slate-500'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <label htmlFor="applicant-search" className="sr-only">ค้นหาชื่อหรือรหัสนักศึกษา</label>
            <input id="applicant-search" type="search" placeholder="ค้นหาชื่อหรือรหัสนักศึกษา..." className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3949ab] focus:ring-2 focus:ring-indigo-100" />
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead className="bg-[#f0f2f9] text-xs text-slate-500">
                  <tr>
                    <th scope="col" className="w-12 px-4 py-4"><input type="checkbox" aria-label="เลือกผู้สมัครทั้งหมด" /></th>
                    <th scope="col" className="w-12 px-2 py-4">#</th>
                    <th scope="col" className="px-4 py-4">นักศึกษา</th>
                    <th scope="col" className="px-4 py-4">เกรด</th>
                    <th scope="col" className="px-4 py-4">วันที่สมัคร</th>
                    <th scope="col" className="px-4 py-4">สถานะ</th>
                    <th scope="col" className="px-4 py-4 text-right">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleApplicants.map((applicant, index) => (
                    <tr key={applicant.id}>
                      <td className="px-4 py-5"><input type="checkbox" aria-label={`เลือก ${applicant.name}`} /></td>
                      <td className="px-2 py-5 text-slate-500">{index + 1}</td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500">●</span>
                          <div>
                            <p className="font-semibold text-[#172554]">{applicant.name}</p>
                            <p className="mt-1 text-xs text-slate-500">{applicant.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 font-semibold">B+</td>
                      <td className="px-4 py-5 text-slate-500">12 พ.ย. 69</td>
                      <td className="px-4 py-5">
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">{applicant.status}</span>
                      </td>
                      <td className="px-4 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button type="button" aria-label={`รับ ${applicant.name}`} className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600">✓ รับ</button>
                          <button type="button" aria-label={`ไม่รับ ${applicant.name}`} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">× ไม่รับ</button>
                          <button type="button" aria-label={`ดู ${applicant.name}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500">⊙</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
