import { useMemo, useState } from 'react';

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
  {
    id: 'round-3',
    name: 'รอบรับสมัครปีการศึกษา 2569 ภาคเรียนที่ 2',
    course: 'วิชา Database Systems',
    isManagedByTeacher: true,
  },
  {
    id: 'round-4',
    name: 'รอบรับสมัครปีการศึกษา 2569 ภาคฤดูร้อน',
    course: 'วิชา Software Testing',
    isManagedByTeacher: true,
  },
];

// Sample applicant records (ASM-01: recorded via UC-01). Fields follow the Q-01 answer; no documents (Q-01).
const applicants = [
  { id: 'applicant-1', studentId: '65010001', name: 'กมลชนก ใจดี', roundId: 'round-1', grade: 'B+', email: 'kamonchanok.j@example.com', phone: '081-000-0001', status: 'รอตรวจสอบ', appliedDate: '12 พ.ย. 69' },
  { id: 'applicant-2', studentId: '65010002', name: 'ธนกฤต มีสุข', roundId: 'round-1', grade: 'A', email: 'thanakrit.m@example.com', phone: '081-000-0002', status: 'รอตรวจสอบ', appliedDate: '12 พ.ย. 69' },
  { id: 'applicant-3', studentId: '64020001', name: 'ผู้สมัครรอบอื่น', roundId: 'round-2', grade: 'B', email: 'other.round@example.com', phone: '081-000-0003', status: 'รอตรวจสอบ', appliedDate: '10 พ.ย. 68' },
  { id: 'applicant-4', studentId: '65010003', name: 'ศิริพร แสงทอง', roundId: 'round-1', grade: 'A', email: 'siriporn.s@example.com', phone: '081-000-0004', status: 'ผ่าน', appliedDate: '11 พ.ย. 69' },
  { id: 'applicant-5', studentId: '66030001', name: 'วีรภัทร ดวงดี', roundId: 'round-3', grade: 'B+', email: 'weerapat.d@example.com', phone: '081-000-0005', status: 'รอตรวจสอบ', appliedDate: '13 พ.ย. 69' },
];

// NFR-SEC-01 / Q-01: the only applicant fields a teacher may see (id, roundId are internal keys, not displayed).
export const TEACHER_VISIBLE_FIELDS = ['id', 'roundId', 'name', 'studentId', 'grade', 'email', 'phone', 'status', 'appliedDate'];

// Supports NFR-SEC-01 (Q-01): strips every field not in TEACHER_VISIBLE_FIELDS before rendering.
export function toTeacherView(applicant) {
  return Object.fromEntries(TEACHER_VISIBLE_FIELDS.map((field) => [field, applicant[field]]));
}

const ALL_STATUSES = 'ทุกสถานะ';

// Supports FR-APP-02: matches applicants by name or student ID (case-insensitive substring) and by status.
export function filterApplicants(list, { query, status }) {
  const keyword = query.trim().toLowerCase();
  return list.filter((applicant) => {
    const matchesQuery = keyword === ''
      || applicant.name.toLowerCase().includes(keyword)
      || applicant.studentId.toLowerCase().includes(keyword);
    const matchesStatus = status === ALL_STATUSES || applicant.status === status;
    return matchesQuery && matchesStatus;
  });
}

// Supports FR-APP-03: reads the round the teacher tries to open from the URL (?round=round-id).
function getRequestedRoundId() {
  return new URLSearchParams(window.location.search).get('round');
}

