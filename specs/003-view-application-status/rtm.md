# RTM: ดูสถานะการสมัคร
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-13 | test: backend 7 ผ่าน 0 ไม่ผ่าน; frontend 3 ผ่าน 1 ไม่ผ่าน 1 todo

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)

| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-STS-01 | AC-STS-01 | T-02 (พร้อมทำ) | ไม่มีโค้ดของรายการใบสมัครใน SPEC-03 | ไม่มี test ของ AC-STS-01 | ยังไม่ถึง |
| FR-STS-02 | AC-STS-02 | T-03 (เสร็จ รอทีมตรวจ) | `frontend/src/components/ApplicationStatusDetail.jsx`: `ApplicationStatusDetail` แสดง status และเวลา `Asia/Bangkok` แต่ยังไม่มีหน้า/API ที่เรียกใช้ | `test_TC_STS_02_1_shows_latest_status_and_bangkok_time` ผ่าน; `test_TC_STS_02_2_handles_day_boundary_update_time` ผ่าน; `test_TC_STS_02_3_handles_missing_application` todo | ช่องโหว่ F-001, F-002 |
| FR-STS-03 | AC-STS-03 | T-04 (พร้อมทำ) | ไม่มีโค้ดของเหตุผลและรายการที่ต้องแก้ใน flow ของ SPEC-03 | ไม่มี test ของ AC-STS-03 | ยังไม่ถึง |
| FR-STS-04 | AC-STS-04 | T-01, T-05 (พร้อมทำ) | ไม่มี model/query/page ของชุดสถานะ 6 ค่าใน SPEC-03 | ไม่มี test ของ AC-STS-04 | ยังไม่ถึง |
| FR-STS-05 | AC-STS-05 | T-02, T-05 (พร้อมทำ) | ไม่มีรายการใบสมัครหรือ filter ตามประกาศใน SPEC-03 | ไม่มี test ของ AC-STS-05 | ยังไม่ถึง |
| FR-STS-06 | AC-STS-06 | T-03 (เสร็จ รอทีมตรวจ) | ไม่มีโค้ดที่โหลดข้อมูลล่าสุดเมื่อเปิดหน้า; `ApplicationStatusDetail` รับข้อมูลผ่าน prop เท่านั้น | ไม่มี test ของ AC-STS-06 | ช่องโหว่ F-001 |
| NFR-SEC-01 | AC-STS-07 | T-02, T-06 (พร้อมทำ) | ไม่มี session/ownership flow ของใบสมัครใน SPEC-03 | ไม่มี test ของ AC-STS-07 | ยังไม่ถึง |
| NFR-REL-01 | AC-STS-08 | T-06 (พร้อมทำ) | ไม่มี transition rule ของสถานะใบสมัครใน SPEC-03 | ไม่มี test ของ AC-STS-08 | ยังไม่ถึง |
| NFR-USE-01 | AC-STS-09 | T-04, T-06 (พร้อมทำ) | มีเฉพาะข้อความแสดงสถานะ/เวลาใน `ApplicationStatusDetail`; ยังไม่มีรายละเอียดเหตุผลและรายการแก้ใน flow ที่ใช้งานจริง | ไม่มี test ของ AC-STS-09 | ยังไม่ถึง |
| ผู้ใช้ดูได้เฉพาะใบสมัครของตนเอง | AC-STS-01, AC-STS-07 | T-02, T-06 (พร้อมทำ) | ไม่มีโค้ดกรองตามผู้ใช้ปัจจุบัน | ไม่มี test ของ AC-STS-01 หรือ AC-STS-07 | ยังไม่ถึง |
| สถานะต้องอ้างอิงจากข้อมูลล่าสุดในระบบ | AC-STS-02, AC-STS-04, AC-STS-06 | T-01, T-03 (T-03 เสร็จ รอทีมตรวจ) | ไม่มีแหล่งข้อมูล/API ล่าสุด; component รับค่า `application` จากภายนอก | test AC-STS-02 ตรวจการแสดง prop ที่ส่งเข้า component เท่านั้น | ยังไม่ถึง |
| ผู้ใช้ต้องเข้าสู่ระบบก่อนดูสถานะ | AC-STS-01, AC-STS-07 | T-02, T-06 (พร้อมทำ) | ไม่มี session guard ของใบสมัคร | ไม่มี test ของ AC-STS-01 หรือ AC-STS-07 | ยังไม่ถึง |
| รายการใบสมัครเรียงจากรายการที่อัปเดตล่าสุดก่อน และกรองตามประกาศได้ | AC-STS-05 | T-02, T-05 (พร้อมทำ) | ไม่มี query/list/filter ของใบสมัคร | ไม่มี test ของ AC-STS-05 | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)

| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/components/ApplicationStatusDetail.jsx`: `ApplicationStatusDetail` | FR-STS-02, AC-STS-02 | ตรงบางส่วน | แสดง status และจัดรูปเวลา `Asia/Bangkok` ตาม requirement แต่ไม่โหลดข้อมูลและไม่ได้เชื่อมกับหน้าใช้งานจริง |
| `frontend/src/components/ApplicationStatusDetail.jsx`: fallback `status` และ `formattedTime` | ไม่มี ID ใน SPEC-03 | ไม่พบข้อกำหนดตรง | กำหนดค่าเริ่มต้น `ยื่นแล้ว` และ `—` เมื่อข้อมูลไม่ครบ ซึ่ง spec ไม่ได้กำหนดพฤติกรรมนี้ |
| `frontend/src/App.jsx`: `App` | ไม่มี ID ใน SPEC-03 | ไม่ตรง | เป็นหน้าเริ่มต้นของระบบจองคิวตรวจสุขภาพ ไม่แสดงสถานะการสมัคร |
| `frontend/src/api/client.js`: `api.getSlots` | FR-BKG-01, FR-BKG-06 | ไม่ใช่ SPEC-03 | เป็น API ของฟีเจอร์จองคิว ไม่เกี่ยวกับดูสถานะการสมัคร |
| `frontend/src/api/client.js`: `api.createBooking` | FR-BKG-04 | ไม่ใช่ SPEC-03 | เป็น API ของฟีเจอร์จองคิว ไม่เกี่ยวกับดูสถานะการสมัคร |
| `frontend/src/api/workerStatusDemo.js`: `listWorkers` | FR-WKS-02 | ไม่ใช่ SPEC-03 | เป็น mock ของฟีเจอร์สถานะผู้ปฏิบัติงาน ไม่ใช่สถานะใบสมัคร |
| `frontend/src/api/workerStatusDemo.js`: `getWorker` | FR-WKS-03 | ไม่ใช่ SPEC-03 | เป็น mock ของฟีเจอร์อื่น |
| `frontend/src/api/workerStatusDemo.js`: `getStatusReport` | Q-01, AC-WKS-04 | ไม่ใช่ SPEC-03 | เป็น mock ของฟีเจอร์อื่น |
| `frontend/src/components/AnnouncementForm.jsx`: `AnnouncementForm` | FR-REC-01 ถึง FR-REC-03 | ไม่ใช่ SPEC-03 | เป็นฟอร์มเปิดรับสมัครของฟีเจอร์อื่น |
| `frontend/src/components/PaymentStatusBadge.jsx`: `PaymentStatusBadge` | ไม่มี ID ใน SPEC-03 | ไม่พบข้อกำหนดตรง | เป็น component สถานะการชำระเงิน ไม่ใช่สถานะใบสมัคร |
| `frontend/src/main.jsx`: `createRoot` | ไม่มี ID ใน SPEC-03 | โครงแอป | เป็น bootstrap ของ frontend ไม่ใช่พฤติกรรมตาม requirement |
| `backend/app/auth/idp.py`: `get_verified_hn` | IF-IDP-01 | ไม่ใช่ SPEC-03 | ตรวจ token ของผู้รับบริการสำหรับฟีเจอร์จองคิว |
| `backend/app/booking/router.py`: `create_booking`, `cancel_booking` | FR-BKG-04 | ไม่ใช่ SPEC-03 | endpoint จองและยกเลิกคิว |
| `backend/app/booking/service.py`: `create_booking`, `cancel_booking`, `next_queue_no` | FR-BKG-04 | ไม่ใช่ SPEC-03 | service จองคิว |
| `backend/app/slots/router.py`: `get_slots` | FR-BKG-01, FR-BKG-06 | ไม่ใช่ SPEC-03 | endpoint ช่วงเวลาตรวจ |
| `backend/app/slots/service.py`: `list_available_slots` | FR-BKG-01, FR-BKG-06 | ไม่ใช่ SPEC-03 | service ค้นช่วงเวลาว่าง |
| `backend/app/student_status/service.py`: `record_verification` | FR-REG-04 | ไม่ใช่ SPEC-03 | service ตรวจสอบสถานะนักศึกษาของฟีเจอร์อื่น |
| `backend/app/db/models.py`: `Slot`, `Booking`, `AuditLog`, `StudentVerification` | FR-BKG-*, DOM-PDPA-01, FR-REG-04 | ไม่ใช่ SPEC-03 | ไม่มี model ใบสมัครของ SPEC-03 |
| `backend/app/db/migrations/001_init.py`: `upgrade` | CON-TECH-01, DOM-PDPA-01, IF-HIS-01 | ไม่ใช่ SPEC-03 | migration ของฟีเจอร์จองคิว |
| `backend/app/config.py`: `DATABASE_URL` | CON-TECH-01 | ไม่ใช่ SPEC-03 | config ของระบบฐานข้อมูลส่วนกลาง/ฟีเจอร์อื่น |
| `backend/app/db/session.py`: `engine`, `get_db` | CON-TECH-01 | โครงสร้างร่วม | ไม่มีการโหลดใบสมัครของ SPEC-03 |
| `backend/app/main.py`: `app`, `lifespan` | ไม่มี ID ใน SPEC-03 | ไม่ตรง | ลงทะเบียนเฉพาะ router ของ slots และ bookings ไม่มี router ของใบสมัคร |

## 3. ข้อค้นพบ

ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: เว้นว่างให้ทีมตัดสิน

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | โค้ดไม่มี FR | `frontend/src/App.jsx`, ไม่มี `frontend/src/pages/ApplicationStatusPage.jsx`, ไม่มี `frontend/src/api/applicationStatus.js`, ไม่มี backend endpoint ใบสมัคร | FR-STS-02, FR-STS-06, AC-STS-02, AC-STS-06 | มีเพียง `ApplicationStatusDetail` ที่รับข้อมูลผ่าน prop แต่ไม่มี flow เปิดหน้า โหลดข้อมูลล่าสุด หรือเชื่อม API ทำให้พฤติกรรมตาม AC ยังใช้จริงไม่ได้ แม้ T-03 ระบุว่าเสร็จ รอทีมตรวจ | |
| F-002 | test อ่อน | `frontend/src/__tests__/TC-STS-02.test.jsx`, `TC-STS-02-2`, `TC-STS-02-3` | AC-STS-02 | test กรณีขอบคำนวณ expected ด้วย `Intl.DateTimeFormat` แบบเดียวกับ component จึงไม่ได้ตรวจ expected Asia/Bangkok ที่เป็นอิสระ และกรณีผิดเป็น `todo` ไม่มี assert; แถว TC-STS-02-3 ระบุพฤติกรรมว่า spec ไม่ได้บอก จึงยังไม่มีผลตรวจจริง | |
| F-003 | โค้ดไม่มี FR | `frontend/src/components/ApplicationStatusDetail.jsx`: fallback `status` และ `formattedTime` | ไม่มี ID ใน SPEC-03 | โค้ดตัดสินใจแทน spec เมื่อข้อมูลสถานะหรือเวลาไม่ครบด้วย `ยื่นแล้ว` และ `—` ขณะที่ spec ไม่ได้กำหนดผลลัพธ์กรณีข้อมูลไม่ครบ | |

หมายเหตุ: `frontend/src/api/client.test.js` ไม่ผ่านเพราะ `workerStatusApi` เป็น `undefined` แต่เป็น test ของ UC-13/ฟีเจอร์อื่น ไม่ได้นับเป็นข้อค้นพบของ SPEC-03 ใน RTM นี้

## 4. แก้แล้ว

| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| - | ไม่มี | ไม่มี rtm เดิมของ SPEC-03 ให้เปรียบเทียบ |
