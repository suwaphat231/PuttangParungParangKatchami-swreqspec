# RTM: สมัครเป็น Lab Boy
อ้างอิง: [spec.md](./spec.md) Draft v2 | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | test เฉพาะฟีเจอร์: ไม่พบ

## 1. ตามรอยไปข้างหน้า (requirement ไป AC ไป task ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน/endpoint) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-LB-01 | AC-LB-02 | T-02 | ไม่พบ `ApplyLabBoyPage`, `ApplicationForm` หรือ API ประกาศ/สมัคร | ไม่พบ test ของ AC-LB-02 | ยังไม่ถึง |
| FR-LB-02 | AC-LB-03 | T-03 พร้อมทำ | ไม่พบ eligibility service หรือการเรียกระบบทะเบียนสำหรับ UC-01 | ไม่พบ test ของ AC-LB-03 | ยังไม่ถึง |
| FR-LB-03 | AC-LB-04 | T-02, T-03 พร้อมทำ | ไม่พบ validation ข้อมูลบัญชีผู้ใช้/เงื่อนไขการสมัคร | ไม่พบ test ของ AC-LB-04 | ยังไม่ถึง |
| FR-LB-04 | AC-LB-01 | T-01, T-04 พร้อมทำ | ไม่พบ application model, submit service หรือ endpoint สมัคร | ไม่พบ test ของ AC-LB-01 | ยังไม่ถึง |
| FR-LB-05 | AC-LB-05 | T-01, T-04 พร้อมทำ | ไม่พบ transaction/repository ที่ป้องกันใบสมัครไม่สมบูรณ์ | ไม่พบ test ของ AC-LB-05 | ยังไม่ถึง |
| FR-LB-06 | AC-LB-06 | T-02, T-06 พร้อมทำ | ไม่พบ draft/form flow ของ UC-01 | ไม่พบ test ของ AC-LB-06 | ยังไม่ถึง |
| FR-LB-07 | AC-LB-07 | T-07 พร้อมทำ | ไม่พบ withdraw service หรือการตรวจเวลาปิดรับสมัคร | ไม่พบ test ของ AC-LB-07 | ยังไม่ถึง |
| FR-LB-08 | AC-LB-08 | T-07 พร้อมทำ | ไม่พบกฎสมัครใหม่หลังถอนหรือ application-number generator ของ UC-01 | ไม่พบ test ของ AC-LB-08 | ยังไม่ถึง |
| FR-LB-09 | AC-LB-09 | T-08 | ไม่พบ registry fallback หรือการสร้างสถานะ `รอตรวจสอบ` | ไม่พบ test ของ AC-LB-09 | ยังไม่ถึง |
| FR-LB-10 | AC-LB-10 | T-05 | ไม่พบ capacity check แบบ atomic หรือการจัดลำดับคำขอ | ไม่พบ test ของ AC-LB-10 | ยังไม่ถึง |
| NFR-SEC-01 | AC-LB-12 | T-09 | ไม่พบ endpoint/transport ของ UC-01 ที่ตรวจสอบ HTTPS/TLS | ไม่พบ test ของ AC-LB-12 | ยังไม่ถึง |
| NFR-REL-01 | AC-LB-11 | T-01, T-04 พร้อมทำ | ไม่พบ unique/idempotency rule ของใบสมัคร | ไม่พบ test ของ AC-LB-11 | ยังไม่ถึง |
| NFR-USE-01 | AC-LB-02 | T-02, T-09 | ไม่พบหน้า/ข้อความ UX ของ UC-01 | ไม่พบ test ของ AC-LB-02 | ยังไม่ถึง |
| Constraint: ต้องเข้าสู่ระบบก่อนสมัคร | ไม่มี AC ตรง | T-03 พร้อมทำ | ไม่พบ session/auth guard สำหรับ UC-01 | ไม่พบ test ตรง constraint | ยังไม่ถึง |
| Constraint: ต้องมีประกาศอยู่ในช่วงเปิดรับ | ไม่มี AC ตรง | T-02, T-03 พร้อมทำ | ไม่พบการตรวจช่วงเวลาเปิดรับของประกาศ | ไม่พบ test ตรง constraint | ยังไม่ถึง |
| Constraint: ข้อมูลบัญชีผู้ใช้ต้องครบก่อนยืนยัน | AC-LB-04 | T-02, T-03 พร้อมทำ | ไม่พบ account-data validation | ไม่พบ test ของ AC-LB-04 | ยังไม่ถึง |
| Constraint: สมัครสำเร็จแล้วห้ามสร้างใบสมัครซ้ำ | AC-LB-11 | T-01, T-04 พร้อมทำ | ไม่พบ unique/idempotency implementation | ไม่พบ test ของ AC-LB-11 | ยังไม่ถึง |
| Constraint: ใช้ข้อมูลบัญชีผู้ใช้โดยไม่แนบเอกสาร | ไม่มี AC ตรง | T-02 | ไม่พบ application form ที่ดึงข้อมูลบัญชีผู้ใช้ | ไม่พบ test ตรง constraint | ยังไม่ถึง |
| Constraint: เต็มแล้วรับตามเวลายืนยันสำเร็จ | AC-LB-10 | T-05 | ไม่พบ atomic capacity/order implementation | ไม่พบ test ของ AC-LB-10 | ยังไม่ถึง |

