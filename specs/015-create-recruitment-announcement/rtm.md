# RTM: จัดทำประกาศรับสมัคร

อ้างอิง: [spec.md](./spec.md) Draft v2 | [tasks.md](./tasks.md) | [test-cases.md](./test-cases.md)
สร้างด้วย /verify เมื่อ 2026-11-13 15:33 UTC | test: Backend 81 ผ่าน; Frontend 43 ผ่าน, 6 ไม่ผ่าน, 1 todo

ขอบเขต: ตรวจ UC-15 ทั้ง Backend และ Frontend โดยแยกหลักฐานของ React Frontend Prototype (Mock Data/Local State) ออกจากระบบจริง. Automated UC-15 tests ผ่าน 19/19 ใน Frontend suite; ไม่ถือเป็นหลักฐาน API, Database, Authentication/RBAC หรือ Scheduler จริง.

## สรุปผลตาม Acceptance Criteria

| AC | ผล Frontend Prototype | หลักฐาน | ผลระบบจริง |
|---|---|---|---|
| AC-ANN-01 | ผ่านเฉพาะ Prototype; มีช่องโหว่ด้านความครอบคลุมการทดสอบ | TC-ANN-01-1 ถึง TC-ANN-01-5 ผ่าน; F-003 | ยังไม่ถึง: ไม่มีหลักฐาน API หรือ persistence จริง |
| AC-ANN-02 | Workflow หลักผ่านใน Prototype; test สิทธิ์ Admin ยังอ่อน | TC-ANN-02-1 ถึง TC-ANN-02-4 ผ่าน; F-004 | ยังไม่ถึง: ไม่มี API/RBAC จริง |
| AC-ANN-03 | แสดง metadata และ Audit Log จำลอง; test แยกผู้จัดทำ/ผู้เผยแพร่ยังอ่อน | TC-ANN-03-1 ถึง TC-ANN-03-4 ผ่าน; F-005 | ยังไม่ถึง: ไม่มี immutable audit storage จริง |
| AC-ANN-04 | ผ่านเฉพาะการจำลองด้วย Local State | TC-ANN-04-1 ถึง TC-ANN-04-6 ผ่าน | ยังไม่ถึง: ไม่มี Scheduled Job อัตโนมัติจริง |

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)

| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-ANN-01 | AC-ANN-01 | T-01, T-02, T-06, T-08 | `frontend/src/App.jsx`: route; `prototype.jsx`: `FORM_FIELDS`, `saveDraft`, `selectAnnouncement` | TC-ANN-01-1 ถึง TC-ANN-01-5 ผ่านใน Prototype; F-003 | ช่องโหว่ |
| FR-ANN-02 | AC-ANN-02 | T-03, T-06, T-07, T-08 | `prototype.jsx`: `missingFields`, `publishAnnouncement`, `mayManageAnnouncement` | TC-ANN-02-1 ถึง TC-ANN-02-4 ผ่านใน Prototype; F-004 | ช่องโหว่ |
| FR-ANN-03 | AC-ANN-03 | T-04, T-07, T-08 | `prototype.jsx`: `makeAuditEntry`, `saveDraft`, `publishAnnouncement` | TC-ANN-03-1 ถึง TC-ANN-03-4 ผ่านใน Prototype; F-005 | ช่องโหว่ |
| NFR-AUD-01 | AC-ANN-03 | T-04, T-08 | Prototype เพิ่ม Audit Log ใน Local State และแสดงแบบอ่านอย่างเดียว; ไม่พบ `announcement_audit_logs` ในระบบจริง | TC-ANN-03-1 ถึง TC-ANN-03-4 ผ่านเฉพาะ UI/Local State | ยังไม่ถึง |
| NFR-SEC-01 | AC-ANN-01, AC-ANN-02 | T-02, T-03, T-07, T-08 | `prototype.jsx`: `mayManageAnnouncement`, `saveDraft`, `publishAnnouncement`; role selector เป็นตัวจำลอง | TC-ANN-01-3, TC-ANN-01-4, TC-ANN-02-4 ผ่าน; F-004 | ช่องโหว่ |
| Constraint: ฟิลด์บังคับต้องครบก่อน Published (ไม่มี CON ID ใน spec) | AC-ANN-02 | T-03, T-06, T-07 | `prototype.jsx`: `REQUIRED_FIELDS`, `missingFields`, `publishAnnouncement` | TC-ANN-02-1 ถึง TC-ANN-02-3 ผ่านใน Prototype | ยังไม่ถึง |
| Constraint: บันทึก Draft ได้แม้ข้อมูลไม่ครบ (ไม่มี CON ID ใน spec) | AC-ANN-01 | T-02, T-06 | `prototype.jsx`: `saveDraft` | TC-ANN-01-1, TC-ANN-01-2 ผ่านใน Prototype | ยังไม่ถึง |
| Constraint: ผู้จัดทำต้องมีสิทธิ์ภาควิชาและ Admin เผยแพร่ได้ (ไม่มี CON ID ใน spec) | AC-ANN-02, ASM-03 | T-02, T-03, T-07 | `prototype.jsx`: `mayManageAnnouncement`, `publishAnnouncement` | TC-ANN-02-3 ผ่านสำหรับ Staff; TC-ANN-03-2 ตรวจ Audit ของ Admin แต่ไม่ยืนยันสถานะ Published; F-004 | ช่องโหว่ |
| Lifecycle Constraint / ASM-02: Draft → Published → Expired / Archived และเวลาหมดอายุ/Job | AC-ANN-04 | T-05, T-08 | `prototype.jsx`: `runScheduledJob`, `bangkokDate`; ใช้ `Asia/Bangkok` และจำลองเวลา 00:05 | TC-ANN-04-1 ถึง TC-ANN-04-6 ผ่านใน Prototype | ยังไม่ถึง |
| Constraint: Audit Log เป็น append-only (ไม่มี CON ID ใน spec) | AC-ANN-03 | T-04, T-08 | `prototype.jsx`: เพิ่ม entry ด้วย `setAuditLogs`; UI ไม่มีปุ่มแก้ไข/ลบ | TC-ANN-03-3, TC-ANN-03-4 ผ่านเฉพาะ UI/Local State | ยังไม่ถึง |
| ASM-01: มี template สำหรับประกาศ | AC-ANN-01 | T-01, T-02, T-06 | `prototype.jsx`: `FORM_FIELDS`, `emptyForm`, `toForm` | TC-ANN-01-1, TC-ANN-01-2 ผ่าน แต่ยังไม่ตรวจค่าฟิลด์ทั้งหมดหลังบันทึก; F-003 | ช่องโหว่ |
| ASM-02: สถานะมาตรฐาน 4 ระดับ | AC-ANN-04 | T-05, T-08 | `prototype.jsx`: `STATUS_LABELS`, `STATUS_STYLES`, `createInitialState`, `runScheduledJob` | TC-ANN-04-1 ถึง TC-ANN-04-6 ผ่านใน Prototype | ยังไม่ถึง |
| ASM-03: Staff/Admin เผยแพร่ได้ทันทีโดยไม่ต้องอนุมัติกลาง | AC-ANN-02 | T-03, T-07, T-08 | `prototype.jsx`: `publishAnnouncement` | Staff ผ่าน TC-ANN-02-3; การยืนยัน Admin และข้อจำกัด Staff ต่างภาควิชายังไม่ครบ; F-004 | ช่องโหว่ |
| ASM-04: Student เห็นเฉพาะ Published | AC-ANN-01 | T-07, T-08 | React route: `visibleAnnouncements`; legacy `prototype.html`: `renderRecords` แสดงทุกรายการโดยไม่กรอง Role | TC-ANN-01-4 ผ่านสำหรับ React route; พฤติกรรม Student ใน `prototype.html` ขัดกัน; F-002 | ช่องโหว่ |

