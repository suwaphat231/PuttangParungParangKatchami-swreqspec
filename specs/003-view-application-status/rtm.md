# RTM: ดูสถานะการสมัคร
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-13 17:11 | test: backend 7 ผ่าน 0 ไม่ผ่าน; frontend 5 ผ่าน 0 ไม่ผ่าน 1 todo

## 1. ตามรอยไปข้างหน้า (requirement ไป AC ไป task ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-STS-01 | AC-STS-01 | T-02 พร้อมทำ | ไม่พบ API/การแสดงรายการใบสมัคร; `ApplicationStatusPage` มีเพียงการโหลดข้อมูลที่ backend ยังไม่มี | ไม่มี test ของ AC-STS-01 | ยังไม่ถึง |
| FR-STS-02 | AC-STS-02 | T-03 เสร็จ รอทีมตรวจ | `ApplicationStatusDetail` แสดง status จาก props โดยตรงและเวลา Asia/Bangkok | `test_TC_STS_02_1_shows_latest_status_and_bangkok_time` และ `test_TC_STS_02_2_handles_day_boundary_update_time` ผ่าน | ครบ |
| FR-STS-03 | AC-STS-03 | T-04 พร้อมทำ | `ApplicationStatusDetail` แสดงเหตุผล/รายการแก้จาก props แต่ยังไม่มี flow/service ข้อมูลใบสมัคร | ไม่มี test ของ AC-STS-03; task ยังไม่ทำ | ยังไม่ถึง |
| FR-STS-04 | AC-STS-04 | T-01, T-05 พร้อมทำ | ไม่พบ model/enum/query หรือการตรวจชุดสถานะ; component แสดง status ตาม prop | ไม่มี test ของ AC-STS-04; task ยังไม่ทำ | ยังไม่ถึง |
| FR-STS-05 | AC-STS-05 | T-02, T-05 พร้อมทำ | ไม่พบ API/query สำหรับเรียงรายการหรือกรองประกาศ | ไม่มี test ของ AC-STS-05; task ยังไม่ทำ | ยังไม่ถึง |
| FR-STS-06 | AC-STS-06 | T-01 พร้อมทำ; T-03 เสร็จ รอทีมตรวจ | หน้าโหลด `/api/applications` แบบ no-store แต่ backend ไม่มี route/model/source data | `TC-STS-06-1` ผ่านกับ mocked response; test ไม่ตั้งสถานะเก่าก่อนเปิดหน้า (F-001, F-003) | ช่องโหว่ (F-001, F-003) |
| NFR-SEC-01 | AC-STS-07 | T-02, T-06 พร้อมทำ | ไม่พบ session check, ownership guard หรือ query ใบสมัคร | ไม่มี test ของ AC-STS-07; task ยังไม่ทำ | ยังไม่ถึง |
| NFR-REL-01 | AC-STS-08 | T-01, T-06 พร้อมทำ | ไม่พบ status transition rule ของใบสมัคร | ไม่มี test ของ AC-STS-08; task ยังไม่ทำ | ยังไม่ถึง |
| NFR-USE-01 | AC-STS-09 | T-04, T-06 พร้อมทำ | component แสดงเวลา/เหตุผล/รายการแก้จาก props; ยังไม่มีข้อมูลจริงหรือการตรวจ UX ตาม AC | ไม่มี test ของ AC-STS-09; task ยังไม่ทำ | ยังไม่ถึง |
| Constraint: ดูได้เฉพาะใบสมัครของตนเอง | AC-STS-07 | T-02, T-06 พร้อมทำ | ไม่พบ session ownership check หรือ endpoint ใบสมัคร | ไม่มี test ของ AC-STS-07; task ยังไม่ทำ | ยังไม่ถึง |
| Constraint: สถานะต้องอ้างอิงจากข้อมูลล่าสุด | AC-STS-06 | T-01 พร้อมทำ; T-03 เสร็จ รอทีมตรวจ | frontend ใช้ no-store แต่ไม่มี backend source/route และ test ไม่จำลองสถานะเก่าก่อนโหลด (F-001, F-003) | `TC-STS-06-1` ผ่านกับ mocked response | ช่องโหว่ (F-001, F-003) |
| Constraint: ต้องเข้าสู่ระบบก่อนดูสถานะ | ไม่มี AC ตรง ๆ | T-02, T-06 พร้อมทำ | ไม่พบ session/authentication สำหรับ flow สถานะสมัคร | ไม่มี test ตรง constraint; task ยังไม่ทำ | ยังไม่ถึง |
| Constraint: เรียงล่าสุดก่อนและกรองตามประกาศได้ | AC-STS-05 | T-02, T-05 พร้อมทำ | ไม่พบ query/list/filter ของใบสมัคร | ไม่มี test ของ AC-STS-05; task ยังไม่ทำ | ยังไม่ถึง |

