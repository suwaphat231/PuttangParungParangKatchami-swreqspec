# Tasks Breakdown: UC-15 จัดทำประกาศรับสมัคร
Feature: UC-15 จัดทำประกาศรับสมัคร
Spec ID: SPEC-15-15- / FR-ANN-01 ถึง FR-ANN-03 / NFR-AUD-01 / NFR-SEC-01
อ้างอิง plan.md: [specs/15-15-create-recruitment-announcement/plan.md](specs/15-15-create-recruitment-announcement/plan.md)
วันที่: 2026-10-03

สรุป:
- ทำทั้งหมด 8 task
- มี task ที่ต้องรอ Open Questions: 0 task

### T-01 สร้าง model และ contract API สำหรับประกาศ
- รองรับ: FR-ANN-01, NFR-AUD-01
- ตรวจด้วย: AC-ANN-01
- ไฟล์ที่แตะ: `backend/app/models.py`, `backend/app/router.py`, `backend/tests/test_create_recruitment_announcement.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: มี contract API สำหรับสร้างและบันทึกประกาศแบบ Draft พร้อมส่งกลับ status, metadata, และข้อมูลหลักที่จำเป็นได้
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 สร้างและบันทึกประกาศแบบ Draft ตาม template
- รองรับ: FR-ANN-01
- ตรวจด้วย: AC-ANN-01
- ไฟล์ที่แตะ: `backend/app/announcement_service.py`, `backend/app/router.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ระบบสามารถสร้างประกาศใหม่แบบ Draft และจัดเก็บข้อมูลหลัก เช่น title, course_id, department_id, quota, description, qualifications, start_date, end_date, required_documents, status ได้ถูกต้อง
- สถานะ: เสร็จ รอทีมตรวจ

### T-03 ตรวจสอบข้อมูลบังคับก่อนเปลี่ยนเป็น Published
- รองรับ: FR-ANN-02, NFR-SEC-01
- ตรวจด้วย: AC-ANN-02
- ไฟล์ที่แตะ: `backend/app/announcement_service.py`, `backend/app/router.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: เมื่อผู้ใช้พยายามเผยแพร่ประกาศโดยไม่มี title, course_id, quota, start_date, end_date, qualifications, required_documents ครบ ระบบปฏิเสธและส่งรายการฟิลด์ที่ขาดกลับมาอย่างชัดเจน
- สถานะ: เสร็จ รอทีมตรวจ

### T-04 บันทึก audit log และ metadata ของผู้จัดทำ/ผู้เผยแพร่
- รองรับ: FR-ANN-03, NFR-AUD-01, NFR-SEC-01
- ตรวจด้วย: AC-ANN-03
- ไฟล์ที่แตะ: `backend/app/announcement_service.py`, `backend/app/audit.py`, `backend/app/router.py`, `backend/tests/test_announcement_audit.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: ทุกการสร้าง/แก้ไข/เผยแพร่ประกาศจัดเก็บ action, operator_id, operator_role, timestamp, changed_fields ลงในตาราง append-only announcement_audit_logs ได้ครบถ้วน
- สถานะ: เสร็จ รอทีมตรวจ

### T-05 จัดการ lifecycle ของประกาศและอัตโนมัติ Expired
- รองรับ: FR-ANN-03, ASM-02, ASM-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05
- ไฟล์ที่แตะ: `backend/app/announcement_service.py`, `backend/app/scheduler.py`, `backend/tests/test_announcement_lifecycle.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: ระบบรองรับ lifecycle Draft → Published → Expired / Archived ได้ และเปลี่ยนสถานะเป็น Expired อัตโนมัติเมื่อ end_date ผ่านไปแล้ว
- สถานะ: เสร็จ รอทีมตรวจ

### T-06 สร้างหน้า Draft form และ checklist สำหรับข้อมูลบังคับ
- รองรับ: FR-ANN-01, FR-ANN-02
- ตรวจด้วย: AC-ANN-01
- ไฟล์ที่แตะ: `frontend/src/pages/CreateAnnouncementPage.jsx`, `frontend/src/components/AnnouncementForm.jsx`, `frontend/src/api/client.js`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: เจ้าหน้าที่สามารถกรอกข้อมูลประกาศตาม template, สร้างฉบับ Draft ได้, และเห็น checklist เอกสารบังคับที่จำเป็นก่อนเผยแพร่
- สถานะ: เสร็จ รอทีมตรวจ

### T-07 ต่อหน้าจอกับ API จริงและ workflow เผยแพร่ประกาศ
- รองรับ: FR-ANN-02, FR-ANN-03, NFR-SEC-01
- ตรวจด้วย: AC-ANN-02, AC-ANN-03
- ไฟล์ที่แตะ: `frontend/src/pages/CreateAnnouncementPage.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/CreateAnnouncementPage.test.jsx`
- ต้องทำหลัง: T-03, T-04, T-06
- เสร็จเมื่อ: หน้าแสดงผลจาก API จริงได้, ปฏิเสธการเผยแพร่เมื่อข้อมูลไม่ครบ พร้อมแสดงรายการฟิลด์ที่ขาด, และเมื่อเผยแพร่สำเร็จจะแสดงสถานะ/ผู้เผยแพร่/เวลาและ audit log ตามที่ได้บันทึกไว้
- สถานะ: เสร็จ รอทีมตรวจ

### T-08 ทดสอบยอมรับและ regression สำหรับ UC-15
- รองรับ: FR-ANN-01, FR-ANN-02, FR-ANN-03, NFR-AUD-01, NFR-SEC-01
- ตรวจด้วย: AC-ANN-01, AC-ANN-02, AC-ANN-03
- ไฟล์ที่แตะ: `backend/tests/test_create_recruitment_announcement.py`, `frontend/src/__tests__/CreateAnnouncementPage.test.jsx`
- ต้องทำหลัง: T-04, T-05, T-07
- เสร็จเมื่อ: backend และ frontend acceptance tests ผ่านสำหรับ draft creation, publish validation, audit log, role-based access, และ lifecycle expiry ตามข้อกำหนด
- สถานะ: เสร็จ รอทีมตรวจ

## ตารางตรวจความครบ

### 1) AC ID | task ที่ตรวจ AC นี้
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-ANN-01 | T-01, T-02, T-06 |
| AC-ANN-02 | T-03, T-07 |
| AC-ANN-03 | T-04, T-07, T-08 |

### 2) Constraint ID | task ที่ทำให้เป็นจริง
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| FR-ANN-01 | T-01, T-02, T-06 |
| FR-ANN-02 | T-03, T-07 |
| FR-ANN-03 | T-04, T-05, T-07 |
| NFR-AUD-01 | T-04, T-08 |
| NFR-SEC-01 | T-03, T-04, T-07 |

## สิ่งที่ยังไม่ทำ
- Q-01: ไม่จำเป็นต้องมีการอนุมัติกลางก่อนเผยแพร่ เพราะได้ตกลงยืนยันแล้วว่า RBAC ของภาควิชา/ Admin เป็นสิทธิ์ที่ใช้ในการเผยแพร่
  - task ที่รออยู่: ไม่มี (ข้อคำถามนี้ได้ถูกยืนยันแล้ว และไม่ต้องสร้าง workflow approval เพิ่ม)