Q-01 ยืนยันแล้วว่าไม่ต้องมีการอนุมัติกลาง; ไม่พบ workflow อนุมัติกลางใน Prototype.

ผลทดสอบตามคำสั่ง /verify:
- `cd backend && pytest -v` — 81 passed, 1 warning; ไม่พบ test สำหรับ UC-15 ใน Backend
- `cd frontend && npm test` — 43 passed, 6 failed, 1 todo (50 tests); UC-15 ผ่าน 19/19
- Frontend failures ทั้ง 6 อยู่ใน `src/pages/ApplyLabBoyPage.test.jsx`; เป็น baseline ของ UC-01 ที่เคยบันทึกไว้ใน `prompt-log.md` ไม่ใช่ UC-15

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)

| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/App.jsx`: route `/create-announcement` | AC-ANN-01 ถึง AC-ANN-04 | ตรงในขอบเขต Prototype | Route โหลด React Prototype; TC-ANN-01-5 ผ่าน |
| `prototype.jsx`: `FORM_FIELDS`, `emptyForm`, `toForm`, `saveDraft`, `selectAnnouncement` | FR-ANN-01, ASM-01, AC-ANN-01 | ตรงในระดับ Local State | สร้าง/แก้ Draft และเลือกกลับมาเติมฟอร์มได้; ไม่ใช่ persistence จริง |
| `prototype.jsx`: `REQUIRED_FIELDS`, `missingFields`, `mayManageAnnouncement`, `publishAnnouncement` | FR-ANN-02, NFR-SEC-01, ASM-03, AC-ANN-02 | ตรงใน role simulation | ตรวจฟิลด์และ role ก่อนเปลี่ยนสถานะ; ไม่ใช่ API/RBAC จริง |
| `prototype.jsx`: `makeAuditEntry`, `saveDraft`, `publishAnnouncement`, Audit Log table | FR-ANN-03, NFR-AUD-01, AC-ANN-03 | ตรงเฉพาะการจำลอง | มี action/operator/role/timestamp/changedFields ใน Local State; ไม่ยืนยัน immutable storage |
| `prototype.jsx`: `createInitialState`, `runScheduledJob`, `bangkokDate`, `formatTimestamp` | Lifecycle Constraint, ASM-02, AC-ANN-04 | ตรงเฉพาะการจำลอง | เปรียบเทียบ end-of-day ด้วย UTC+7 และจำลอง Job 00:05; ไม่ทำงานอัตโนมัติ |
| `frontend/src/__tests__/RecruitmentAnnouncementPrototype.test.jsx` | AC-ANN-01 ถึง AC-ANN-04 | ผ่าน 19/19 ใน Frontend suite; มี test assertions ที่ยังอ่อนตาม F-003 ถึง F-005 | ไม่ใช่ Backend/System Acceptance Test |
| `frontend/src/components/AnnouncementForm.jsx`: `AnnouncementForm` | FR-ANN-01, FR-ANN-02 | ตัว component มีฟิลด์และ callbacks ที่เกี่ยวข้อง แต่ไม่ถูก import หรือเรียกจาก route ปัจจุบัน | ไม่ใช้เป็นหลักฐาน workflow ที่ผู้ใช้เข้าถึงได้ |
| `specs/015-create-recruitment-announcement/prototype.html`: `renderRecords`, `roleSelect` handler, `publish` | ASM-04, AC-ANN-01/02 | ไม่ตรงกับ ASM-04 เมื่อเปิดไฟล์นี้โดยตรง | Student ถูกปิดปุ่มแก้ไข/เผยแพร่ แต่ `renderRecords` ไม่กรอง Draft/Expired/Archived; ไฟล์นี้ไม่ใช่ route React |
| `backend/app/` (routes, models, services, migrations) | FR-ANN-01 ถึง FR-ANN-03, NFR-AUD-01, NFR-SEC-01, AC-ANN-01 ถึง AC-ANN-04 | ยังไม่พบ implementation UC-15 | ไม่พบ announcement endpoint/model/audit table/Scheduler; API อื่นใน Backend เป็นงานฟีเจอร์อื่น ไม่ใช่หลักฐาน UC-15 |

## 3. ข้อค้นพบ

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | ขอบเขตที่ยังไม่ยืนยัน | ระบบจริง UC-15 | FR-ANN-01 ถึง FR-ANN-03, NFR-AUD-01, NFR-SEC-01, AC-ANN-04 | รอบนี้มีหลักฐานเฉพาะ Frontend Prototype; ยังไม่มี implementation/test สำหรับ API, persistence/database, Authentication/RBAC จริง, immutable audit storage หรือ Scheduled Job อัตโนมัติ จึงยังรับรองระดับระบบจริงไม่ได้ | |
| F-002 | ละเมิด Constraint | `prototype.html`: `renderRecords` | ASM-04, AC-ANN-01 | เมื่อเปลี่ยนเป็น Student ไฟล์ HTML เดิมปิด controls แต่ยัง render ประกาศทุกสถานะโดยไม่กรอง; หากเปิดไฟล์นี้โดยตรง Student จึงเห็น Draft, Expired และ Archived. React route ปัจจุบันกรอง Published ถูกต้อง | |
| F-003 | test อ่อน | `RecruitmentAnnouncementPrototype.test.jsx`: TC-ANN-01-1, TC-ANN-01-2 | FR-ANN-01, ASM-01, AC-ANN-01 | Tests ตรวจชื่อ Draft/สถานะและข้อความบันทึก แต่ไม่ยืนยันว่าค่าฟิลด์ที่กรอกถูกเก็บครบหรือเลือก Draft กลับมาแล้วฟอร์มเติมค่าที่บันทึกไว้; การสูญหายของฟิลด์อื่นนอกจาก title อาจไม่ทำให้ tests เหล่านี้ล้มเหลว | |
| F-004 | test อ่อน | `RecruitmentAnnouncementPrototype.test.jsx`: TC-ANN-02-3, TC-ANN-03-2 และกรณีสิทธิ์ | FR-ANN-02, NFR-SEC-01, ASM-03, AC-ANN-02 | TC-ANN-02-3 ยืนยันการ Publish ของ Staff; TC-ANN-03-2 ตรวจเพียง Audit ของ Admin โดยไม่ยืนยันสถานะ Published. ยังไม่มี test ปฏิเสธ Staff ที่จัดการประกาศต่างภาควิชา จึงพิสูจน์ชุดเงื่อนไขสิทธิ์ได้ไม่ครบ แม้ Prototype มี guard ในโค้ด | |
| F-005 | test อ่อน | `RecruitmentAnnouncementPrototype.test.jsx`: TC-ANN-03-1, TC-ANN-03-2 | FR-ANN-03, AC-ANN-03 | Tests ไม่ยืนยัน metadata ผู้จัดทำแยกจากผู้เผยแพร่: TC-ANN-03-1 ใช้ Staff คนเดียวกันทั้งสองบทบาท ส่วน TC-ANN-03-2 ตรวจ Admin publisher แต่ไม่ยืนยันว่า creator เดิมยังคงอยู่; การทำ `created_by` หายหรือถูกเขียนทับอาจไม่ทำให้ tests ล้มเหลว | |

## 4. แก้แล้ว

ไม่มีข้อค้นพบเดิมที่ยืนยันได้ว่าแก้แล้วในรอบ /verify นี้