สรุป 13 แถว: ครบ 1, ยังไม่ถึง 10, รอ Q-xx 0, ช่องโหว่ 2

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/main.jsx: createRoot` | ไม่มี | โครงแอป | mount `App` |
| `frontend/src/App.jsx: App` | FR-STS-02, FR-STS-06 บางส่วน | ตรงบางส่วน | mount `ApplicationStatusPage` |
| `frontend/src/pages/ApplicationStatusPage.jsx: ApplicationStatusPage` | FR-STS-06 บางส่วน | ตรงบางส่วน | โหลดรายการเมื่อ mount, แสดง loading/error/empty และส่งแต่ละรายการให้ detail; response เป็น mock ใน test |
| `frontend/src/api/applicationStatus.js: listApplications` | FR-STS-06 บางส่วน | เป็นข้อเสนอใน plan; backend ไม่รองรับ | เรียก `/api/applications` ด้วย `cache: no-store`; ไม่มี endpoint ฝั่ง backend |
| `frontend/src/components/ApplicationStatusDetail.jsx: ApplicationStatusDetail` | FR-STS-02, FR-STS-03 บางส่วน | ตรงบางส่วน | แสดง status prop โดยตรงและเวลา Asia/Bangkok, reason/actions; ไม่มี fallback status/time |
| `backend/app/main.py: lifespan, app` | ไม่มีสำหรับ SPEC-03 | ไม่ครอบคลุม | สร้าง schema และ mount เฉพาะ slots/bookings; ไม่มี application-status router |
| `backend/app/slots/router.py: get_slots` | FR-BKG-01, FR-BKG-06 (นอก SPEC-03) | ไม่ใช่ requirement ใน spec นี้ | API ช่วงเวลาจอง |
| `backend/app/slots/service.py: list_available_slots` | FR-BKG-01, FR-BKG-06 (นอก SPEC-03) | ไม่ใช่ requirement ใน spec นี้ | กรอง package/date/ที่นั่ง และกำหนด `DAYS_AHEAD = 14` สำหรับฟีเจอร์จอง |
| `backend/app/booking/router.py: create_booking, cancel_booking` | FR-BKG-04, IF-IDP-01 (นอก SPEC-03) | ไม่ใช่ requirement ใน spec นี้ | API จอง/ยกเลิก; request มี `national_id` optional และ logger บันทึก `hn`/`national_id` เป็นเรื่องของฟีเจอร์อื่น |
| `backend/app/booking/service.py: next_queue_no, create_booking, cancel_booking` | FR-BKG-04 (นอก SPEC-03) | ไม่ใช่ requirement ใน spec นี้ | จัดการคิว ที่นั่ง และการจอง |
| `backend/app/auth/idp.py: get_verified_hn` | IF-IDP-01 (นอก SPEC-03) | ไม่ครอบคลุม login/ownership ของ SPEC-03 | ตรวจ token จำลองสำหรับฟีเจอร์จองคิว ไม่ใช่ session นักศึกษา |
| `backend/app/db/models.py: Slot, Booking, AuditLog, StudentVerification` | requirements ของ BKG/REG (นอก SPEC-03) | ไม่ครอบคลุม | ไม่มี model ใบสมัครหรือประวัติสถานะ |
| `backend/app/db/migrations/001_init.py: upgrade` | requirements ของ BKG (นอก SPEC-03) | ไม่ครอบคลุม | สร้าง schema ที่มีอยู่ ไม่มีตารางใบสมัคร |
| `backend/app/db/session.py: engine, get_db`; `backend/app/config.py: DATABASE_URL` | โครงสร้างร่วม | ไม่ใช่ behavior ของ SPEC-03 | config/session ฐานข้อมูลทั่วไป |
| `frontend/src/api/client.js: api.getSlots, api.createBooking, workerStatusApi.listWorkers` | requirements ของ BKG/WKS (นอก SPEC-03) | ไม่ใช่ requirement ใน spec นี้ | API client ของฟีเจอร์อื่น ไม่มี method สถานะใบสมัคร |
| `frontend/src/api/workerStatusDemo.js: listWorkers, getWorker, getStatusReport` | FR-WKS-02, FR-WKS-03, AC-WKS-04 (นอก SPEC-03) | ไม่ใช่ requirement ใน spec นี้ | mock สถานะผู้ปฏิบัติงาน |
| `frontend/src/components/AnnouncementForm.jsx: AnnouncementForm` | requirements ของ REC (นอก SPEC-03) | ไม่ใช่ requirement ใน spec นี้ | ฟอร์มประกาศรับสมัคร ไม่อยู่ใน flow สถานะสมัคร |
| `frontend/src/components/PaymentStatusBadge.jsx: PaymentStatusBadge` | ไม่มี ID ใน SPEC-03 | ไม่ใช่ requirement ใน spec นี้ | badge สถานะการชำระเงิน |
| `backend/app/student_status/service.py: record_verification` | FR-REG-04 (นอก SPEC-03) | ไม่ใช่ requirement ใน spec นี้ | บันทึกผลตรวจสถานะนักศึกษา ไม่ใช่สถานะใบสมัคร |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: เว้นว่างไว้ให้ทีมพิจารณา

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | โค้ดไม่มี FR | `frontend/src/api/applicationStatus.js`, `backend/app/main.py`, `backend/app/db/models.py` | FR-STS-06, Constraint: สถานะต้องอ้างอิงจากข้อมูลล่าสุด | frontend เรียก `/api/applications` แต่ backend ไม่มี route, model หรือ source data ใบสมัคร; การทดสอบหน้าจอใช้ mock จึงยังไม่ยืนยัน flow กับข้อมูลจริง แม้ T-03 ระบุว่าเสร็จ รอทีมตรวจ | |
| F-003 | test อ่อน | `frontend/src/__tests__/TC-STS-06-1.test.jsx` | AC-STS-06 | test ตรวจ status จาก mocked response และตรวจว่า `ยื่นแล้ว` ไม่แสดง แต่ไม่ได้ตั้งข้อมูลสถานะเก่าก่อนเปิดหน้า จึงยังไม่พิสูจน์ว่าข้อมูลเก่าถูกแทนด้วยข้อมูลใหม่; test ปัจจุบันผ่านแต่ยังมีช่องว่างนี้ | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-002 | ปรับ expected ของกรณีขอบ AC-STS-02 เป็นค่าคงที่เวลา Asia/Bangkok แทนการคำนวณซ้ำด้วย formatter ของ component | executable test ใช้ timestamp จุดเปลี่ยนวันและ expected Bangkok แบบค่าคงที่; ข้อค้นพบเดิมเรื่อง expected ซ้ำกับ component ไม่พบแล้ว |
| F-004 | ลบ fallback `ยื่นแล้ว` และ `—` ที่ไม่มีใน spec ออกจาก `ApplicationStatusDetail` | source ปัจจุบันไม่มี fallback ดังกล่าว; การไม่ render status เป็นข้อค้นพบใหม่ F-005 แยกต่างหาก |
| F-005 | เพิ่มการ render `application.status` โดยตรงโดยไม่มีค่า fallback | `ApplicationStatusDetail` แสดง status; test AC-STS-02 ทั้งสองกรณีและ AC-STS-06 ผ่าน |
| F-006 | แก้ Then ของ `TC-STS-02-1` จาก UTC เป็น Asia/Bangkok ให้ตรง AC-STS-02 | test cases ตรงกับ AC; executable tests AC-STS-02 ผ่าน |
