# Plan: UC-15 จัดทำประกาศรับสมัคร
Spec Target: [specs/15-15-create-recruitment-announcement/spec.md](specs/15-15-create-recruitment-announcement/spec.md) (v2)

## 1. การรองรับเงื่อนไขใน Spec (Constraints & Scope)
- **ข้อมูลบังคับก่อนเผยแพร่ (FR-ANN-02):** ต้องกรอกครบ `title`, `course_id`, `quota`, `start_date`, `end_date`, `qualifications`, และ `required_documents` ก่อนเปลี่ยนสถานะเป็น `Published`
- **สภาวะของประกาศ (Lifecycle / ASM-02):** ใช้สถานะ `Draft`, `Published`, `Expired`, `Archived`; ประกาศ `Published` หมดอายุเมื่อสิ้นสุดวัน `end_date` เวลา 23:59:59 น. ตาม `Asia/Bangkok (UTC+7)` และ Scheduled Job ทำงานทุกวันเวลา 00:05 น. ตาม time zone เดียวกันเพื่อเปลี่ยนเป็น `Expired`
- **สิทธิ์การเผยแพร่ (RBAC / NFR-SEC-01):** เฉพาะเจ้าหน้าที่ภาควิชาและ Admin ที่มีสิทธิ์เปลี่ยนสถานะเป็น `Published`; Student เผยแพร่ไม่ได้ (นักศึกษาเห็นเฉพาะประกาศ `Published` ตาม ASM-04)
- **การบันทึกประวัติ (NFR-AUD-01):** บันทึก action, operator_id, operator_role, timestamp, และ changed_fields ลงตาราง append-only `announcement_audit_logs`

## 2. รายการ task
- [ ] **T-01:** จัดทำ model และ contract API สำหรับประกาศ (FR-ANN-01, AC-ANN-01)
- [ ] **T-02:** สร้างและบันทึกประกาศแบบ Draft ตาม template (FR-ANN-01, NFR-SEC-01, AC-ANN-01)
- [ ] **T-03:** ตรวจสอบข้อมูลบังคับก่อนเปลี่ยนเป็น Published (FR-ANN-02, NFR-SEC-01, AC-ANN-02)
- [ ] **T-04:** บันทึก audit log และ metadata ของผู้จัดทำ/ผู้เผยแพร่ (FR-ANN-03, NFR-AUD-01, AC-ANN-03)
- [ ] **T-05:** จัดการ lifecycle และเปลี่ยนเป็น Expired อัตโนมัติเมื่อพ้น `end_date` โดย Scheduled Job ทุกวันเวลา 00:05 น. (Lifecycle Constraint, ASM-02, AC-ANN-04)
- [ ] **T-06:** สร้างหน้า Draft form และ checklist สำหรับข้อมูลบังคับ (FR-ANN-01, FR-ANN-02, AC-ANN-01, AC-ANN-02)
- [ ] **T-07:** ต่อหน้าจอกับ API จริงและ workflow เผยแพร่ประกาศ (FR-ANN-02, FR-ANN-03, NFR-SEC-01, ASM-04, AC-ANN-01, AC-ANN-02, AC-ANN-03)
- [ ] **T-08:** ทดสอบยอมรับและ regression สำหรับ UC-15 (FR-ANN-01 ถึง FR-ANN-03, NFR-AUD-01, NFR-SEC-01, ASM-04, AC-ANN-01 ถึง AC-ANN-04)

## 3. รายการตรวจสอบ (Acceptance Criteria Checklist)
- [ ] **AC-ANN-01:** สร้างและบันทึกประกาศ Draft ได้ตาม template จัดเก็บสถานะ Draft และนักศึกษาเห็นเฉพาะประกาศ Published
- [ ] **AC-ANN-02:** ปฏิเสธการเผยแพร่เมื่อข้อมูลบังคับไม่ครบพร้อมแสดงฟิลด์ที่ขาด; เมื่อข้อมูลครบและผู้ใช้มีสิทธิ์ให้เปลี่ยนเป็น Published; Student เผยแพร่ไม่ได้
- [ ] **AC-ANN-03:** บันทึกผู้จัดทำ ผู้เผยแพร่ เวลาเผยแพร่ และ audit log แบบ append-only พร้อมฟิลด์ที่กำหนด
- [ ] **AC-ANN-04:** ถือว่าประกาศ Published หมดอายุเมื่อสิ้นสุดวัน end_date เวลา 23:59:59 น. Asia/Bangkok (UTC+7) และ Scheduled Job เวลา 00:05 น. Asia/Bangkok เปลี่ยนสถานะเป็น Expired

## 4. วัตถุประสงค์ของแผน
- ให้การพัฒนาและการทดสอบสอดคล้องกับ UC-15 และข้อกำหนด v2
- ลดความคลุมเครือของ lifecycle, validation, และสิทธิ์การเผยแพร่
- สร้าง traceability ที่สามารถตรวจสอบได้จาก requirement → implementation → test

## 5. Status
- [x] วิเคราะห์ requirement และคลี่คลายความกำกวมของ spec v2
- [x] ปรับ spec.md เป็นเวอร์ชัน v2
- [x] ตรวจสอบ traceability ให้ถูกต้อง
- [x] ระบุ task ตาม acceptance criteria
- [x] ทีมกำหนดเวลาหมดอายุเป็น 23:59:59 น. และ Scheduled Job ทุกวันเวลา 00:05 น. ตาม Asia/Bangkok (UTC+7)
- [ ] T-05 รอดำเนินการ / ยังไม่ Implement; ยังไม่พบ Scheduler ใน Implementation และ RTM
