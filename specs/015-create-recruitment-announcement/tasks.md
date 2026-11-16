# Tasks Breakdown: UC-15 จัดทำประกาศรับสมัคร
Feature: UC-15 จัดทำประกาศรับสมัคร
Spec ID: SPEC-15-15- / FR-ANN-01 ถึง FR-ANN-03 / NFR-AUD-01 / NFR-SEC-01 / ASM-02 / ASM-04
อ้างอิง plan.md: [specs/15-15-create-recruitment-announcement/plan.md](specs/15-15-create-recruitment-announcement/plan.md)
วันที่: 2569-11-12

สรุป:
- ทำทั้งหมด 8 task
- UC-15 Frontend Prototype: Complete สำหรับ UI/Workflow จำลอง; Automated Prototype Tests ผ่าน 19/19
- Backend/System Implementation: ยังไม่ครบ; T-01 ถึง T-05 และ API จริงไม่ถือว่า Complete
- สถานะ AC checklist ด้านล่างคงเป็นการตรวจระบบจริง จึงยังไม่ทำเครื่องหมายผ่านจากผล Prototype

### T-01 สร้าง model และ contract API สำหรับประกาศ
- รองรับ: FR-ANN-01
- ตรวจด้วย: AC-ANN-01
- ไฟล์ที่แตะ: `backend/app/models.py`, `backend/app/router.py`, `backend/tests/test_create_recruitment_announcement.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: มี contract API สำหรับสร้างและบันทึกประกาศแบบ Draft พร้อมส่งกลับ status, metadata, และข้อมูลหลักที่จำเป็นได้
- สถานะ: System/Backend ยังไม่ครบ; ไม่พบหลักฐาน Model/API contract ใน implementation ที่ตรวจ

### T-02 สร้างและบันทึกประกาศแบบ Draft ตาม template
- รองรับ: FR-ANN-01, NFR-SEC-01
- ตรวจด้วย: AC-ANN-01
- ไฟล์ที่แตะ: `backend/app/announcement_service.py`, `backend/app/router.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ระบบสามารถสร้างประกาศใหม่แบบ Draft และจัดเก็บข้อมูลหลัก เช่น title, course_id, department_id, quota, description, qualifications, start_date, end_date, required_documents, status ได้ถูกต้อง
- สถานะ: System/Backend ยังไม่ครบ; Draft ใน Prototype เป็น Local State เท่านั้น

### T-03 ตรวจสอบข้อมูลบังคับก่อนเปลี่ยนเป็น Published
- รองรับ: FR-ANN-02, NFR-SEC-01
- ตรวจด้วย: AC-ANN-02
- ไฟล์ที่แตะ: `backend/app/announcement_service.py`, `backend/app/router.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: เมื่อผู้ใช้พยายามเผยแพร่ประกาศโดยไม่มี title, course_id, quota, start_date, end_date, qualifications, required_documents ครบ ระบบปฏิเสธและส่งรายการฟิลด์ที่ขาดกลับมาอย่างชัดเจน
- สถานะ: System/API ยังไม่ครบ; validation ใน Prototype เป็นการจำลองฝั่ง UI

### T-04 บันทึก audit log และ metadata ของผู้จัดทำ/ผู้เผยแพร่
- รองรับ: FR-ANN-03, NFR-AUD-01
- ตรวจด้วย: AC-ANN-03
- ไฟล์ที่แตะ: `backend/app/announcement_service.py`, `backend/app/audit.py`, `backend/app/router.py`, `backend/tests/test_announcement_audit.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: ทุกการสร้าง/แก้ไข/เผยแพร่ประกาศจัดเก็บ action, operator_id, operator_role, timestamp, changed_fields ลงในตาราง append-only announcement_audit_logs ได้ครบถ้วน
- สถานะ: System/Database ยังไม่ครบ; Audit Log ใน Prototype เป็น Mock Data/Local State ไม่ใช่ immutable storage

