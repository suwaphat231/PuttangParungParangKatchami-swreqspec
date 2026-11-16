# RTM: สมัคร Lab Boy
อ้างอิง: [spec.md](./spec.md) Draft v2 | [plan.md](./plan.md) | [tasks.md](./tasks.md) | [test-cases.md](./test-cases.md)
สร้างด้วย /verify เมื่อ 2569-11-13 15:30 | test: backend Lab Boy suite 13 ผ่าน 0 ไม่ผ่าน; frontend prototype suite 30 ผ่าน 0 ไม่ผ่าน 1 todo; full backend suite 1 ไม่ผ่าน (เรื่องอื่นใน booking)

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-LB-01 | AC-LB-02 | T-02 | `specs/001-apply-lab-boy/ApplyLabBoyPrototype.jsx`: announcement details | `ApplyLabBoyPage.test.jsx` ผ่าน: แสดงเงื่อนไข ช่วงเวลา จำนวนที่รับ และห้องทำงาน | ครบ |
| FR-LB-02 | AC-LB-03 | T-03 | `backend/app/services/eligibility_service.py`: `EligibilityService.evaluate`; `backend/app/controllers/student_application_controller.py` | `backend/tests/test_T03_eligibility.py` ผ่าน: session/profile/status ถูกตรวจจริง | ครบ |
| FR-LB-03 | AC-LB-04 | T-02, T-03 | `backend/app/services/application_draft_service.py`; `backend/app/services/eligibility_service.py` | `test_T03_eligibility.py` + `test_T06_application_draft_service.py` ผ่าน: ข้อมูลไม่ครบถูกปฏิเสธ | ครบ |
| FR-LB-04 | AC-LB-01 | T-04 | `backend/app/services/application_submit_service.py` | `test_T04_submit_application.py` ผ่าน: บันทึกใบสมัครครั้งเดียวและประสบความสำเร็จ | ครบ |
| FR-LB-05 | AC-LB-05 | T-04 | `backend/app/services/application_submit_service.py` | `test_T04_submit_application.py` ผ่าน: save failure ไม่ทิ้งใบสมัครที่ไม่สมบูรณ์ | ครบ |
| FR-LB-06 | AC-LB-06 | T-02, T-06 | `backend/app/services/application_draft_service.py` | `test_T06_application_draft_service.py` ผ่าน: แก้ไขก่อนยืนยันและยกเลิกแบบ no-op | ครบ |
| FR-LB-07 | AC-LB-07 | T-07 | `backend/app/services/withdraw_service.py` | `test_T07_withdraw_service.py` ผ่าน: ถอนก่อนปิดรับสมัคร | ครบ |
| FR-LB-08 | AC-LB-08 | T-07 | `backend/app/services/withdraw_service.py` | `test_T07_withdraw_service.py` ผ่าน: สมัครใหม่หลังถอนมี application_id ใหม่ | ครบ |
| FR-LB-09 | AC-LB-09 | T-08 | ไม่มี `backend/app/services/student_registry_service.py` หรือ flow จริงใน repo | ไม่มี test/โค้ดที่ตรวจ `รอตรวจสอบ` จาก registry outage ใน backend | ยังไม่ถึง |
| FR-LB-10 | AC-LB-10 | T-05 | ไม่มี `backend/app/services/capacity_service.py` หรือ atomic capacity check ที่เป็นจริง | ไม่มี test/โค้ดที่จัดลำดับคำขอเมื่อเต็มจำนวน | ยังไม่ถึง |
| NFR-REL-01 | AC-LB-11 | T-01, T-04 | `backend/app/models/application.py` + `backend/app/services/application_rules.py` | `test_T01_lab_boy_model.py` และ `test_T04_submit_application.py` ผ่าน: duplicate rule และ single record | ครบ |
| NFR-SEC-01 | AC-LB-12 | T-09 | `backend/app/middleware/security.py` มี HTTPS enforcement แบบทั่วไป แต่ไม่ใช่ Lab Boy-specific API validation | ไม่มี test สำหรับ AC-LB-12 ใน Lab Boy feature | ช่องโหว่ |
| NFR-USE-01 | AC-LB-02 | T-02, T-09 | prototype UI ใช้งานได้ แต่ไม่มีการวัด UX แบบเป็นเรื่องจริง | frontend prototype tests ผ่านแต่ยังไม่มี `คน` ทดสอบจริง | ยังไม่ถึง |
| Constraint: ต้องเข้าสู่ระบบก่อนสมัคร | ไม่มี AC | T-03 | `backend/app/services/eligibility_service.py`: `require_authenticated_session` | `test_T03_eligibility.py` ผ่าน: session ว่างถูกปฏิเสธ | ครบ |
| Constraint: ต้องมีประกาศรับสมัครที่อยู่ในช่วงเวลาเปิดรับ | ไม่มี AC | T-01, T-02 | `backend/app/models/recruitment.py`: `is_open`, `is_open_at`; `ApplicationRules.is_application_open` | `test_T01_lab_boy_model.py` ผ่าน: timezone-aware open window | ครบ |
| Constraint: ข้อมูลที่จำเป็นจากบัญชีผู้ใช้ต้องครบก่อนยืนยัน | AC-LB-04 | T-02, T-03 | `backend/app/services/eligibility_service.py` + `application_draft_service.py` | `test_T03_eligibility.py` และ `test_T06_application_draft_service.py` ผ่าน | ครบ |
| Constraint: หากสมัครสำเร็จต้องไม่สร้างใบสมัครซ้ำสำหรับประกาศเดียวกัน | AC-LB-11 | T-01, T-04 | `backend/app/services/application_rules.py` | `test_T01_lab_boy_model.py` ผ่าน: duplicate rejected | ครบ |
| Constraint: ใช้ข้อมูลจากบัญชีผู้ใช้โดยไม่ต้องแนบเอกสาร | ไม่มี AC | T-02 | `specs/001-apply-lab-boy/ApplyLabBoyPrototype.jsx` ใช้ profile state โดยไม่ upload เอกสาร | prototype test ไม่ตรวจเรื่องเอกสารจริง | ครบ |
| Constraint: หากจำนวนผู้สมัครเต็ม ให้รับคำขอตามลำดับเวลาที่ยืนยันสำเร็จ | AC-LB-10 | T-05 | ไม่มี capacity service หรือ queue logic จริงใน repo | ไม่มี test/โค้ดที่พิสูจน์ ordering เมื่อมี capacity เต็ม | ยังไม่ถึง |

