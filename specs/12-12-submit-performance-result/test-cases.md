# Test Cases: ส่งผลการปฏิบัติงาน (UC-12)

## ขอบเขตและหลักฐาน

- Test Cases นี้อ้างอิง `spec.md` (FR-RES-01 ถึง FR-RES-03, AC-RES-01 ถึง AC-RES-03, Constraints, NFR-REL-01 และ NFR-AUD-01) และ Scenarios ใน `tasks.md` (T-06)
- Automated Tests ใช้ Vitest, React Testing Library และ jsdom ใน `uc12-demo/src/Prototype.test.jsx`
- รันจริงด้วย `cd uc12-demo && npm test` ได้ผล 8 passed, 0 failed, 0 skipped; ผล replay ล่าสุดอยู่ที่ `uc12-demo/.tsupgrader/runtime-validation/standalone-result.json`
- สถานะ `ผ่าน (Prototype)` หมายถึงยืนยันเฉพาะ UI และ localStorage mock ของ Prototype ไม่ใช่ผลทดสอบ Backend หรือระบบ Production
- TC-NFR-REL-01-01 ยัง Blocked สำหรับ Atomic Transaction จริง; TC-NFR-AUD-01-01 ยัง Blocked สำหรับ Audit Log จริง; TC-CONSTRAINT-RES-01-01 ยัง Blocked สำหรับ Authorization จริง
- ไม่กำหนดฟิลด์ประเมิน วิธีระบุสิทธิ์ รูปแบบเวลา กลไก transaction หรือข้อความแจ้งเตือนที่เอกสารไม่ได้ระบุ; Q-01 เรื่องผู้มีสิทธิ์ปลดล็อกยังเปิดอยู่

## ตาราง Test Cases