หมายเหตุ: โค้ดที่พบใน `backend/app/booking/`, `backend/app/slots/` และ `backend/app/auth/idp.py` เป็นฟีเจอร์จองคิวคนละขอบเขต ไม่ใช่ implementation ของ UC-01 และไม่ได้นับเป็นหลักฐานของฟีเจอร์นี้

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/booking/router.py: POST /bookings` | FR-BKG-04, IF-IDP-01 | ไม่ตรงกับ SPEC-01-01 | เป็น API จองคิวตรวจสุขภาพ ไม่ใช่การสมัคร Lab Boy |
| `backend/app/booking/router.py: DELETE /bookings/{booking_id}` | FR-BKG-04 | ไม่ตรงกับ SPEC-01-01 | เป็นการยกเลิก booking ไม่ใช่ถอนใบสมัคร Lab Boy |
| `backend/app/slots/router.py: GET /slots` | FR-BKG-01, FR-BKG-06 | ไม่ตรงกับ SPEC-01-01 | เป็นช่วงเวลาตรวจสุขภาพ ไม่ใช่ประกาศรับสมัคร |
| `backend/app/student_status/service.py: record_verification` | FR-REG-04 | ไม่ตรงกับ FR-LB-02 โดยตรง | บันทึกผลตรวจสถานะนักศึกษา แต่ไม่มี flow สมัครหรือการอนุญาตสมัคร |
| `frontend/src/pages/ApplicationStatusPage.jsx: ApplicationStatusPage` | FR-STS-* | ไม่ตรงกับ SPEC-01-01 | แสดงสถานะใบสมัครที่มีอยู่ ไม่ใช่หน้าสมัคร |
| `frontend/src/components/AnnouncementForm.jsx: AnnouncementForm` | FR-ANN-01/02 บางส่วน | ไม่ตรงกับ FR-LB-01 | เป็นฟอร์มจัดทำประกาศของเจ้าหน้าที่ ไม่มีการสมัครหรือ persistence |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | อ้าง ID ผิดเรื่อง | `tasks.md`: Open Questions | spec.md ไม่มี Q-01 ถึง Q-04 | tasks.md อ้าง Q-01 ถึง Q-04 แต่ spec.md ไม่มีคำถามเหล่านี้ จึงปรับสถานะ requirement ที่เกี่ยวข้องเป็น `ยังไม่ถึง` และไม่ถือว่าเป็น `รอ Q-xx` | |

## 4. แก้แล้ว
ไม่มี
