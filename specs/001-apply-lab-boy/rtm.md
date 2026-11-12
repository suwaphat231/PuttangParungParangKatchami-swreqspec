# RTM: สมัคร Lab Boy
อ้างอิง: [spec.md](./spec.md) Draft v2 | [plan.md](./plan.md) | [tasks.md](./tasks.md) | [test-cases.md](./test-cases.md)
สร้างด้วย /verify เมื่อ 2569-11-12 22:50 | test รวม: 69 ผ่าน 6 ไม่ผ่าน (1 todo); backend 54 ผ่าน, frontend 15 ผ่าน 6 ไม่ผ่าน (1 todo)

หมายเหตุ: tasks.md อ้าง Q-01 ถึง Q-04 ซึ่งไม่มีใน spec.md ตาม F-001 จึงไม่ใช้สถานะ "รอ Q" และให้ task ที่ยังไม่เสร็จเป็น "ยังไม่ถึง" จนกว่าทีมจะปรับเอกสารให้สอดคล้องกัน; Constraints ทั้ง 6 ข้อไม่มี ID ใน spec จึงระบุด้วยข้อความเดิมโดยไม่สร้าง ID ใหม่

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-LB-01 | AC-LB-02 | T-02 (tasks อ้าง Q-02) | `./ApplyLabBoyPrototype.jsx`: announcement, ApplyLabBoyPage | `test_prototype_AC_LB_02_shows_open_announcement_details_and_conditions` ผ่าน; `test_prototype_AC_LB_02_places_office_room_below_teacher_name` ผ่าน | ช่องโหว่ (F-002, F-003) |
| FR-LB-02 | AC-LB-03 | T-03 พร้อมทำ | `./ApplyLabBoyPrototype.jsx`: submitApplication (ตรวจ scenario) | `test_prototype_AC_LB_03_and_09_shows_ineligible_and_registry_unavailable_outcomes` ไม่ผ่าน; test UI ค้น selector ที่ไม่มีในหน้า | ยังไม่ถึง |
| FR-LB-03 | AC-LB-04 | T-02 (tasks อ้าง Q-02), T-03 พร้อมทำ | `./ApplyLabBoyPrototype.jsx`: form validation | `test_prototype_AC_LB_04_and_06_rejects_missing_fields_and_allows_editing` ไม่ผ่าน; test ใช้ label เกรดเดิมที่ไม่มีในหน้า | ช่องโหว่ (F-002) |
| FR-LB-04 | AC-LB-01 | T-01 (tasks อ้าง Q-03), T-04 พร้อมทำ | `./ApplyLabBoyPrototype.jsx`: submitApplication, application number/time | `test_prototype_AC_LB_01_and_11_confirms_once_with_a_single_application` ไม่ผ่าน; test ใช้ label เกรดเดิมที่ไม่มีในหน้า | ช่องโหว่ (F-004) |
| FR-LB-05 | AC-LB-05 | T-01 (tasks อ้าง Q-03), T-04 พร้อมทำ | `./ApplyLabBoyPrototype.jsx`: submitApplication (save-failure scenario) | `test_prototype_AC_LB_05_and_10_does_not_create_an_application_on_failure_or_when_full` ไม่ผ่าน; test ค้น selector จำลองสถานการณ์ที่ไม่มีในหน้า | ยังไม่ถึง |
| FR-LB-06 | AC-LB-06 | T-02 (tasks อ้าง Q-02), T-06 พร้อมทำ | `./ApplyLabBoyPrototype.jsx`: updateField, ปุ่มยืนยัน/ยกเลิก | `test_prototype_AC_LB_04_and_06_rejects_missing_fields_and_allows_editing` และ `test_prototype_AC_LB_06_shows_confirm_and_no_op_cancel_buttons` ไม่ผ่านก่อนตรวจครบ เนื่องจาก label เกรดใน test เก่า | ยังไม่ถึง |
| FR-LB-07 | AC-LB-07 | T-07 พร้อมทำ | `./ApplyLabBoyPrototype.jsx`: withdrawApplication | `test_prototype_AC_LB_07_and_08_withdraws_and_reapplies_with_a_new_number` ไม่ผ่าน; test ใช้ label เกรดเดิมที่ไม่มีในหน้า | ยังไม่ถึง |
| FR-LB-08 | AC-LB-08 | T-07 พร้อมทำ | `./ApplyLabBoyPrototype.jsx`: withdrawApplication, application number | `test_prototype_AC_LB_07_and_08_withdraws_and_reapplies_with_a_new_number` ไม่ผ่าน; test ใช้ label เกรดเดิมที่ไม่มีในหน้า | ช่องโหว่ (F-004) |
| FR-LB-09 | AC-LB-09 | T-08 (tasks อ้าง Q-01) | `./ApplyLabBoyPrototype.jsx`: submitApplication (pending scenario) | `test_prototype_AC_LB_03_and_09_shows_ineligible_and_registry_unavailable_outcomes` ไม่ผ่าน; test ค้น selector ที่ไม่มีในหน้า | ยังไม่ถึง |
| FR-LB-10 | AC-LB-10 | T-05 (tasks อ้าง Q-04) | `./ApplyLabBoyPrototype.jsx`: submitApplication (full scenario) | `test_prototype_AC_LB_05_and_10_does_not_create_an_application_on_failure_or_when_full` ไม่ผ่าน; test ค้น selector ที่ไม่มีในหน้า | ยังไม่ถึง |
| NFR-SEC-01 | AC-LB-12 | T-09 (tasks อ้าง Q-02) | ไม่มี implementation backend/API ของ Lab Boy ใน `backend/app/` | ไม่พบ test ของ UC-01 ที่ตรวจความปลอดภัยการส่งข้อมูล | ยังไม่ถึง |
| NFR-REL-01 | AC-LB-11 | T-01 (tasks อ้าง Q-03), T-04 พร้อมทำ | `./ApplyLabBoyPrototype.jsx`: local state ใน submitApplication; ไม่มีการบันทึกถาวรหรือป้องกันคำขอซ้ำที่ backend | `test_prototype_AC_LB_01_and_11_confirms_once_with_a_single_application` ไม่ผ่าน; ไม่ได้ทดสอบการบันทึกซ้ำจริง | ยังไม่ถึง |
| NFR-USE-01 | AC-LB-02 | T-02 (tasks อ้าง Q-02), T-09 (tasks อ้าง Q-02) | `./ApplyLabBoyPrototype.jsx`: ApplyLabBoyPage | test ของ AC-LB-02 ตรวจข้อความ/ห้องทำงานเท่านั้น; ไม่มีผลทดสอบกับผู้ใช้ | ยังไม่ถึง |
| Constraint: ต้องเข้าสู่ระบบก่อนสมัคร | ไม่มี AC | T-03 พร้อมทำ | `frontend/src/App.jsx`: route `/apply-lab-boy`; ไม่พบ guard ของการเข้าสู่ระบบใน prototype | ไม่มี test ตรวจการเข้าสู่ระบบก่อนเข้าหน้า | ยังไม่ถึง |
| Constraint: ต้องมีประกาศรับสมัครที่อยู่ในช่วงเวลาเปิดรับ | AC-LB-02 แสดงช่วงเวลา แต่ไม่ตรวจเงื่อนไขเปิดรับ | T-02 (tasks อ้าง Q-02), T-03 พร้อมทำ | `./ApplyLabBoyPrototype.jsx`: announcement เป็นข้อมูลคงที่; ไม่มีการตรวจวันเวลาปัจจุบัน | AC-LB-02 ตรวจการแสดงข้อความ ไม่ได้ตรวจการเปิด/ปิดรับจริง | ยังไม่ถึง |
| Constraint: ข้อมูลที่จำเป็นจากบัญชีผู้ใช้ต้องครบก่อนยืนยัน | AC-LB-04 | T-02 (tasks อ้าง Q-02), T-03 พร้อมทำ | `./ApplyLabBoyPrototype.jsx`: form validation ตรวจชื่อ รหัสนักศึกษา และเกรดใน state ฝั่งหน้า | `test_prototype_AC_LB_04_and_06_rejects_missing_fields_and_allows_editing` ไม่ผ่านจาก label เกรดเก่า; ไม่มีการตรวจบัญชีจริง | ยังไม่ถึง |
| Constraint: หากสมัครสำเร็จต้องไม่สร้างใบสมัครซ้ำสำหรับประกาศเดียวกัน | AC-LB-11 | T-01 (tasks อ้าง Q-03), T-04 พร้อมทำ | `./ApplyLabBoyPrototype.jsx`: submitApplication ทำงานกับ local state; ไม่พบการตรวจสมัครซ้ำฝั่ง backend | `test_prototype_AC_LB_01_and_11_confirms_once_with_a_single_application` ไม่ผ่าน; ไม่มีการทดสอบความซ้ำจริง | ยังไม่ถึง |
| Constraint: ใช้ข้อมูลจากบัญชีผู้ใช้โดยไม่ต้องแนบเอกสาร | ไม่มี AC เฉพาะ | T-02 (tasks อ้าง Q-02) | `./ApplyLabBoyPrototype.jsx`: initial form state; ไม่พบ upload ใน prototype และไม่มี API Lab Boy | ไม่มี test ตรวจการใช้บัญชีจริงหรือการไม่รับเอกสาร | ยังไม่ถึง |
| Constraint: หากจำนวนผู้สมัครเต็ม ให้รับคำขอตามลำดับเวลาที่ยืนยันสำเร็จ | AC-LB-10 | T-05 (tasks อ้าง Q-04) | `./ApplyLabBoyPrototype.jsx`: full scenario จำลอง; ไม่พบการจัดคิวตามเวลาบันทึกจริง | `test_prototype_AC_LB_05_and_10_does_not_create_an_application_on_failure_or_when_full` ไม่ผ่านจาก selector จำลองที่ไม่มีในหน้า | ยังไม่ถึง |