| Test Case ID | AC ID | ประเภท | เงื่อนไขก่อนทดสอบ (Precondition) | ขั้นตอนทดสอบ (Test Steps) | ผลลัพธ์ที่คาดหวัง (Expected Result) | Tool | Test Function Name | สถานะ |
|---|---|---|---|---|---|---|---|---|
| TC-AC-RES-01-01 | AC-RES-01; FR-RES-01 | Normal Path / Validation | มีผลประเมินครบทุกคนตามเงื่อนไขที่ระบบกำหนด และผู้ใช้สามารถยืนยันส่งผลได้ | 1. เปิดผลประเมิน 2. ตรวจสอบว่าผลประเมินครบทุกคน 3. ยืนยันส่งผล | ระบบอนุญาตให้ส่งผลเมื่อประเมินครบทุกคน และดำเนินการยืนยันส่งผลต่อได้ | Vitest + React Testing Library (`Prototype.test.jsx`) | `test_submit_when_all_evaluations_complete` | ผ่าน (Prototype) |
| TC-AC-RES-01-02 | AC-RES-01; FR-RES-01; Constraint: ต้องประเมินครบก่อนส่ง | Negative Path / Validation | ผลประเมินยังไม่ครบอย่างน้อยหนึ่งคน | 1. เปิดผลประเมิน 2. ตรวจสอบว่ายังประเมินไม่ครบ 3. พยายามยืนยันส่งผล | ระบบไม่อนุญาตให้ส่งผล และสถานะไม่เปลี่ยนเป็นส่งแล้ว; รายละเอียดข้อความแจ้งเตือนเป็น TBD เพราะไม่ได้ระบุใน spec | Vitest + React Testing Library (`Prototype.test.jsx`) | `test_reject_submission_when_evaluation_incomplete` | ผ่าน (Prototype) |
| TC-AC-RES-01-03 | AC-RES-01; FR-RES-01 | Boundary / Edge Case | ผลประเมินยังไม่ครบก่อนเริ่มทดสอบ และสามารถทำให้ครบทุกคนได้โดยไม่เพิ่มเงื่อนไขหรือข้อมูลเฉพาะที่ไม่มีใน spec | 1. พยายามส่งขณะที่ยังไม่ครบ 2. ตรวจว่าระบบไม่อนุญาต 3. ทำให้ประเมินครบทุกคน 4. ยืนยันส่งผลอีกครั้ง | ก่อนครบ ระบบไม่อนุญาตให้ส่ง; เมื่อครบทุกคน ระบบอนุญาตให้ส่งตาม AC-RES-01 | Vitest + React Testing Library (`Prototype.test.jsx`) | `test_submission_boundary_when_last_evaluation_is_completed` | ผ่าน (Prototype) |
| TC-AC-RES-02-01 | AC-RES-02; FR-RES-03 | Normal Path / State Verification | ผลประเมินครบและส่งผลสำเร็จแล้ว | 1. กลับไปดูข้อมูลผลประเมินหลังส่ง 2. ตรวจสอบสถานะ | สถานะที่แสดงเมื่อกลับมาดูข้อมูลเป็น “ส่งแล้ว” | Vitest + React Testing Library (`Prototype.test.jsx`); localStorage/remount | `test_submitted_status_is_shown_when_revisiting_result` | ผ่าน (Prototype) |
| TC-NFR-AUD-01-01 | ไม่มี AC ระบุโดยตรงใน spec.md; FR-RES-02; NFR-AUD-01 | Auditability | ส่งผลสำเร็จ และเข้าถึงข้อมูล/ประวัติการส่งผลที่ระบบจัดเก็บ | 1. เปิดข้อมูลหรือประวัติการส่งผล 2. ตรวจว่ามีผู้ส่งและเวลาที่ส่งผล 3. ตรวจว่าข้อมูลทั้งสองสัมพันธ์กับผลที่ส่ง | ตรวจสอบย้อนหลังได้ว่าผู้ใดส่งผลและเมื่อใด; รูปแบบเวลาและรูปแบบการจัดเก็บ/ประวัติเป็น TBD หากยังไม่มีข้อกำหนดหรือ implementation | Vitest + React Testing Library (`Prototype.test.jsx`); localStorage จำลองเท่านั้น | `test_submission_audit_records_submitter_and_time` | ผ่าน (Prototype); Blocked (Audit Log จริง) |
| TC-AC-RES-03-01 | AC-RES-03; NFR-REL-01 | Negative Path / Reliability | ผลประเมินครบ; สถานะก่อนส่งยังไม่ใช่ “ส่งแล้ว”; การบันทึกล้มเหลวระหว่างส่ง | 1. เริ่มส่งผล 2. ทำให้การบันทึกล้มเหลวด้วยกลไกทดสอบที่ระบบจริงรองรับ 3. ตรวจสอบสถานะและข้อมูลส่งผลที่บันทึก | สถานะต้องไม่เปลี่ยนเป็น “ส่งแล้ว”; รายละเอียดวิธีจำลองความล้มเหลวเป็น TBD จนกว่าจะมี implementation/environment | Vitest + React Testing Library (`Prototype.test.jsx`); ทดสอบทั้ง failure simulation และ localStorage write failure | `test_status_remains_unsubmitted_when_save_fails` | ผ่าน (Prototype) |
| TC-NFR-REL-01-01 | AC-RES-03; NFR-REL-01 | Reliability / Transaction Integrity | ผลประเมินพร้อมส่ง และสถานะเริ่มต้นยังไม่ใช่ “ส่งแล้ว”; สามารถตรวจสอบผลการบันทึกและการเปลี่ยนสถานะในระบบจริงได้ | 1. ส่งผลและตรวจสอบผลบันทึกกับสถานะเมื่อสำเร็จ 2. ทดสอบอีกครั้งโดยทำให้การบันทึกล้มเหลว 3. ตรวจสอบผลลัพธ์ทั้งสองส่วนหลังความล้มเหลว | การบันทึกผลส่งและการเปลี่ยนสถานะเป็น “ส่งแล้ว” ต้องเป็นธุรกรรมเดียวกัน; เมื่อบันทึกล้มเหลว สถานะต้องไม่เป็น “ส่งแล้ว” และต้องไม่มีการเปลี่ยนสถานะบางส่วนที่ขัดกับธุรกรรมเดียวกัน | Vitest + React Testing Library (`Prototype.test.jsx`) ตรวจเฉพาะการบันทึก localStorage; ไม่มี Backend transaction | `test_submission_record_and_status_change_are_atomic` | ผ่านเฉพาะ Prototype behavior; Blocked (Atomic Transaction จริง) |
| TC-CONSTRAINT-RES-01-01 | Constraint: เมื่อส่งแล้วต้องไม่แก้ไขโดยไม่มีสิทธิ์; ASM-01; Q-01 | Negative Path / Authorization / Edge Case | ผลประเมินส่งแล้ว; ผู้ทดสอบไม่มีสิทธิ์แก้ไขผล; สิทธิ์ปลดล็อกยังไม่กำหนดตาม Q-01 | 1. เปิดผลที่ส่งแล้ว 2. พยายามแก้ไขข้อมูลหรือยกเลิกการส่งโดยไม่มีสิทธิ์ 3. ตรวจสอบข้อมูลและสถานะ | ระบบไม่อนุญาตให้แก้ไขโดยไม่มีสิทธิ์ และข้อมูล/สถานะที่ส่งแล้วไม่ถูกแก้ไข; ไม่ทดสอบหรือกำหนดผู้มีสิทธิ์ปลดล็อกจนกว่า Q-01 จะได้รับคำตอบ | Vitest + React Testing Library (`Prototype.test.jsx`); ตรวจเฉพาะการล็อก UI/ข้อมูลตัวอย่าง | `test_unauthorized_user_cannot_modify_submitted_result` | ผ่าน (Prototype UI); Blocked (Authorization จริง) |