// Decorative inline icons (presentation only, aria-hidden).
const iconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
const MenuIcon = (props) => <svg viewBox="0 0 24 24" {...iconProps} {...props}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
const BellIcon = (props) => <svg viewBox="0 0 24 24" {...iconProps} {...props}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;
const UserIcon = (props) => <svg viewBox="0 0 24 24" {...iconProps} {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
const UsersIcon = (props) => <svg viewBox="0 0 24 24" {...iconProps} {...props}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" /></svg>;
const CalendarIcon = (props) => <svg viewBox="0 0 24 24" {...iconProps} {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>;
const SearchIcon = (props) => <svg viewBox="0 0 24 24" {...iconProps} {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
const MailIcon = (props) => <svg viewBox="0 0 24 24" {...iconProps} {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
const PhoneIcon = (props) => <svg viewBox="0 0 24 24" {...iconProps} {...props}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>;
const EyeIcon = (props) => <svg viewBox="0 0 24 24" {...iconProps} {...props}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7" /><circle cx="12" cy="12" r="3" /></svg>;
const LockIcon = (props) => <svg viewBox="0 0 24 24" {...iconProps} {...props}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
const ChevronIcon = (props) => <svg viewBox="0 0 24 24" {...iconProps} {...props}><path d="m6 9 6 6 6-6" /></svg>;

// Presentation only: badge colour per status value taken from the data (FR-APP-02 status set comes from data).
function statusBadgeClass(status) {
  if (status === 'ผ่าน') return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  return 'bg-amber-50 text-amber-700 ring-amber-200';
}

// Shared top bar; contains no applicant data (FR-APP-03 denial screen reuses it).
function PageHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button type="button" aria-label="เปิดเมนู" className="rounded-lg p-2 text-[#273d98] transition hover:bg-indigo-50">
            <MenuIcon className="h-5 w-5" />
          </button>
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">อาจารย์</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-[#172554]">รายชื่อผู้สมัคร</span>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-[#172554]">
          <span className="relative rounded-lg p-2" aria-label="การแจ้งเตือน">
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">1</span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm">
            <UserIcon className="h-5 w-5" />
          </span>
        </div>
      </div>
    </header>
  );
}

// Supports FR-APP-01 and NFR-SEC-01 by showing only applicants in rounds managed by the teacher.
// Supports FR-APP-02 and NFR-PERF-01 by searching/filtering by name, student ID, round and status in memory.
// Supports FR-APP-03 and NFR-SEC-01 by denying access to a requested round the teacher does not manage.
export default function ViewApplicantsPage() {
  const managedRounds = rounds.filter((round) => round.isManagedByTeacher);
  const requestedRoundId = getRequestedRoundId();
  const requestedManagedRound = managedRounds.find((round) => round.id === requestedRoundId);
  // Constraint: a requested round without the teacher's permission is denied (FR-APP-03).
  const isAccessDenied = requestedRoundId !== null && !requestedManagedRound;
  const [selectedRoundId, setSelectedRoundId] = useState((requestedManagedRound ?? managedRounds[0]).id);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(ALL_STATUSES);

  const selectedRound = managedRounds.find((round) => round.id === selectedRoundId);
  const roundApplicants = useMemo(
    () => applicants.filter((applicant) => applicant.roundId === selectedRound.id).map(toTeacherView),
    [selectedRound.id],
  );
  // Status options come from the data itself; spec does not define a status set (FR-APP-02).
  const statusOptions = useMemo(
    () => [ALL_STATUSES, ...new Set(roundApplicants.map((applicant) => applicant.status))],
    [roundApplicants],
  );
  const visibleApplicants = useMemo(
    () => filterApplicants(roundApplicants, { query, status }),
    [roundApplicants, query, status],
  );
  const countApplicantsInRound = (roundId) => applicants.filter((applicant) => applicant.roundId === roundId).length;

  // Supports FR-APP-02: filtering by round only offers rounds the teacher manages (NFR-SEC-01).
  const handleRoundChange = (event) => {
    setSelectedRoundId(event.target.value);
    setStatus(ALL_STATUSES);
  };

  // FR-APP-03: no applicant details, round name or course are rendered when access is denied.
  if (isAccessDenied) {
    return (
      <main className="min-h-screen bg-slate-50 text-[#172554]">
        <PageHeader />
        <div className="mx-auto flex max-w-7xl justify-center px-4 py-16 sm:px-6">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <LockIcon className="h-7 w-7" />
            </span>
            <p role="alert" className="mt-5 text-base font-semibold text-red-600">
              คุณไม่มีสิทธิ์เข้าถึงข้อมูลผู้สมัครของรอบรับสมัครนี้
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-[#172554]">
      <PageHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">รายชื่อผู้สมัคร</h1>
            <p className="mt-1 text-sm text-slate-500">ดูรายชื่อ ค้นหา และกรองผู้สมัครในรอบที่คุณรับผิดชอบ</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="round-select" className="text-xs font-medium text-slate-500">เลือกรอบรับสมัคร</label>
            <div className="relative">
              <select id="round-select" value={selectedRound.id} onChange={handleRoundChange} className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-[#172554] shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:min-w-[22rem]">
                {managedRounds.map((round) => (
                  <option key={round.id} value={round.id}>[{round.course.replace('วิชา ', '')}] — {countApplicantsInRound(round.id)} ผู้สมัคร</option>
                ))}
              </select>
              <ChevronIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <section aria-label="สรุปผู้สมัคร" className="mt-6 grid gap-4 md:grid-cols-[16rem_1fr]">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UsersIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm text-slate-500">ผู้สมัครทั้งหมด</p>
              <p className="text-2xl font-bold">{roundApplicants.length} <span className="text-base font-normal text-slate-500">คน</span></p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <CalendarIcon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-slate-500">กำลังดู</p>
              <p className="truncate font-semibold">{selectedRound.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">Sec 1 · พุธ 14:50–16:35 · ห้อง 1227/1,1227/2 จ.1</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="applicant-list-title" className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h2 id="applicant-list-title" className="sr-only">รายการผู้สมัครในรอบนี้</h2>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
              {statusOptions.map((tab) => (
                <button key={tab} type="button" aria-pressed={status === tab} onClick={() => setStatus(tab)} className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-sm transition ${status === tab ? 'bg-white font-semibold text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-[#172554]'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative lg:w-80">
              <label htmlFor="applicant-search" className="sr-only">ค้นหาชื่อหรือรหัสนักศึกษา</label>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input id="applicant-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อหรือรหัสนักศึกษา..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[60rem] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="w-12 px-5 py-3">#</th>
                  <th scope="col" className="px-4 py-3">นักศึกษา</th>
                  <th scope="col" className="px-4 py-3">เกรด</th>
                  <th scope="col" className="px-4 py-3">ข้อมูลติดต่อ</th>
                  <th scope="col" className="px-4 py-3">วันที่สมัคร</th>
                  <th scope="col" className="px-4 py-3">สถานะ</th>
                  <th scope="col" className="px-5 py-3 text-right">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleApplicants.map((applicant, index) => (
                  <tr key={applicant.id} className="transition hover:bg-indigo-50/40">
                    <td className="px-5 py-4 text-slate-400">{index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                          <UserIcon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-[#172554]">{applicant.name}</p>
                          <p className="mt-0.5 font-mono text-xs text-slate-500">{applicant.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 text-sm font-bold text-[#172554]">{applicant.grade}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="flex items-center gap-1.5 text-[#172554]"><MailIcon className="h-3.5 w-3.5 text-slate-400" /><span>{applicant.email}</span></p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><PhoneIcon className="h-3.5 w-3.5 text-slate-400" /><span>{applicant.phone}</span></p>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{applicant.appliedDate}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusBadgeClass(applicant.status)}`}>{applicant.status}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button type="button" aria-label={`ดู ${applicant.name}`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleApplicants.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-sm text-slate-500">
                    ไม่พบผู้สมัคร
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