สรุปสถานะแถว: ครบ 0 | ยังไม่ถึง 15 | รอ 0 | ช่องโหว่ 4

`TC-LB-01-1` ถึง `TC-LB-01-5` ใน test-cases.md ยังเป็น "ร่าง" จึงไม่นับเป็น test ที่อนุมัติแล้วหรือทดสอบแล้ว

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `./ApplyLabBoyPrototype.jsx`: announcement / ApplyLabBoyPage | FR-LB-01, AC-LB-02 | บางส่วน | แสดงข้อมูลประกาศและห้องทำงาน แต่เกณฑ์เกรดขัดกับ ASM-07 (F-002) และระบุเวลาปฏิบัติงานซึ่งอยู่ใน Out of scope (F-003) |
| `./ApplyLabBoyPrototype.jsx`: GRADE_OPTIONS และ eligibility text | ASM-07, FR-LB-01 | ไม่ตรง | ตัวเลือกเกรดไม่ครบ A–F ตาม ASM-07 และข้อความกำหนด B ขึ้นไป ทั้งที่ ASM-07 ระบุว่าเกรดไม่ใช้ตัดสินคุณสมบัติ (F-002) |
| `./ApplyLabBoyPrototype.jsx`: updateField / form validation | FR-LB-03, FR-LB-06 | บางส่วน | ทำงานกับ state ใน browser; ยังไม่มีการอ่านข้อมูลบัญชีจากระบบจริง |
| `./ApplyLabBoyPrototype.jsx`: submitApplication | FR-LB-02 ถึง FR-LB-05, FR-LB-09, FR-LB-10 | บางส่วน | เป็นการจำลองด้วย local state และ scenario; ไม่มีการส่ง/บันทึกคำขอใน backend และตัวเลือก scenario ที่ test เดิมใช้ไม่มีใน UI |
| `./ApplyLabBoyPrototype.jsx`: withdrawApplication | FR-LB-07, FR-LB-08 | บางส่วน | เปลี่ยนสถานะใน local state; ไม่พบการตรวจวันปิดรับหรือการอัปเดตทะเบียนจริง |
| `./ApplyLabBoyPrototype.jsx`: application number / formatApplicationTime | FR-LB-04, FR-LB-08 | ไม่ครบ | กำหนดรูปแบบเลข `LB-2569-0001` และรูปแบบวัน/เวลาเอง ขณะที่ spec ไม่กำหนดรูปแบบ (F-004) |
| `./ApplyLabBoyPrototype.jsx`: ApplicationConfirmation / ConfirmationDialog | FR-LB-04, FR-LB-06, FR-LB-07 | บางส่วน | มีข้อความยืนยัน/ปุ่มตาม prototype; ปุ่มยกเลิกไม่มี handler ตาม AC-LB-06 |
| `../../frontend/src/App.jsx`: App route `/apply-lab-boy` | FR-LB-01 | บางส่วน | เปิด prototype ได้; route นี้ไม่แสดงหลักฐานการตรวจ authentication |
| `../../backend/app/main.py`: app / lifespan / router registration | NFR-SEC-01, NFR-REL-01 | ไม่พบส่วน Lab Boy | ลงทะเบียน slots, bookings และ payments; ไม่พบ router หรือ API สมัคร Lab Boy |
| `../../backend/app/slots/router.py`: GET slots | ไม่มี (UC จองห้อง) | ไม่ใช่ UC-01 | endpoint รายการช่วงเวลาจองห้อง |
| `../../backend/app/slots/service.py`: list_available_slots | ไม่มี (UC จองห้อง) | ไม่ใช่ UC-01 | ค้นหาช่วงเวลาว่างสำหรับการจอง ไม่ใช่เวลาหรือสถานะสมัคร Lab Boy |
| `../../backend/app/booking/router.py`: POST bookings | ไม่มี (UC จองห้อง) | ไม่ใช่ UC-01 | รับข้อมูลการจอง และส่งต่อให้ service; ไม่ใช่การสมัคร Lab Boy |
| `../../backend/app/booking/service.py`: next_queue_no / create_booking | ไม่มี (UC จองห้อง) | ไม่ใช่ UC-01 | จัดหมายเลขคิวการจองห้อง ไม่ใช่ลำดับสมัคร Lab Boy |
| `../../backend/app/booking/router.py`: DELETE bookings/{booking_id} | ไม่มี (UC จองห้อง) | ไม่ใช่ UC-01 | endpoint ยกเลิกการจองห้อง ไม่ใช่ถอนใบสมัคร Lab Boy |
| `../../backend/app/booking/service.py`: cancel_booking | ไม่มี (UC จองห้อง) | ไม่ใช่ UC-01 | ยกเลิก booking และบันทึก audit สำหรับระบบจอง |
| `../../backend/app/auth/idp.py`: get_verified_hn | ไม่มี (UC จองห้อง) | ไม่ใช่ UC-01 | ตรวจ HN ที่ยืนยันแล้วสำหรับระบบจอง ไม่ใช่ authentication ของนักศึกษาใน UC-01 |
| `../../backend/app/db/models.py`: Slot, Booking, AuditLog, PaymentAuditLog, StudentVerification | ไม่มี (UC อื่น) | ไม่ใช่ UC-01 | ไม่พบ model สำหรับใบสมัคร Lab Boy |
| `../../backend/app/db/migrations/001_init.py`, `002_student_verification.py` | ไม่มี (UC อื่น) | ไม่ใช่ UC-01 | สร้างตาราง booking และ student verification; ไม่ใช่ข้อมูลสมัคร Lab Boy |
| `../../backend/app/student_status/service.py`: record_verification | ไม่มี (UC ตรวจสถานะนักศึกษา) | ไม่ใช่ UC-01 | บันทึกผลตรวจสถานะนักศึกษา แต่ไม่ได้ตรวจคุณสมบัติหรือสร้างใบสมัคร Lab Boy |
| `../../backend/app/payments/router.py`: GET payments | ไม่มี (UC ติดตามการชำระเงิน) | ไม่ใช่ UC-01 | endpoint ค้นหารายการชำระเงิน |
| `../../backend/app/payments/router.py`: GET follow-up payments | ไม่มี (UC ติดตามการชำระเงิน) | ไม่ใช่ UC-01 | endpoint รายการติดตามการชำระเงิน |
| `../../backend/app/payments/router.py`: GET payment status detail | ไม่มี (UC ติดตามการชำระเงิน) | ไม่ใช่ UC-01 | endpoint รายละเอียดสถานะชำระเงิน |
| `../../backend/app/payments/service.py`: build_tracking_records / search_payment_records | ไม่มี (UC ติดตามการชำระเงิน) | ไม่ใช่ UC-01 | ประกอบและค้นข้อมูลชำระเงิน |
| `../../backend/app/payments/service.py`: get_payment_tracking_record / get_follow_up_payment_records | ไม่มี (UC ติดตามการชำระเงิน) | ไม่ใช่ UC-01 | อ่านรายละเอียดและรายการติดตามชำระเงิน |
| `../../backend/app/payments/auth.py`: get_payment_user / token helpers | ไม่มี (UC ติดตามการชำระเงิน) | ไม่ใช่ UC-01 | ตรวจตัวตนและสิทธิ์เฉพาะ API การชำระเงิน |
| `../../backend/app/payments/audit.py`: record_payment_access | ไม่มี (UC ติดตามการชำระเงิน) | ไม่ใช่ UC-01 | บันทึก audit ของการเข้าถึงข้อมูลชำระเงิน |
| `../../backend/app/payments/schemas.py`, `mock_provider.py` | ไม่มี (UC ติดตามการชำระเงิน) | ไม่ใช่ UC-01 | schema และข้อมูลจำลองของการชำระเงิน |
| `../../frontend/src/api/client.js`: booking API helpers | ไม่มี (UC จองห้อง) | ไม่ใช่ UC-01 | เรียก API slots/bookings; ไม่มี API สมัคร Lab Boy |
| `../../frontend/src/api/workerStatusApi.js`, `../../frontend/src/api/workerStatusDemo.js` | ไม่มี (UC จัดการสถานะผู้ปฏิบัติงาน) | ไม่ใช่ UC-01 | API และข้อมูลจำลองสำหรับสถานะผู้ปฏิบัติงาน |
| `../../frontend/src/api/applicationStatus.js`: listApplications | ไม่มี (UC อื่น) | ไม่ใช่ UC-01 | เรียก `/applications`; ไม่พบ endpoint ดังกล่าวใน backend ที่ตรวจ และไม่ได้เชื่อมกับ prototype สมัคร Lab Boy |
| `../../frontend/src/pages/ApplicationStatusPage.jsx`, `ApplicationStatusDetail.jsx` | ไม่มี (UC อื่น) | ไม่ใช่ UC-01 | หน้าตรวจสถานะใบสมัครทั่วไป ไม่ใช่ flow สมัคร Lab Boy ใน prototype นี้ |
| `../../frontend/src/components/AnnouncementForm.jsx` | ไม่มี (UC จัดการประกาศ) | ไม่ใช่ UC-01 | ฟอร์มจัดการประกาศ ไม่ใช่การแสดงประกาศสมัครใน UC-01 |
| `../../frontend/src/components/PaymentStatusBadge.jsx`, `../../frontend/src/pages/PaymentTrackingPage.jsx`, `../../frontend/src/data/paymentTrackingMock.js` | ไม่มี (UC ติดตามการชำระเงิน) | ไม่ใช่ UC-01 | ส่วนแสดง/กรองข้อมูลชำระเงินและข้อมูลจำลอง |
| `../../frontend/src/main.jsx`, `../../frontend/src/index.css` | ไม่มี (โครงสร้าง UI) | ไม่ใช่ requirement เฉพาะ UC-01 | จุดเริ่มต้นและสไตล์ร่วมของ frontend |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | อ้างอิง Q ที่ไม่มีใน spec | `tasks.md` T-01, T-02, T-05, T-08, T-09 | `spec.md` ไม่มี Q-01 ถึง Q-04 | task อ้างคำถามที่ไม่มีใน spec; ใช้ "ยังไม่ถึง" แทนการอ้าง Q ที่ไม่มีในเอกสาร |  |
| F-002 | ตัวเลขไม่ตรง spec | `./ApplyLabBoyPrototype.jsx`: GRADE_OPTIONS และ eligibility text | ASM-07, FR-LB-01 | ตัวเลือกเกรดไม่ครอบคลุม A–F และประกาศใช้เกรด B ขึ้นไปเป็นเงื่อนไข ทั้งที่ ASM-07 ระบุว่าเกรดที่เรียนไม่ใช้ตัดสินคุณสมบัติ |  |
| F-003 | โค้ดไม่มี FR | `./ApplyLabBoyPrototype.jsx`: announcement ข้อมูลเวลาปฏิบัติงาน | Out of scope: การจัดตารางปฏิบัติงาน | prototype แสดงเวลาปฏิบัติงาน อังคาร 13:00–14:45 ซึ่งเป็นเรื่องการจัดตารางที่ระบุไว้นอกขอบเขต |  |
| F-004 | เดา Q-xx | `./ApplyLabBoyPrototype.jsx`: application number และ formatApplicationTime | FR-LB-04, FR-LB-08; tasks.md Q-03 (ไม่มีใน spec) | กำหนดรูปแบบเลขใบสมัคร `LB-2569-0001` และรูปแบบวันที่/เวลาเอง ทั้งที่ spec ไม่ได้ระบุรูปแบบ; Q-03 ใน tasks ไม่มีรายการคำถามรองรับใน spec ตาม F-001 |  |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
