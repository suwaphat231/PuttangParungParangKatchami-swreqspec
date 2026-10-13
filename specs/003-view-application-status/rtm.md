# RTM: ดูสถานะการสมัคร
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-13 16:02; ตรวจซ้ำหลังแก้ UI 2569-10-13 16:18 | test: backend 7 ผ่าน 0 ไม่ผ่าน; frontend 3 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-STS-01 | AC-STS-01 | T-02 พร้อมทำ | ไม่พบหน้า/API รายการใบสมัคร | ไม่มี test ของ AC-STS-01; task ยังไม่ทำ | ยังไม่ถึง |
| FR-STS-02 | AC-STS-02 | T-03 เสร็จ รอทีมตรวจ | `ApplicationStatusPage.jsx` เรียก API แล้วส่งข้อมูลให้ `ApplicationStatusDetail.jsx` แสดงสถานะและเวลา Asia/Bangkok; backend API ยังไม่มี | ไม่มี test ของ AC-STS-02 | ช่องโหว่ (F-001, F-002, F-004) |
| FR-STS-03 | AC-STS-03 | T-04 พร้อมทำ | `ApplicationStatusDetail.jsx` แสดงเหตุผล/รายการแก้เมื่อมี props; ไม่พบ service/controller backend สำหรับข้อมูลดังกล่าว | ไม่มี test ของ AC-STS-03; task ยังไม่ทำ | ยังไม่ถึง |
| FR-STS-04 | AC-STS-04 | T-01, T-05 พร้อมทำ | ไม่พบ model, enum หรือ query สถานะใบสมัคร; component แสดงค่า status ที่รับมาโดยไม่ตรวจชุดสถานะ | ไม่มี test ของ AC-STS-04; task ยังไม่ทำ | ยังไม่ถึง |
| FR-STS-05 | AC-STS-05 | T-02, T-05 พร้อมทำ | ไม่พบ API/query รายการใบสมัคร การเรียง หรือการกรองตามประกาศ | ไม่มี test ของ AC-STS-05; task ยังไม่ทำ | ยังไม่ถึง |
| FR-STS-06 | AC-STS-06 | T-01 พร้อมทำ; T-03 เสร็จ รอทีมตรวจ | `App.jsx` mount `ApplicationStatusPage`; หน้าเรียก `GET /api/applications` แบบ no-store แต่ backend ไม่มี route/source data | `TC-STS-06-1` ผ่านด้วย mocked response; ยังไม่ยืนยันกับ backend จริงและยังไม่พิสูจน์การแทนสถานะเก่าที่ถูกตั้งไว้ก่อนหน้า | ช่องโหว่ (F-002, F-003) |
| NFR-SEC-01 | AC-STS-07 | T-02, T-06 พร้อมทำ | ไม่พบ session check, ownership guard หรือ query ใบสมัคร | ไม่มี test ของ AC-STS-07; task ยังไม่ทำ | ยังไม่ถึง |
| NFR-REL-01 | AC-STS-08 | T-01, T-06 พร้อมทำ | ไม่พบ status transition rule ของใบสมัคร | ไม่มี test ของ AC-STS-08; task ยังไม่ทำ | ยังไม่ถึง |
| NFR-USE-01 | AC-STS-09 | T-04, T-06 พร้อมทำ | หน้าใช้ `ApplicationStatusDetail` แสดง status/time/reason/actions; ยังไม่มีการตรวจความชัดเจนและเนื้อหาจาก backend | ไม่มี test ของ AC-STS-09; task ยังไม่ทำ | ยังไม่ถึง |
| Constraint: ดูได้เฉพาะใบสมัครของตนเอง | AC-STS-07 | T-02, T-06 พร้อมทำ | ไม่พบการยืนยันเจ้าของใบสมัครหรือ endpoint รายละเอียด | ไม่มี test ของ AC-STS-07; task ยังไม่ทำ | ยังไม่ถึง |
| Constraint: ใช้สถานะล่าสุดจากระบบ | AC-STS-06 | T-01 พร้อมทำ; T-03 เสร็จ รอทีมตรวจ | frontend โหลดผ่าน API helper แบบ no-store; backend route/data/auth ยังไม่มี และ component ยังมี fallback สถานะคงที่ | `TC-STS-06-1` ผ่านกับ mocked response เท่านั้น; ยังไม่ตรวจ backend จริง | ช่องโหว่ (F-002, F-003, F-004) |
| Constraint: ต้องเข้าสู่ระบบก่อนดูสถานะ | ไม่มี AC ตรง ๆ | T-02, T-06 พร้อมทำ | ไม่พบ session/authentication สำหรับหน้าสถานะสมัคร | ไม่มี test ตรง constraint; task ยังไม่ทำ | ยังไม่ถึง |
| Constraint: เรียงล่าสุดก่อนและกรองตามประกาศได้ | AC-STS-05 | T-02, T-05 พร้อมทำ | ไม่พบ query/list API ของใบสมัคร | ไม่มี test ของ AC-STS-05; task ยังไม่ทำ | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/App.jsx: App` | FR-STS-02, FR-STS-06 บางส่วน | ตรงบางส่วน | mount `ApplicationStatusPage`; behavior โหลดหน้าได้รับการทดสอบด้วย mock ไม่ได้ยืนยัน backend จริง |
| `frontend/src/pages/ApplicationStatusPage.jsx: ApplicationStatusPage` | FR-STS-06 บางส่วน | ตรงบางส่วน | โหลดข้อมูลเมื่อ mount, ใช้ no-store, แสดง loading/error/empty และส่งข้อมูลให้ detail component; API จริงยังไม่มี |
| `frontend/src/api/applicationStatus.js: listApplications` | FR-STS-06 บางส่วน | ตรงข้อเสนอใน plan; backend ยังไม่รองรับ | เรียก `/api/applications` แบบ no-store; URL/response เป็นข้อเสนอทางเทคนิคที่ยังรอทีมตรวจ |
| `frontend/src/components/ApplicationStatusDetail.jsx: ApplicationStatusDetail` | FR-STS-02, FR-STS-03 บางส่วน | ตรงบางส่วน | แสดงสถานะ เวลาไทย เหตุผล และรายการแก้จาก props; fallback `ยื่นแล้ว` ไม่ได้กำหนดใน spec (F-004) |
| `frontend/src/main.jsx: createRoot` | ไม่มี | ไม่ครอบคลุม requirement สถานะสมัครโดยตรง | mount `App`, ซึ่งขณะนี้แสดงหน้า `ApplicationStatusPage` |
| `backend/app/main.py: lifespan, app` | ไม่มีสำหรับ feature 003 | ไม่ครอบคลุม requirement สถานะสมัคร | สร้าง schema แล้ว mount เฉพาะ slots/bookings router; ไม่พบ application-status/detail router |
| `backend/app/slots/router.py: GET /slots` | FR-BKG-01, FR-BKG-06 (อยู่นอก feature 003) | ไม่ใช่ requirement ใน spec นี้ | ค้นช่วงเวลาจอง ไม่ใช่รายการใบสมัคร |
| `backend/app/slots/service.py: list_available_slots` | FR-BKG-01, FR-BKG-06 (อยู่นอก feature 003) | ไม่ใช่ requirement ใน spec นี้ | ใช้ `DAYS_AHEAD = 14` สำหรับช่วงเวลาจอง; ไม่ใช่กฎของสถานะสมัคร |
| `backend/app/booking/router.py: POST /bookings, DELETE /bookings/{booking_id}` | FR-BKG-04, IF-IDP-01 (อยู่นอก feature 003) | ไม่ใช่ requirement ใน spec นี้ | endpoints จอง/ยกเลิกการจอง ไม่ใช่ endpoints สถานะสมัคร |
| `backend/app/booking/service.py: next_queue_no, create_booking, cancel_booking` | FR-BKG-04 (อยู่นอก feature 003) | ไม่ใช่ requirement ใน spec นี้ | จัดการคิวและที่นั่งของการจอง |
| `backend/app/auth/idp.py: get_verified_hn` | IF-IDP-01 (อยู่นอก feature 003) | ไม่ครอบคลุมการเข้าสู่ระบบตาม spec 003 | ตรวจ bearer token และคืน HN; ไม่มี session/user ownership ของใบสมัครนักศึกษา |
| `backend/app/student_status/service.py: record_verification` | ไม่มี ID ใน spec 003 | ไม่ใช่ requirement ใน spec นี้ | บันทึกข้อมูลตรวจสอบนักศึกษา; ไม่ใช่สถานะใบสมัคร |
| `backend/app/db/models.py: Base, Slot, Booking, AuditLog, StudentVerification` และ `backend/app/db/migrations/001_init.py: upgrade` | CON-TECH-01, DOM-PDPA-01, IF-HIS-01 (อยู่นอก feature 003) | ไม่ครอบคลุม requirement สถานะสมัคร | ไม่มีตาราง/model ใบสมัครหรือประวัติสถานะ |
| `backend/app/config.py: DATABASE_URL`, `backend/app/db/session.py: get_db` | CON-TECH-01 (อยู่นอก feature 003) | ไม่ใช่ requirement ใน spec นี้ | การตั้งค่าและ session ฐานข้อมูลของ backend โดยทั่วไป |
| `frontend/src/api/client.js: getSlots, createBooking` | FR-BKG (อยู่นอก feature 003) | ไม่ใช่ requirement ใน spec นี้ | ไม่มี client method สำหรับสถานะใบสมัคร |
| `frontend/src/api/workerStatusDemo.js: getContext, listWorkers, getWorker, getStatusReport` | FR-WKS-02, FR-WKS-03, AC-WKS-04 (อยู่นอก feature 003) | ไม่ใช่ requirement ใน spec นี้ | mock สถานะผู้ปฏิบัติงาน ไม่ใช่สถานะใบสมัครนักศึกษา |
| `frontend/src/components/AnnouncementForm.jsx: AnnouncementForm` | ไม่มี ID ใน spec 003 | ไม่ใช่ requirement ใน spec นี้ | ฟอร์มประกาศรับสมัคร เป็น UI อื่นและไม่ถูกใช้ใน flow สถานะสมัคร |
| `frontend/src/components/PaymentStatusBadge.jsx: PaymentStatusBadge` | ไม่มี ID ใน spec 003 | ไม่ใช่ requirement ใน spec นี้ | badge สถานะการชำระเงิน เป็น UI อื่น ไม่เกี่ยวกับสถานะใบสมัคร |

## 3. ข้อค้นพบ
ทีมตัดสิน: เว้นว่างไว้ให้ทีมพิจารณา

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | AC ไม่มี test | AC-STS-02, T-03 | FR-STS-02 | T-03 ระบุ `เสร็จ รอทีมตรวจ` แต่ไม่มี test ที่ตรวจทั้งสถานะล่าสุดและเวลา Asia/Bangkok; component ที่พบยังไม่มี test เฉพาะ | |
| F-002 | โค้ดไม่มี FR | `frontend/src/api/applicationStatus.js`, `backend/app/main.py` | FR-STS-06, Constraint: ใช้สถานะล่าสุดจากระบบ | frontend เรียก `/api/applications` แล้ว แต่ backend mount เฉพาะ slots/bookings ไม่มี route, model หรือ source data ของใบสมัคร; test ผ่านเพราะ mock response ไม่ได้พิสูจน์ระบบจริง ทั้งที่ T-03 ระบุว่าเสร็จรอทีมตรวจ | |
| F-003 | test อ่อน | `frontend/src/__tests__/TC-STS-06-1.test.jsx:12-28` | AC-STS-06 | test ไม่ได้ตั้งสถานะเก่าค้างไว้ก่อนเปิดหน้า และตรวจเพียงว่า `fetch` ถูกเรียก ไม่ได้ยืนยันว่า response ที่มีสถานะใหม่เป็นข้อมูลที่หน้าจอแสดง; assertion ว่าสถานะเก่าไม่ปรากฏจึงยังไม่พิสูจน์การแทนข้อมูลเก่า | |
| F-004 | โค้ดไม่มี FR | `frontend/src/components/ApplicationStatusDetail.jsx:9` | FR-STS-02, Constraint: ใช้สถานะล่าสุดจากระบบ | เมื่อไม่มี `application.status` component กำหนดสถานะเป็น `ยื่นแล้ว` เอง; spec ไม่ได้กำหนด fallback นี้ จึงอาจแสดงสถานะที่ไม่ใช่ข้อมูลล่าสุด (ปัจจุบัน component ยังไม่ถูก mount ใน App) | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
สร้างด้วย /verify รอบ 2 เมื่อ 2569-10-13 | test: backend 7 ผ่าน 0 ไม่ผ่าน; frontend 4 ผ่าน 0 ไม่ผ่าน 1 todo

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)

| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-STS-01 | AC-STS-01 | T-02 (พร้อมทำ) | ไม่มีโค้ดของรายการใบสมัครใน SPEC-03 | ไม่มี test ของ AC-STS-01 | ยังไม่ถึง |
| FR-STS-02 | AC-STS-02 | T-03 (เสร็จ รอทีมตรวจ) | `frontend/src/components/ApplicationStatusDetail.jsx`: `ApplicationStatusDetail` แสดง status และเวลา `Asia/Bangkok` แต่ยังไม่มีหน้า/API ที่เรียกใช้ | `test_TC_STS_02_1_shows_latest_status_and_bangkok_time` ผ่าน; `test_TC_STS_02_2_handles_day_boundary_update_time` ผ่าน; `test_TC_STS_02_3_handles_missing_application` todo | ช่องโหว่ F-001 |
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
| `frontend/src/components/ApplicationStatusDetail.jsx`: `status` และ `formattedTime` | FR-STS-02, AC-STS-02 | ตรงบางส่วน | แสดงค่าจาก `application` และไม่กำหนด fallback ใหม่เมื่อข้อมูลไม่ครบ |
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

หมายเหตุ: test ของ UC-13 ใน `frontend/src/api/client.test.js` แก้แล้วและผ่าน; ไม่ได้นับเป็นข้อค้นพบของ SPEC-03 ใน RTM นี้

## 4. แก้แล้ว

| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-002 | เปลี่ยน test ขอบเขตให้ใช้จุดเปลี่ยนวันจริง `17:00:00Z` และ expected เวลา `Asia/Bangkok` แบบค่าคงที่ ไม่คำนวณซ้ำด้วย formatter เดียวกับ component; กรณีที่ spec ไม่ได้บอกยังคงเป็น todo | test `TC-STS-02-1` และ `TC-STS-02-2` ผ่าน; ไม่มีข้อกล่าวหาเดิมเรื่อง expected ซ้ำกับ component แล้ว |
| F-003 | ลบ fallback `ยื่นแล้ว` และ `—` ที่ spec ไม่ได้กำหนดออกจาก `ApplicationStatusDetail` | โค้ดปัจจุบันใช้ค่าจาก `application` โดยตรง และ test AC-STS-02 ผ่าน |
