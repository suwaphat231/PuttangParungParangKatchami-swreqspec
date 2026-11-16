import React, { useEffect, useRef, useState } from "react";

const storageKey = "uc12-performance-result-prototype";
const people = [
  "กมลชนก วัฒนชัย",
  "ธนกร ศรีสวัสดิ์",
  "ปาริชาติ ใจดี",
  "นรินทร์ พูนผล"
];

function readSubmission() {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    if (
      value &&
      value.status === "submitted" &&
      typeof value.submitter === "string" &&
      typeof value.submittedAt === "string"
    ) {
      return { submission: value, error: false };
    }
    return { submission: null, error: false };
  } catch (error) {
    console.error("ไม่สามารถอ่านสถานะตัวอย่างจากเบราว์เซอร์ได้", error);
    return { submission: null, error: true };
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function Prototype() {
  const [storedState] = useState(() =>
    typeof window === "undefined"
      ? { submission: null, error: false }
      : readSubmission()
  );
  const [screen, setScreen] = useState("list");
  const [scenario, setScenario] = useState("complete");
  const [submission, setSubmission] = useState(storedState.submission);
  const [toast, setToast] = useState(
    storedState.error
      ? {
          message: "ไม่สามารถอ่านข้อมูลตัวอย่างที่บันทึกไว้ได้",
          isError: true
        }
      : null
  );
  const dialogRef = useRef(null);

  const complete = scenario === "complete";
  const submitted = Boolean(submission);
  const completeCount = complete ? people.length : people.length - 1;
  const allDoneLabel = submitted
    ? "ส่งแล้ว"
    : complete
      ? "ประเมินครบทุกคน"
      : "ยังประเมินไม่ครบ";
  const statusKind = submitted
    ? "submitted"
    : complete
      ? "complete"
      : "pending";

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(message, isError = false) {
    setToast({ message, isError });
  }

  function openConfirmation() {
    if (submitted) {
      showToast("ผลการปฏิบัติงานนี้ส่งแล้วและถูกล็อก", true);
      return;
    }
    if (!complete) {
      showToast("ไม่สามารถส่งผลได้ เนื่องจากยังประเมินไม่ครบทุกคน", true);
      return;
    }
    dialogRef.current.showModal();
  }

  function commitSubmission(simulateFailure) {
    if (!complete || submitted) {
      showToast("ไม่สามารถส่งผลได้ โปรดตรวจสอบสถานะผลประเมิน", true);
      return;
    }
    if (simulateFailure) {
      showToast("บันทึกผลไม่สำเร็จ สถานะยังคงเป็นรอส่งผล", true);
      dialogRef.current.close();
      return;
    }

    const nextSubmission = {
      status: "submitted",
      submitter: "อาจารย์ผู้ส่งผล",
      submittedAt: new Date().toISOString()
    };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextSubmission));
    } catch (error) {
      console.error("ไม่สามารถบันทึกผลการส่งตัวอย่างได้", error);
      showToast("บันทึกผลไม่สำเร็จ สถานะยังคงเป็นรอส่งผล", true);
      dialogRef.current.close();
      return;
    }

    setSubmission(nextSubmission);
    dialogRef.current.close();
    setScreen("detail");
    showToast("ส่งผลการปฏิบัติงานสำเร็จ");
  }

  function handleScenarioChange(event) {
    if (submitted) {
      showToast("เปลี่ยนข้อมูลตัวอย่างไม่ได้หลังส่งผลแล้ว", true);
      return;
    }
    setScenario(event.target.value);
  }

  return (
    <>
      <style>{String.raw`:root {
      color-scheme: light;
      --ink: #172b4d;
      --muted: #718096;
      --line: #e6ebf2;
      --surface: #fff;
      --canvas: #f5f7fb;
      --navy: #17345c;
      --teal: #137c78;
      --teal-soft: #e8f5f2;
      --green: #23845b;
      --green-soft: #e8f5ed;
      --amber: #a76b12;
      --amber-soft: #fff5df;
      --red: #bd4a4a;
      --red-soft: #fff0ef;
      --shadow: 0 10px 30px rgb(23 43 77 / 6%);
      font-family: "Noto Sans Thai", "Leelawadee UI", Tahoma, sans-serif;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-width: 320px;
      color: var(--ink);
      background: var(--canvas);
      font-size: 15px;
      line-height: 1.65;
    }

    button { font: inherit; }
    button:focus-visible, a:focus-visible {
      outline: 3px solid #6ab8b2;
      outline-offset: 3px;
    }

    .topbar {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 0 clamp(20px, 5vw, 72px);
      background: var(--surface);
      border-bottom: 1px solid var(--line);
    }

    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-mark {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      color: white;
      background: var(--navy);
      font-weight: 800;
      letter-spacing: -.04em;
    }

    .brand-title { font-size: 14px; font-weight: 750; line-height: 1.35; }
    .brand-subtitle { color: var(--muted); font-size: 11px; }
    .profile { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: var(--navy);
      background: #eaf0f8;
      font-size: 13px;
      font-weight: 750;
    }
    .profile-name { font-size: 13px; font-weight: 650; }
    .profile-role { color: var(--muted); font-size: 11px; }

    .shell {
      width: min(1120px, calc(100% - 40px));
      margin: 0 auto;
      padding: 34px 0 64px;
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 22px;
      color: var(--muted);
      font-size: 12px;
    }
    .breadcrumbs .current { color: var(--ink); font-weight: 650; }
    .crumb-separator { color: #aab4c2; }

    .page-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 22px;
    }
    h1 { margin: 0; font-size: clamp(24px, 3vw, 30px); letter-spacing: -.025em; line-height: 1.35; }
    .page-description { margin: 7px 0 0; color: var(--muted); font-size: 14px; }

    .scenario {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      padding: 8px 10px 8px 13px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: var(--surface);
    }
    .scenario-label { color: var(--muted); font-size: 11px; white-space: nowrap; }
    .scenario select {
      max-width: 150px;
      padding: 5px 25px 5px 8px;
      border: 0;
      border-radius: 7px;
      color: var(--ink);
      background: #f2f5f9;
      font: inherit;
      font-size: 12px;
    }

    .overview {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }
    .stat-card, .panel, .record-card {
      border: 1px solid var(--line);
      border-radius: 16px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }
    .stat-card { display: flex; align-items: center; gap: 13px; padding: 17px 19px; }
    .stat-icon {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      border-radius: 13px;
      color: var(--teal);
      background: var(--teal-soft);
      font-size: 18px;
      font-weight: 800;
    }
    .stat-label { color: var(--muted); font-size: 12px; }
    .stat-value { font-size: 18px; font-weight: 750; line-height: 1.35; }

    .record-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 22px 24px;
      cursor: pointer;
      transition: border-color .16s ease, transform .16s ease, box-shadow .16s ease;
    }
    .record-card:hover {
      border-color: #b7d8d5;
      box-shadow: 0 12px 28px rgb(23 43 77 / 9%);
      transform: translateY(-1px);
    }
    .record-overline { color: var(--muted); font-size: 11px; font-weight: 650; letter-spacing: .04em; }
    .record-title { margin: 3px 0 4px; font-size: 17px; font-weight: 750; }
    .record-meta { color: var(--muted); font-size: 12px; }
    .record-side { display: flex; align-items: center; gap: 18px; }
    .completion { text-align: right; }
    .completion-value { font-weight: 750; }
    .completion-label { color: var(--muted); font-size: 11px; }
    .arrow { color: #8492a6; font-size: 20px; }

    .panel { overflow: hidden; }
    .panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 22px 24px;
      border-bottom: 1px solid var(--line);
    }
    .panel-title { margin: 0; font-size: 17px; font-weight: 750; }
    .panel-subtitle { margin: 4px 0 0; color: var(--muted); font-size: 12px; }
    .panel-body { padding: 20px 24px 24px; }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 22px;
    }
    .summary-item {
      min-height: 72px;
      padding: 11px 14px;
      border: 1px solid var(--line);
      border-radius: 11px;
      background: #fbfcfe;
    }
    .summary-label { color: var(--muted); font-size: 11px; }
    .summary-value { margin-top: 3px; font-size: 13px; font-weight: 700; }

    .section-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 0 0 10px;
      font-size: 14px;
      font-weight: 750;
    }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th {
      padding: 10px 12px;
      color: var(--muted);
      background: #f7f9fc;
      font-size: 11px;
      font-weight: 650;
      white-space: nowrap;
    }
    td { padding: 13px 12px; border-bottom: 1px solid #edf0f5; font-size: 13px; }
    tbody tr:last-child td { border-bottom: 0; }
    .person { display: flex; align-items: center; gap: 10px; min-width: 170px; }
    .person-avatar {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 10px;
      color: #435f85;
      background: #edf2f8;
      font-size: 11px;
      font-weight: 700;
    }
    .person-name { font-weight: 650; }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 9px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }
    .status::before { width: 6px; height: 6px; border-radius: 50%; background: currentColor; content: ""; }
    .status-complete { color: var(--green); background: var(--green-soft); }
    .status-pending { color: var(--amber); background: var(--amber-soft); }
    .status-submitted { color: var(--teal); background: var(--teal-soft); }

    .notice {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-top: 17px;
      padding: 12px 14px;
      border: 1px solid #cfe7df;
      border-radius: 11px;
      color: #356957;
      background: #f0f8f4;
      font-size: 12px;
    }
    .notice.warning { border-color: #f1dfb8; color: #896018; background: #fff9ec; }
    .notice.locked { border-color: #cfe7df; color: #356957; background: #f0f8f4; }
    .notice-symbol { font-weight: 800; }

    .panel-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 17px 24px;
      border-top: 1px solid var(--line);
      background: #fbfcfe;
    }
    .footer-note { color: var(--muted); font-size: 11px; }
    .actions { display: flex; align-items: center; gap: 10px; }
    .button {
      min-height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 15px;
      border: 1px solid transparent;
      border-radius: 9px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      transition: background .16s ease, border-color .16s ease;
    }
    .button-primary { color: #fff; background: var(--teal); }
    .button-primary:hover:not(:disabled) { background: #0e6b68; }
    .button-primary:disabled { color: #8793a2; background: #e5e9ef; cursor: not-allowed; }
    .button-secondary { border-color: var(--line); color: var(--ink); background: #fff; }
    .button-secondary:hover { border-color: #bfccd9; background: #f6f8fb; }
    .text-button {
      padding: 5px 0;
      border: 0;
      color: var(--teal);
      background: transparent;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
    }

    .back-button { margin: 0 0 15px; }
    .detail-heading { margin-bottom: 20px; }
    .hidden { display: none !important; }
    .toast {
      position: fixed;
      z-index: 3;
      top: 88px;
      right: 24px;
      max-width: min(380px, calc(100vw - 32px));
      padding: 13px 17px;
      border: 1px solid #b9ddc9;
      border-radius: 12px;
      color: #226845;
      background: #f0faf4;
      box-shadow: 0 12px 30px rgb(23 43 77 / 13%);
      font-size: 13px;
      font-weight: 650;
    }
    .toast.error { border-color: #f0c5c2; color: #9c3939; background: #fff4f3; }

    dialog {
      width: min(460px, calc(100% - 32px));
      padding: 0;
      border: 0;
      border-radius: 18px;
      color: var(--ink);
      box-shadow: 0 24px 80px rgb(18 36 62 / 28%);
    }
    dialog::backdrop { background: rgb(21 36 57 / 43%); backdrop-filter: blur(2px); }
    .dialog-content { padding: 27px; }
    .dialog-icon {
      width: 46px;
      height: 46px;
      display: grid;
      place-items: center;
      margin-bottom: 15px;
      border-radius: 14px;
      color: var(--teal);
      background: var(--teal-soft);
      font-size: 20px;
      font-weight: 800;
    }
    .dialog-title { margin: 0; font-size: 20px; }
    .dialog-description { margin: 8px 0 18px; color: var(--muted); font-size: 13px; }
    .dialog-summary {
      padding: 13px 15px;
      border-radius: 10px;
      background: #f6f8fb;
      font-size: 12px;
    }
    .dialog-summary strong { display: block; margin-bottom: 4px; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 9px; margin-top: 22px; }
    .test-failure {
      display: block;
      margin: 16px auto 0;
      color: var(--muted);
      font-size: 11px;
      font-weight: 600;
    }

    @media (max-width: 720px) {
      .topbar { height: 64px; padding: 0 16px; }
      .profile-copy { display: none; }
      .shell { width: min(100% - 28px, 600px); padding-top: 24px; }
      .page-heading { flex-direction: column; }
      .scenario { width: 100%; justify-content: space-between; }
      .scenario select { max-width: none; }
      .overview { grid-template-columns: 1fr; gap: 9px; }
      .stat-card { padding: 12px 15px; }
      .stat-icon { width: 38px; height: 38px; }
      .record-card { align-items: flex-start; padding: 18px; }
      .record-side { gap: 9px; }
      .completion { display: none; }
      .panel-header, .panel-body { padding: 17px; }
      .summary-grid { grid-template-columns: 1fr; gap: 8px; }
      .summary-item { min-height: 0; }
      .panel-footer { align-items: stretch; flex-direction: column; padding: 16px 17px; }
      .footer-note { order: 2; }
      .actions { width: 100%; }
      .actions .button { flex: 1; }
      .toast { top: 76px; right: 14px; }
    }

    @media (max-width: 420px) {
      .brand-mark { width: 36px; height: 36px; }
      .brand-title { font-size: 12px; }
      .breadcrumbs { gap: 6px; font-size: 11px; }
      .record-card { gap: 8px; }
      .record-title { font-size: 15px; }
      .arrow { font-size: 16px; }
      .panel-header { flex-direction: column; }
      .panel-header .status { align-self: flex-start; }
      .panel-footer .actions { flex-direction: column-reverse; }
      .panel-footer .actions .button { width: 100%; }
    }
    .prototype-disclaimer { margin-top: 3px; }`}</style>
      <header className="topbar">
        <div className="brand" aria-label="ระบบบริหารงานปฏิบัติการ">
          <div className="brand-mark" aria-hidden="true">OP</div>
          <div>
            <div className="brand-title">ระบบบริหารงานปฏิบัติการ</div>
            <div className="brand-subtitle">
              งานสนับสนุนการเรียนการสอน · Prototype (ไม่มี Backend จริง)
            </div>
          </div>
        </div>
        <div className="profile">
          <div className="avatar" aria-hidden="true">อจ</div>
          <div className="profile-copy">
            <div className="profile-name">อาจารย์ผู้ส่งผล</div>
            <div className="profile-role">ผู้ใช้งาน</div>
          </div>
        </div>
      </header>

      <main className="shell">
        <nav className="breadcrumbs" aria-label="เส้นทางนำทาง">
          <span>หน้าหลัก</span>
          <span className="crumb-separator" aria-hidden="true">/</span>
          <span>ผลการปฏิบัติงาน</span>
          <span className="crumb-separator" aria-hidden="true">/</span>
          <span className="current">
            {screen === "list" ? "รายการผลประเมิน" : "ตรวจสอบผลการประเมิน"}
          </span>
        </nav>

        <section className={screen === "list" ? "" : "hidden"}>
          <div className="page-heading">
            <div>
              <h1>ส่งผลการปฏิบัติงาน</h1>
              <p className="page-description">
                ตรวจสอบความครบถ้วนและยืนยันส่งผลการประเมิน
              </p>
            </div>
            <label className="scenario">
              <span className="scenario-label">ข้อมูลตัวอย่าง</span>
              <select
                value={scenario}
                onChange={handleScenarioChange}
                aria-label="เลือกสถานการณ์ข้อมูลตัวอย่าง"
              >
                <option value="complete">ประเมินครบทุกคน</option>
                <option value="incomplete">ยังประเมินไม่ครบ</option>
              </select>
            </label>
          </div>

          <div className="overview" aria-label="สรุปผลการประเมิน">
            <article className="stat-card">
              <div className="stat-icon" aria-hidden="true">▤</div>
              <div>
                <div className="stat-label">รายการผลประเมิน</div>
                <div className="stat-value">1 รายการ</div>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon" aria-hidden="true">✓</div>
              <div>
                <div className="stat-label">ผลประเมินครบ</div>
                <div className="stat-value">{completeCount} / {people.length} คน</div>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon" aria-hidden="true">↗</div>
              <div>
                <div className="stat-label">สถานะการส่ง</div>
                <div className="stat-value">
                  {submitted ? "ส่งแล้ว" : complete ? "รอส่งผล" : "ประเมินไม่ครบ"}
                </div>
              </div>
            </article>
          </div>

          <button
            className="record-card"
            type="button"
            onClick={() => setScreen("detail")}
            aria-label="เปิดรายการผลการปฏิบัติงาน"
          >
            <div>
              <div className="record-overline">ผลการประเมิน</div>
              <div className="record-title">ผลการปฏิบัติงาน</div>
              <div className="record-meta">
                รายการประเมินผลการปฏิบัติงานของผู้ปฏิบัติงาน
              </div>
            </div>
            <div className="record-side">
              <div className="completion">
                <div className="completion-value">
                  {completeCount} จาก {people.length} คน
                </div>
                <div className="completion-label">ประเมินครบ</div>
              </div>
              <span className={`status status-${statusKind}`}>
                {submitted ? "ส่งแล้ว" : complete ? "พร้อมส่ง" : "ประเมินไม่ครบ"}
              </span>
              <span className="arrow" aria-hidden="true">›</span>
            </div>
          </button>
        </section>

        <section className={screen === "detail" ? "" : "hidden"}>
          <button
            className="text-button back-button"
            type="button"
            onClick={() => setScreen("list")}
          >
            ‹ กลับไปรายการผลประเมิน
          </button>
          <div className="page-heading detail-heading">
            <div>
              <h1>ตรวจสอบผลการประเมิน</h1>
              <p className="page-description">
                ตรวจสอบผลประเมินทุกคนก่อนยืนยันส่ง
              </p>
            </div>
            <span className={`status status-${statusKind}`}>{allDoneLabel}</span>
          </div>

          <article className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">ผลการปฏิบัติงาน</h2>
                <p className="panel-subtitle">ตรวจสอบสถานะการประเมินรายบุคคล</p>
              </div>
              <span className={`status status-${statusKind}`}>{allDoneLabel}</span>
            </div>
            <div className="panel-body">
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-label">จำนวนผู้ปฏิบัติงาน</div>
                  <div className="summary-value">{people.length} คน</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">ผลประเมินครบ</div>
                  <div className="summary-value">
                    {completeCount} จาก {people.length} คน
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">สถานะการส่งผล</div>
                  <div className="summary-value">{submitted ? "ส่งแล้ว" : "รอส่งผล"}</div>
                </div>
              </div>

              <h3 className="section-heading">
                <span>ผลประเมินรายบุคคล</span>
                <span className="record-meta">{people.length} รายการ</span>
              </h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">ผู้ปฏิบัติงาน</th>
                      <th scope="col">ผลประเมิน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {people.map((person, index) => {
                      const evaluated = complete || index < people.length - 1;
                      const personStatus = submitted
                        ? "submitted"
                        : evaluated
                          ? "complete"
                          : "pending";
                      return (
                        <tr key={person}>
                          <td>
                            <div className="person">
                              <span className="person-avatar" aria-hidden="true">
                                {person.slice(0, 1)}
                              </span>
                              <span className="person-name">{person}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`status status-${personStatus}`}>
                              {submitted
                                ? "ส่งผลแล้ว"
                                : evaluated
                                  ? "ประเมินแล้ว"
                                  : "รอประเมิน"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div
                className={`notice${!complete && !submitted ? " warning" : ""}${submitted ? " locked" : ""}`}
                role="status"
                aria-live="polite"
              >
                <span className="notice-symbol" aria-hidden="true">
                  {submitted || complete ? "✓" : "!"}
                </span>
                <span>
                  {submitted
                    ? `ส่งผลโดย${submission.submitter} เมื่อ ${formatDate(submission.submittedAt)} ผลถูกล็อกตามปกติ`
                    : complete
                      ? "ผลประเมินครบทุกคน สามารถยืนยันส่งผลได้"
                      : "ผลประเมินยังไม่ครบทุกคน จึงยังไม่สามารถยืนยันส่งผลได้"}
                </span>
              </div>
            </div>
            <div className="panel-footer">
              <div className="footer-note">
                <div>
                  {submitted
                    ? `ผู้ส่ง: ${submission.submitter} · เวลาส่ง: ${formatDate(submission.submittedAt)}`
                    : "เมื่อส่งแล้ว ผลจะถูกล็อกตามปกติ"}
                </div>
                <div className="prototype-disclaimer">
                  Prototype: localStorage ใช้จำลองการบันทึกเท่านั้น ไม่ใช่ Backend,
                  ธุรกรรม หรือ Audit Log จริง
                </div>
              </div>
              <div className="actions">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setScreen("list")}
                >
                  กลับ
                </button>
                <button
                  className="button button-primary"
                  type="button"
                  onClick={openConfirmation}
                  disabled={submitted || !complete}
                >
                  ยืนยันส่งผล <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>

      {toast && (
        <div
          className={`toast${toast.isError ? " error" : ""}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-label="ยืนยันส่งผลการปฏิบัติงาน"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="dialog-content">
          <div className="dialog-icon" aria-hidden="true">✓</div>
          <h2 className="dialog-title">ยืนยันส่งผลการปฏิบัติงาน?</h2>
          <p className="dialog-description">
            โปรดตรวจสอบความครบถ้วนก่อนยืนยัน เมื่อส่งผลแล้วจะเป็นจุดสิ้นสุดการแก้ไขตามปกติ
          </p>
          <div className="dialog-summary">
            <strong>ผลประเมินครบทุกคน</strong>
            <span>{completeCount} จาก {people.length} คน</span>
          </div>
          <div className="dialog-actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => dialogRef.current.close()}
            >
              กลับไปตรวจสอบ
            </button>
            <button
              className="button button-primary"
              type="button"
              onClick={() => commitSubmission(false)}
            >
              ยืนยันส่งผล
            </button>
          </div>
          <button
            className="text-button test-failure"
            type="button"
            onClick={() => commitSubmission(true)}
          >
            ทดลองกรณีบันทึกล้มเหลว
          </button>
        </div>
      </dialog>
    </>
  );
}
