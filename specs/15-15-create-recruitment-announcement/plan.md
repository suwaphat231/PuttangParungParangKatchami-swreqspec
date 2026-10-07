# Plan: UC-15 จัดทำประกาศรับสมัคร
Spec Target: [specs/15-15-create-recruitment-announcement/spec.md](specs/15-15-create-recruitment-announcement/spec.md) (v2)

## 1. การรองรับเงื่อนไขใน Spec (Constraints & Scope)
- **ข้อมูลบังคับก่อนเผยแพร่ (FR-ANN-02):** ต้องกรอกครบ `title`, `course_id`, `quota`, `start_date`, `end_date`, `qualifications`, และ `required_documents` ก่อนเปลี่ยนสถานะเป็น `Published`
- **สภาวะของประกาศ (Lifecycle / FR-ANN-03):** ใช้สถานะ `Draft`, `Published`, `Expired`, `Archived`
- **สิทธิ์การเผยแพร่ (RBAC / NFR-SEC-01):** เฉพาะเจ้าหน้าที่ภาควิชาและ Admin ที่มีสิทธิ์เปลี่ยนสถานะเป็น `Published` (นักศึกษาเห็นเฉพาะ `Published`)
- **การบันทึกประวัติ (NFR-AUD-01):** บันทึก action, operator_id, operator_role, timestamp, และ changed_fields ลงตาราง append-only `announcement_audit_logs`

## 2. รายการ task
- [ ] **T-01:** จัดทำและตรวจสอบการสร้างประกาศ Draft ตาม template
- [ ] **T-02:** ตรวจสอบข้อมูลบังคับก่อนเปลี่ยนสถานะเป็น Published
- [ ] **T-03:** จัดการ lifecycle ของประกาศ: Draft → Published → Expired / Archived
- [ ] **T-04:** บังคับใช้สิทธิ์การเปิดเผยและแก้ไขประกาศตาม role
- [ ] **T-05:** บันทึก audit log แบบ append-only สำหรับการสร้าง แก้ไข และเผยแพร่ประกาศ
- [ ] **T-06:** กำหนดกระบวนการเปลี่ยนสถานะเป็น Expired เมื่อพ้นวันปิดรับสมัคร
- [ ] **T-07:** ทดสอบ acceptance criteria ทั้งหมด

## 3. รายการตรวจสอบ (Acceptance Criteria Checklist)
- [ ] **AC-ANN-01:** สร้างและบันทึกประกาศ Draft ได้ตาม template มีสถานะถูกต้อง และซ่อนจากนักศึกษา
- [ ] **AC-ANN-02:** ปฏิเสธการเผยแพร่เมื่อข้อมูลบังคับไม่ครบ และแสดงรายการฟิลด์ที่ขาด เมื่อครบถ้วนเปลี่ยนสถานะเป็น Published ได้
- [ ] **AC-ANN-03:** ระบบเปลี่ยนสถานะประกาศเป็น Expired อัตโนมัติเมื่อพ้นกำหนดวันปิดรับสมัคร
- [ ] **AC-ANN-04:** บันทึกผู้จัดทำ, ผู้เผยแพร่, เวลาเผยแพร่, และประวัติการเปลี่ยนแปลงลง audit log แบบ append-only อย่างถูกต้อง

## 4. วัตถุประสงค์ของแผน
- ให้การพัฒนาและการทดสอบสอดคล้องกับ UC-15 และข้อกำหนด v2
- ลดความคลุมเครือของ lifecycle, validation, และสิทธิ์การเผยแพร่
- สร้าง traceability ที่สามารถตรวจสอบได้จาก requirement → implementation → test

## 5. Status
- [x] วิเคราะห์ requirement และคลี่คลายความกำกวมของ spec v2
- [x] ปรับ spec.md เป็นเวอร์ชัน v2
- [x] ตรวจสอบ traceability ให้ถูกต้อง
- [x] ระบุ task ตาม acceptance criteria
- [ ] รอข้อมูลการกำหนดเวลาสำหรับ Scheduled Job ก่อนเริ่ม task ที่เกี่ยวข้อง
