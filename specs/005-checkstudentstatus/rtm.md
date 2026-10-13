# RTM: ตรวจสอบสถานะนักศึกษา
อ้างอิง: spec.md Clarified v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-13 | test: backend 7 ผ่าน 0 ไม่ผ่าน | frontend 1 ผ่าน 1 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-REG-01 | AC-REG-01 | ไม่มี task | ไม่พบโค้ด UC-05 | ไม่พบ test ของ AC-REG-01 | ยังไม่ถึง |
| FR-REG-02 | AC-REG-01, AC-REG-02 | ไม่มี task | ไม่พบโค้ด UC-05 | ไม่พบ test ของ AC-REG-01/02 | ยังไม่ถึง |
| FR-REG-03 | AC-REG-03, AC-REG-04, AC-REG-06 | ไม่มี task | ไม่พบโค้ด UC-05 | ไม่พบ test ของ AC-REG-03/04/06 | ยังไม่ถึง |
| FR-REG-04 | AC-REG-05 | T-01 เสร็จ | `backend/app/db/models.py: StudentVerification`, `backend/app/student_status/service.py: record_verification` | `test_TC_REG_05_1_records_student_verification` ผ่าน; `test_TC_REG_05_3_rejects_incomplete_student_data` ผ่าน; กรณีขอบ `test_TC_REG_05_2_records_boundary_student_data` รอ Q-04 | รอ Q-04 |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่พบโค้ด UC-05 | ไม่พบ test | ยังไม่ถึง |
| NFR-REL-01 | ไม่มี AC | ไม่มี task | ไม่พบโค้ด UC-05 | ไม่พบ test | ยังไม่ถึง |
| NFR-UX-01 | AC-REG-04 | ไม่มี task | ไม่พบโค้ด UC-05 | ไม่พบ test ของ AC-REG-04 | ยังไม่ถึง |
| Constraint: ใช้ข้อมูลจากระบบทะเบียนที่เชื่อถือได้ | AC-REG-01, AC-REG-03, AC-REG-04 | ไม่มี task | ไม่พบโค้ด UC-05 | ไม่พบ test | ยังไม่ถึง |
| Constraint: ไม่ควรเก็บข้อมูลส่วนบุคคลเกินความจำเป็น | AC-REG-05 | T-01 เสร็จ | `StudentVerification` เก็บเฉพาะรหัส ชื่อ และสถานะ | `test_TC_REG_05_1` และ `test_TC_REG_05_3` ผ่าน; กรณีขอบรอ Q-04 | รอ Q-04 |

หมายเหตุ: AC-REG-05 มี test ที่รันผ่าน 2 กรณี และกรณีขอบรอ Q-04 ตาม spec; task T-01 เสร็จแล้ว

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/main.py: lifespan`, `app` | ไม่มี ID ของ UC-05 | ไม่ใช่โค้ด UC-05 | สร้างตารางและรวม router ของฟีเจอร์ booking |
| `backend/app/booking/router.py: BookingRequest`, `POST /bookings` | FR-BKG-04, IF-IDP-01 | ไม่ใช่โค้ด UC-05 | รับ `slot_id`, `national_id` และ log ค่า request ของ booking |
| `backend/app/booking/router.py: DELETE /bookings/{booking_id}` | FR-BKG-04 | ไม่ใช่โค้ด UC-05 | ยกเลิกการจอง |
| `backend/app/booking/service.py: next_queue_no` | FR-BKG-04 | ไม่ใช่โค้ด UC-05 | สร้างเลขคิวรูปแบบ `A001` |
| `backend/app/booking/service.py: create_booking`, `cancel_booking` | FR-BKG-04 | ไม่ใช่โค้ด UC-05 | ตัด/คืนที่นั่งและบันทึก booking |
| `backend/app/slots/router.py: GET /slots` | FR-BKG-01, FR-BKG-06 | ไม่ใช่โค้ด UC-05 | คืน slot ที่ยังมีที่นั่ง |
| `backend/app/slots/service.py: list_available_slots` | FR-BKG-01, FR-BKG-06 | ไม่ใช่โค้ด UC-05 | กรองแพ็กเกจ ที่นั่ง และช่วงเวลา |
| `backend/app/auth/idp.py: get_verified_hn` | IF-IDP-01 | ไม่ใช่โค้ด UC-05 | ตรวจ `Bearer verified:<HN>` |
| `backend/app/config.py: DATABASE_URL` | CON-TECH-01 | ไม่ใช่โค้ด UC-05 | ค่าเริ่มต้นเป็น SQLite สำหรับ Codespace |
| `backend/app/db/models.py: Slot`, `Booking`, `AuditLog` | CON-TECH-01, DOM-PDPA-01, IF-HIS-01 | ไม่ใช่โค้ด UC-05 | เป็น model ของ booking; `Booking` มี `hn` และไม่มี `national_id` ในตาราง |
| `frontend/src/api/client.js: api.getSlots`, `api.createBooking` | ไม่มี ID ของ UC-05 | ไม่ใช่โค้ด UC-05 | เรียก API ของ booking |
| `frontend/src/api/workerStatusDemo.js: listWorkers`, `getWorker`, `getStatusReport` | FR-WKS-02, FR-WKS-03, AC-WKS-04, Q-01 | ไม่ใช่โค้ด UC-05 | mock ของฟีเจอร์ตรวจสอบสถานะผู้ปฏิบัติงาน |
| `frontend/src/App.jsx: App` และ components ทั้งหมด | ไม่มี ID ของ UC-05 | ไม่ใช่โค้ด UC-05 | หน้าจอ booking โครงร่างและ components ของฟีเจอร์อื่น |

## 3. ข้อค้นพบ
| F-001 | ข้อมูลไม่ครบ | `test-cases.md: TC-REG-05-2` | Q-04 | กรณีขอบของ AC-REG-05 ไม่มีค่าที่ spec กำหนด จึงยังยืนยันพฤติกรรมขอบเขตไม่ได้ | เพิ่ม Q-04 ใน spec.md แล้ว รอทีมยืนยัน |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|