## สรุปความครอบคลุม

| Requirement / AC / Constraint / NFR | Traceability ใน spec.md | Test Case IDs |
|---|---|---|
| FR-RES-01; Constraint: ต้องประเมินครบก่อนส่ง | FR-RES-01 เชื่อมโยงกับ AC-RES-01 | TC-AC-RES-01-01, TC-AC-RES-01-02, TC-AC-RES-01-03 |
| FR-RES-02; NFR-AUD-01 | ไม่มี AC ระบุโดยตรงใน spec.md สำหรับ FR-RES-02 หรือ NFR-AUD-01; มี Test Case สำหรับตรวจ Requirement | TC-NFR-AUD-01-01 |
| FR-RES-03 | FR-RES-03 เชื่อมโยงกับ AC-RES-02 | TC-AC-RES-02-01 |
| NFR-REL-01 | NFR-REL-01 เชื่อมโยงกับ AC-RES-03 | TC-AC-RES-03-01, TC-NFR-REL-01-01 |
| Constraint: เมื่อส่งแล้วต้องไม่แก้ไขโดยไม่มีสิทธิ์; ASM-01; Q-01 | ไม่มี AC ระบุโดยตรงใน spec.md; Q-01 ยังเปิดอยู่และไม่กำหนดผู้มีสิทธิ์ปลดล็อกเอง | TC-CONSTRAINT-RES-01-01 |

## ข้อจำกัดและ Implementation Gap

- **Prototype:** `uc12-demo/src/Prototype.jsx` ใช้ Mock Data และ `localStorage` จำลองสถานะ/ผู้ส่ง/เวลา พร้อมกรณีบันทึกล้มเหลว; ไม่ใช่ Backend หรือระบบ Production
- **ผลทดสอบ Prototype:** Vitest/React Testing Library ผ่าน 8/8; มีการ reset localStorage ก่อนแต่ละ Test และตรวจการคงสถานะหลัง remount
- **ข้อจำกัดระบบจริง:** ไม่มี Backend จึงยืนยัน Atomic Transaction, การจัดเก็บถาวร, Audit Log จริง หรือ Authorization จริงไม่ได้; ผลเหล่านี้เป็น Blocked ไม่ใช่ Passed
- **Build scope:** `uc12-demo` build ผ่าน แต่ Repository root ไม่มี `package.json` และ lockfile จึงยังไม่มีหลักฐาน full-repository build
- **Open Question:** Q-01 เรื่องผู้มีสิทธิ์ปลดล็อกผลหลังส่งยังต้องยืนยันกับเจ้าหน้าที่; เคสสิทธิ์จึงจำกัดการตรวจว่าผู้ไม่มีสิทธิ์แก้ไขไม่ได้ โดยไม่ระบุบทบาทผู้มีสิทธิ์ขึ้นเอง

## Test Results

- Command: `cd uc12-demo && npm test`
- Result: 8 passed, 0 failed, 0 skipped (Prototype automated tests)
- Runtime validation: 3 assertions passed — tests, production build, and HTTP 200 for `/` — ดู `uc12-demo/.tsupgrader/runtime-validation/standalone-result.json`
- Blocked for real-system verification: Atomic Transaction, Audit Log จริง และ Authorization จริง (ไม่มี Backend)