สรุปสถานะแถว: ครบ 14 | ยังไม่ถึง 4 | รอ 0 | ช่องโหว่ 1

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/models/recruitment.py`: `RecruitmentAnnouncement.is_open` | FR-LB-01, Constraint: open window | ใช่ | มี timezone Asia/Bangkok และช่วงเวลาเปิดรับ |
| `backend/app/services/eligibility_service.py`: `EligibilityService.evaluate` | FR-LB-02, FR-LB-03, Constraint: login/data | ใช่ | ตรวจ session, profile completeness, status ปกติ |
| `backend/app/services/application_submit_service.py` | FR-LB-04, FR-LB-05, NFR-REL-01 | ใช่ | Save failure, duplicate prevention, single record ถูกทำจริง |
| `backend/app/services/application_draft_service.py` | FR-LB-06 | ใช่ | Draft validation และ cancel/reset แบบ no-op ถูกทำจริง |
| `backend/app/services/withdraw_service.py` | FR-LB-07, FR-LB-08 | ใช่ | ถอนและ reapply ดำเนินงานอย่างชัดเจน |
| `backend/app/middleware/security.py` | NFR-SEC-01 | บางส่วน | บังคับ HTTPS แบบทั่วไป แต่ไม่ใช่ Lab Boy-specific API contract |
| `specs/001-apply-lab-boy/ApplyLabBoyPrototype.jsx` | FR-LB-01, FR-LB-06, FR-LB-07, FR-LB-08 | บางส่วน | มี prototype/UX สำหรับ flow แต่ไม่ใช่ backend production flow และไม่มี persistence จริง |
| `backend/app/main.py` | NFR-SEC-01 | ไม่พบ Lab Boy API | มี router สำหรับ booking/payment อื่น ๆ แต่ไม่ใช่ UC-01 |
| `backend/app/services/student_registry_service.py` | FR-LB-09 | ไม่พบ | ไฟล์หรือ logic ที่สร้าง `รอตรวจสอบ` จาก registry outage ไม่มีจริง |
| `backend/app/services/capacity_service.py` | FR-LB-10 | ไม่พบ | ไม่มี atomic capacity check และ queue ordering ใน repo |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | เดา Q-xx | `specs/001-apply-lab-boy/tasks.md` | spec.md | tasks.md อ้าง Q-01, Q-04 แต่ spec.md ไม่มี Q-xx เหล่านี้ ทำให้ task/AC หลายตัวอ่อนและไม่ชัดเจน | เพิ่ม Q-xx |
| F-002 | โค้ดไม่มี FR | `backend/app/` | FR-LB-09, FR-LB-10 | ไม่มี `student_registry_service.py` และ `capacity_service.py` แม้ task ระบุว่าทำแล้ว | แก้โค้ด |
| F-003 | AC ไม่มี test | `specs/001-apply-lab-boy/test-cases.md` | AC-LB-02 ถึง AC-LB-10 | แถวหลายตัวเป็น `ใช้ได้` แต่ไม่มี executable test ใน `backend/tests/` หรือ `frontend/src/__tests__/` ที่ยืนยันทั้งหมด | แก้ spec / เพิ่ม test |
| F-004 | test อ่อน | `frontend/src/pages/ApplyLabBoyPage.test.jsx` | FR-LB-01, FR-LB-02, FR-LB-04 | Test prototype ใช้ scenario/local state มากเกินกว่าการเชื่อมกับ backend จริง จึงไม่พิสูจน์ production flow | แก้โค้ด |
| F-005 | ตัวเลขไม่ตรง spec | `specs/001-apply-lab-boy/ApplyLabBoyPrototype.jsx` | ASM-07, FR-LB-01 | prototype กำหนดเลขใบสมัคร `LB-2569-0001` และเกณฑ์เกรด B ขึ้นไป แม้ spec ระบุว่าเกรดไม่ใช้ตัดสินคุณสมบัติ | แก้ spec |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| - | - | ไม่พบข้อค้นพบที่แก้แล้วใน repo ของ feature นี้ในปัจจุบัน |