### T-05 จัดการ lifecycle ของประกาศและอัตโนมัติ Expired
- รองรับ: Lifecycle Constraint, ASM-02
- ตรวจด้วย: AC-ANN-04
- ไฟล์ที่แตะ: `backend/app/announcement_service.py`, `backend/app/scheduler.py`, `backend/tests/test_announcement_lifecycle.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: ระบบรองรับ lifecycle Draft → Published → Expired / Archived และ Scheduled Job ทำงานทุกวันเวลา 00:05 น. Asia/Bangkok (UTC+7) เพื่อเปลี่ยนประกาศ Published เป็น Expired หลังสิ้นสุดวัน end_date เวลา 23:59:59 น. Asia/Bangkok (UTC+7)
- สถานะ: Frontend Prototype Simulation Complete
- ผลการดำเนินงาน: จำลองการเปลี่ยน Draft → Published และ Published → Expired พร้อมแสดงสถานะ Archived; ทดสอบ Scheduled Job จำลองเวลา 00:05 น. Asia/Bangkok (UTC+7) ด้วย Mock Data/Local State แล้ว
- ขอบเขต: ครอบคลุมการจำลองและทดสอบ Workflow บน Frontend Prototype; ยังไม่รวม System Scheduler ที่ทำงานอัตโนมัติจริง
- หมายเหตุ: Archived เป็นสถานะตัวอย่างที่แสดงและทดสอบการคงสถานะ; Spec ไม่ได้ระบุเงื่อนไขหรือ action สำหรับ transition ไป Archived

### T-06 สร้างหน้า Draft form และ checklist สำหรับข้อมูลบังคับ
- รองรับ: FR-ANN-01, FR-ANN-02
- ตรวจด้วย: AC-ANN-01, AC-ANN-02
- ไฟล์ที่แตะ: `frontend/src/pages/CreateAnnouncementPage.jsx`, `frontend/src/components/AnnouncementForm.jsx`, `frontend/src/api/client.js`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: เจ้าหน้าที่สามารถกรอกข้อมูลประกาศตาม template, สร้างฉบับ Draft ได้, และเห็น checklist เอกสารบังคับที่จำเป็นก่อนเผยแพร่
- สถานะ: Frontend Prototype Complete (Draft form และ checklist ผ่านการทดสอบ); ระบบจริง/API ไม่ได้ยืนยัน

### T-07 ต่อหน้าจอกับ API จริงและ workflow เผยแพร่ประกาศ
- รองรับ: FR-ANN-02, FR-ANN-03, NFR-SEC-01, ASM-04
- ตรวจด้วย: AC-ANN-01, AC-ANN-02, AC-ANN-03
- ไฟล์ที่แตะ: `frontend/src/pages/CreateAnnouncementPage.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/CreateAnnouncementPage.test.jsx`
- ต้องทำหลัง: T-03, T-04, T-06
- เสร็จเมื่อ: หน้าแสดงผลจาก API จริงได้, ปฏิเสธการเผยแพร่เมื่อข้อมูลไม่ครบ พร้อมแสดงรายการฟิลด์ที่ขาด, และเมื่อเผยแพร่สำเร็จจะแสดงสถานะ/ผู้เผยแพร่/เวลาและ audit log ตามที่ได้บันทึกไว้
- สถานะ: Frontend Prototype Workflow Complete (Mock Data/Local State); API จริงและการเชื่อมระบบยังไม่ครบ

### T-08 ทดสอบยอมรับและ regression สำหรับ UC-15
- รองรับ: FR-ANN-01, FR-ANN-02, FR-ANN-03, NFR-AUD-01, NFR-SEC-01, Lifecycle Constraint, ASM-02, ASM-04
- ตรวจด้วย: AC-ANN-01, AC-ANN-02, AC-ANN-03, AC-ANN-04
- ไฟล์ที่แตะ: `backend/tests/test_create_recruitment_announcement.py`, `backend/tests/test_announcement_audit.py`, `backend/tests/test_announcement_lifecycle.py`, `frontend/src/__tests__/CreateAnnouncementPage.test.jsx`
- ต้องทำหลัง: T-04, T-05, T-07
- เสร็จเมื่อ: backend และ frontend acceptance tests ผ่านสำหรับ draft creation, publish validation, Student role-based access, audit log, และ lifecycle expiry ตามข้อกำหนด
- สถานะ: Prototype Tests Complete (19/19 ผ่าน); System Acceptance/Regression Tests ยังไม่ครบ

## ตารางตรวจความครบ

### 1) AC ID | task ที่ตรวจ AC นี้
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-ANN-01 | T-01, T-02, T-06, T-07, T-08 |
| AC-ANN-02 | T-03, T-06, T-07, T-08 |
| AC-ANN-03 | T-04, T-07, T-08 |
| AC-ANN-04 | T-05, T-08 |

### 2) Constraint ID | task ที่ทำให้เป็นจริง
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| FR-ANN-01 | T-01, T-02, T-06 |
| FR-ANN-02 | T-03, T-06, T-07 |
| FR-ANN-03 | T-04, T-07 |
| NFR-AUD-01 | T-04, T-08 |
| NFR-SEC-01 | T-02, T-03, T-07, T-08 |
| Lifecycle Constraint / ASM-02 | T-05, T-08 |
| ASM-04 | T-07, T-08 |

## สิ่งที่ยังไม่ทำ
- Q-01: ไม่จำเป็นต้องมีการอนุมัติกลางก่อนเผยแพร่ เพราะได้ตกลงยืนยันแล้วว่า RBAC ของภาควิชา/ Admin เป็นสิทธิ์ที่ใช้ในการเผยแพร่
  - task ที่รออยู่: ไม่มี (ข้อคำถามนี้ได้ถูกยืนยันแล้ว และไม่ต้องสร้าง workflow approval เพิ่ม)
