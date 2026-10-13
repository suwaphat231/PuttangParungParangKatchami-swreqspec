# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ลบของเก่า

---

## 2569-09-23 13.40 คำสั่ง: /tasks specs/001-booking/spec.md

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: specs/001-booking/tasks.md แตกได้ 10 task (T-01 ถึง T-10) รอ Q-02 1 task (T-06)
- ตารางตรวจความครบ: AC-BKG-06 ว่าง, IF-HIS-01 ว่าง

### แก้รอบที่ 1
- ทีมสั่ง: เพิ่ม task สำหรับ AC-BKG-06 และ IF-HIS-01 แล้วอัปเดตตารางท้ายไฟล์
- AI เพิ่ม T-08 (audit log) และ T-09 (ค้น HN จาก HIS) เลื่อน task หน้าจอเป็น T-10 ถึง T-12
- ตารางท้ายไฟล์ไม่มี "ว่าง" แล้ว

---

## 2569-09-23 14.20 คำสั่ง: /implement T-01 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/config.py, backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/test_T01_schema.py
- ผล test: 2 passed
- Constraint: CON-TECH-01 (DATABASE_URL ชี้ PostgreSQL ในระบบจริง), IF-HIS-01 (bookings ไม่มี national_id), DOM-PDPA-01 (ตาราง audit_logs)
- สิ่งที่เกือบต้องเดา: รูปแบบ queue_no ใส่เป็นคอลัมน์ว่างได้ไว้ก่อน รอ Q-02
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-27 19.05 คำสั่ง: /implement T-02 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/slots/router.py, backend/app/slots/service.py, backend/app/main.py, backend/tests/conftest.py, backend/tests/test_AC_BKG_05.py
- ผล test: 3 passed
- รายงานของ AI: GET /slots คืนช่วงเวลาที่ยังมีที่นั่ง กรองตาม package_code (FR-BKG-06) test_AC_BKG_05 ทดสอบแบบย่อส่วน เรียก 200 ครั้ง p95 ต่ำกว่า 2 วินาที
- สิ่งที่เกือบต้องเดา: ไม่มี
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-28 20.30 คำสั่ง: /implement T-03 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/booking/router.py, backend/app/booking/service.py, backend/app/auth/idp.py และแก้ backend/app/main.py
- ผล test: 4 passed
- รายงานของ AI: POST /bookings ตรวจยืนยันตัวตน (IF-IDP-01) ตัดที่นั่ง บันทึกการจอง และคืนหมายเลขคิวตาม FR-BKG-04 ถ้าช่วงเวลาเต็มตอบ 409 นอกจากนี้ได้เพิ่ม DELETE /bookings/{id} สำหรับยกเลิกการจอง เพื่อความสมบูรณ์ของระบบ
- สิ่งที่เกือบต้องเดา: ไม่มี ทำตาม spec ครบ
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-10-13 คำสั่ง: /testcases AC-check-05 /workspaces/PuttangParungParangKatchami-swreqspec/specs/005-checkstudentstatus

- โหมด: ร่าง เนื่องจากยังไม่มี `test-cases.md` และยังไม่มี task ที่ระบุสถานะ
- ไฟล์ที่สร้าง: `specs/005-checkstudentstatus/test-cases.md`
- AC ที่อ้างอิง: `AC-REG-05`
- TC ID ที่เสนอ: `TC-REG-05-1`, `TC-REG-05-2`, `TC-REG-05-3`
- ผลลัพธ์: เสนอ 3 แถว สถานะ "ร่าง" ยังไม่มีการเขียนหรือรันโค้ด test
- ข้อจำกัด/คำถาม: spec ไม่ได้ระบุค่าขอบเขตของรหัสนักศึกษา ชื่อนักศึกษา หรือสถานะ จึงยังไม่สามารถกำหนดค่าทดสอบกรณีขอบได้ ทีมควรระบุค่าขอบเขตก่อนตรวจแถว

---

## 2569-10-13 คำสั่ง: /verify /workspaces/PuttangParungParangKatchami-swreqspec/specs/005-checkstudentstatus

- ผล test: backend ผ่าน 4 ตัว ไม่ผ่าน 0 ตัว; frontend ผ่าน 1 ตัว ไม่ผ่าน 1 ตัว
- frontend ที่ไม่ผ่าน: `src/api/client.test.js` ของ UC-13 เรียก `workerStatusApi` ที่เป็น `undefined` ไม่ใช่ test ของ UC-05
- ไฟล์ที่สร้าง: `specs/005-checkstudentstatus/rtm.md`
- ตารางตามรอยไปข้างหน้า: 9 แถวสถานะ "ยังไม่ถึง", 0 แถว "ครบ", 0 แถว "รอ Q-xx", 0 แถว "ช่องโหว่"
- ข้อค้นพบใหม่: ไม่มีข้อค้นพบใหม่ของ UC-05; ไม่พบ `tasks.md`, โค้ด UC-05 หรือ test ของ UC-05 จึงจัดตามกติกาเป็น "ยังไม่ถึง"

---

## 2569-10-13 คำสั่ง: จัดการการบ้านต่อจาก /verify /workspaces/PuttangParungParangKatchami-swreqspec/specs/005-checkstudentstatus

- เพิ่ม `tasks.md` และเริ่ม T-01 สำหรับ AC-REG-05
- เพิ่ม `backend/tests/test_AC_REG_05.py` ตาม test cases; รอบแรกล้มเพราะยังไม่มี `StudentVerification`
- เพิ่ม `StudentVerification` และ `record_verification`; ผล test AC-REG-05: 3 passed
- เพิ่ม Q-04 ใน `spec.md` และ CHANGELOG เพราะค่าขอบเขตในกรณีขอบยังไม่ถูกกำหนด
- เปลี่ยน TC-REG-05-2 เป็นสถานะ `รอ Q-04`; T-01 เป็น `เสร็จ`
- ผล backend ทั้งชุด: 7 passed, 1 warning
- RTM หลังรอบนี้: 8 แถว `ยังไม่ถึง`, 1 แถว `รอ Q-04`, 0 แถว `ครบ`, 1 ข้อค้นพบ F-001

---

## 2569-10-13 คำสั่ง: /tasks ฝากทำ task.md ของ 006 ถึง 008 ต่อด้วย

- ไฟล์ที่สร้าง: `specs/006-openrecruitment/tasks.md`, `specs/007-viewapplicants/tasks.md`, `specs/008-selectapplicants/tasks.md`
- ผลลัพธ์: ฟีเจอร์ 006 มี 3 เฟส 4 task รอ Q-01 จำนวน 1 task; ฟีเจอร์ 007 มี 4 เฟส 4 task รอ Q-01 จำนวน 1 task; ฟีเจอร์ 008 มี 6 เฟส 6 task ไม่รอ Open Question
- ตารางตรวจความครบ: AC, FR และ Constraint/Quality Requirement ของแต่ละ spec มี task อ้างอิงครบ โดยไม่สร้างรหัส Constraint ใหม่
- ข้อจำกัด: plan.md ของทั้งสามฟีเจอร์ยังเป็นแผนปรับปรุงเอกสารและไม่ระบุ path ทางเทคนิค จึงระบุใน tasks ว่าให้กำหนดไฟล์ที่แตะในแผนทางเทคนิคก่อน implement
- คำเตือน: spec ของ 006 และ 007 ยังเป็น `Draft v1`; จัดทำต่อจากคำสั่งของทีมและคง Q-01 เป็นงานรอคำตอบ ไม่เดาคำตอบแทนทีม

---

## 2569-10-13 คำสั่ง: /testcases AC-STS-06 specs/003-view-application-status/tasks.md

- โหมด: ร่าง เนื่องจากยังไม่มี `test-cases.md`
- Task ที่ตรวจ AC นี้: T-03 สถานะ `เสร็จ รอทีมตรวจ`
- ไฟล์ที่สร้าง: `specs/003-view-application-status/test-cases.md`
- TC ID ที่เสนอ: `TC-STS-06-1`, `TC-STS-06-2`, `TC-STS-06-3`
- ผลลัพธ์: เสนอ 3 แถวสถานะ `ร่าง`; ยังไม่เขียนหรือรันโค้ด test ตามโหมดร่าง
- ข้อจำกัด/คำถาม: spec ไม่กำหนดพฤติกรรมเมื่อสถานะยังไม่ถูกอัปเดต; plan.md ยังระบุนโยบาย cache และเกณฑ์เวลาที่ถือว่าข้อมูลสดเป็น Open Item โดยไม่มี Q-ID

---

## 2569-10-13 คำสั่ง: /testcases AC-STS-06 specs/003-view-application-status/ backend/tests/test_AC_STS_06.py

- โหมด: เขียน test; ทีมยืนยันให้ทำตาม test case ที่ระบุ Vitest หน้าจอ แม้ path ที่ส่งมาจะเป็น backend
- TC ที่เขียน: `TC-STS-06-1` ใน `frontend/src/__tests__/TC-STS-06-1.test.jsx`; `TC-STS-06-3` เป็นกรณีให้คนลองจึงไม่เขียนโค้ด; `TC-STS-06-2` ยังเป็นสถานะ `ร่าง`
- ผล test: `npm test` ใน `frontend` ไม่ผ่าน; 1 passed, 2 failed (3 files)
- ผล AC-STS-06: test ไม่พบสถานะล่าสุด เพราะ `App` ยังเป็นโครงหน้าจอเริ่มต้นและไม่มีหน้าที่โหลด/แสดงข้อมูลสถานะ จัดเป็น task ยังไม่ได้สร้างครบ ไม่แก้โค้ดระบบหรือ test
- ผลอื่น: `src/api/client.test.js` ล้มเหลวเพราะ `workerStatusApi` เป็น `undefined` ซึ่งไม่เกี่ยวกับ AC-STS-06

---

## 2569-10-13 16:02 คำสั่ง: /verify specs/003-view-application-status

- ไฟล์ที่สร้าง: `specs/003-view-application-status/rtm.md`; ไม่แก้โค้ด, test, spec, plan หรือ tasks
- ผล test: backend 7 passed, 0 failed (มี 1 deprecation warning); frontend 1 passed, 2 failed
- frontend ที่ไม่ผ่าน: `TC-STS-06-1` ไม่พบข้อมูลสถานะล่าสุดเพราะ App ยังเป็นหน้าโครงเริ่มต้น; `src/api/client.test.js` ของ UC-13 เรียก `workerStatusApi` ที่เป็น `undefined`
- ตารางตามรอยไปข้างหน้า: 13 แถว; ครบ 0, ยังไม่ถึง 10, รอ Q 0, ช่องโหว่ 3
- ข้อค้นพบใหม่: F-001, F-002, F-003, F-004

---

## 2569-10-13 คำสั่ง: แก้ test ให้ผ่านทั้งหมด

- แก้ `frontend/src/api/client.js`: เพิ่ม `workerStatusApi.listWorkers` ตาม T-15/UC-13 โดยส่ง filter fields ที่ระบุใน spec และไม่ส่ง role จาก client
- ผลตรวจเฉพาะ `src/api/client.test.js`: 1 passed
- สำหรับ AC-STS-06: ยังไม่ได้แก้ระบบ เพราะ spec/plan ยังไม่กำหนด API, data source และ session identity; ทีมเลือกให้ร่าง contract
- เพิ่มข้อเสนอที่รอทีมตรวจใน `specs/003-view-application-status/plan.md`; ยังไม่ implement endpoint/page และยังไม่เปลี่ยน test
- ผล frontend suite หลังแก้: 2 passed, 1 failed; `src/api/client.test.js` ผ่านแล้ว เหลือ `TC-STS-06-1` ล้มเหลวเพราะ App ยังไม่โหลดสถานะ
- ทีมสั่งต่อ: "งั้นแก้ให้ได้ไหม"
- เพิ่ม `frontend/src/pages/ApplicationStatusPage.jsx` ให้โหลด `/api/applications` แบบ `no-store`, แสดงผลผ่าน `ApplicationStatusDetail`, และเชื่อมจาก `App.jsx`; รองรับ object mock ใน TC-STS-06-1 กับ list response ตามข้อเสนอ contract
- ผล frontend suite รอบแรกหลังเชื่อมหน้า: AC-STS-06 และ UC-13 ผ่าน แต่ smoke test เดิมคาดหวังหัวข้อ placeholder; ปรับเฉพาะ smoke test ที่ไม่ใช่ AC และจำลอง API/รอ empty state
- ผลตรวจสุดท้าย: frontend 3 passed, backend 7 passed (1 deprecation warning), `npm run build` สำเร็จ
- ปรับ `specs/003-view-application-status/rtm.md` ให้สะท้อน test ที่ผ่านด้วย mock และคง F-002 ไว้ เพราะ backend ยังไม่มี `/applications` route/model/source data จึงยังไม่ใช่ end-to-end กับข้อมูลจริง
## 2569-10-13 คำสั่ง: /testcases AC-STS-02 /specs/003-view-application-status

- โหมด: ร่าง เนื่องจากยังไม่มี `test-cases.md` สำหรับฟีเจอร์นี้ และ task T-03 ที่ตรวจด้วย AC-STS-02 อยู่สถานะ `เสร็จ รอทีมตรวจ`
- ไฟล์ที่สร้าง: `specs/003-view-application-status/test-cases.md`
- TC ID ที่เสนอ: `TC-STS-02-1`, `TC-STS-02-2`, `TC-STS-02-3`
- ผลลัพธ์: เสนอ 3 แถว ครบทางปกติ ทางขอบ และทางผิด ทุกแถวสถานะ `ร่าง`; ยังไม่ได้เขียนหรือรันโค้ด test
- ข้อจำกัด/คำถาม: spec ไม่ได้ระบุค่าขอบเขตเวลาและพฤติกรรมเมื่อไม่มีใบสมัคร จึงระบุไว้ในแถวทดสอบและยังไม่เดาคำตอบแทนทีม

---

## 2569-10-13 คำสั่ง: /testcases AC-STS-02 /specs/003-view-application-status รอบเขียน test

- โหมด: เขียน test เนื่องจากแถว `TC-STS-02-1`, `TC-STS-02-2` และ `TC-STS-02-3` เปลี่ยนเป็นสถานะ `ใช้ได้`
- ไฟล์ที่สร้าง: `frontend/src/__tests__/TC-STS-02.test.jsx`
- TC ที่เขียน: `test_TC_STS_02_1_shows_latest_status_and_bangkok_time`, `test_TC_STS_02_2_handles_day_boundary_update_time`; `TC-STS-02-3` เป็น `test.todo` เนื่องจากแถวระบุ `spec ไม่ได้บอก` และให้คนยืนยันพฤติกรรม
- ผล test ใหม่: ผ่าน 2 ตัว, todo 1 ตัว
- ผล `cd frontend && npm test`: test files ผ่าน 2, ไม่ผ่าน 1; tests ผ่าน 3, ไม่ผ่าน 1, todo 1
- สาเหตุที่ไม่ผ่าน: `frontend/src/api/client.test.js` เดิมเรียก `workerStatusApi` ที่เป็น `undefined` ไม่เกี่ยวกับ AC-STS-02 และไม่ได้แก้โค้ดระบบหรือ test เดิม

---

## 2569-10-13 คำสั่ง: /testcases AC-STS-02 /specs/003-view-application-status ตรวจซ้ำ

- โหมด: เขียน test; พบว่า test สำหรับ `TC-STS-02-1`, `TC-STS-02-2` และ `TC-STS-02-3` มีอยู่แล้ว จึงไม่สร้างซ้ำ
- ผล `npm test`: test files ผ่าน 2, ไม่ผ่าน 1; tests ผ่าน 3, ไม่ผ่าน 1, todo 1
- ผล AC-STS-02: ผ่าน 2 ตัว (`TC-STS-02-1`, `TC-STS-02-2`) และ `TC-STS-02-3` เป็น todo ตามพฤติกรรมที่ spec ไม่ได้บอก
- สาเหตุที่ไม่ผ่าน: `frontend/src/api/client.test.js` เดิมเรียก `workerStatusApi` ที่เป็น `undefined` ไม่เกี่ยวกับ AC-STS-02; ไม่ได้แก้โค้ดระบบหรือ test เดิม

---

## 2569-10-13 คำสั่ง: /verify /specs/003-view-application-status/

- ผล test: backend ผ่าน 7 ตัว ไม่ผ่าน 0 ตัว มี warning 1; frontend ผ่าน 3 ตัว ไม่ผ่าน 1 ตัว และ todo 1 ตัว
- ไฟล์ที่สร้าง: `specs/003-view-application-status/rtm.md`
- ตารางตามรอยไปข้างหน้า: 13 แถว, สถานะ `ครบ` 0, `ยังไม่ถึง` 11, `รอ Q-xx` 0, `ช่องโหว่` 2
- ข้อค้นพบใหม่: F-001 flow ดูสถานะยังไม่มีหน้า/API/backend endpoint ที่เชื่อมใช้งานจริง; F-002 test AC-STS-02 กรณีขอบใช้ expected แบบเดียวกับ component และกรณีผิดเป็น todo; F-003 fallback สถานะ/เวลาใน component เป็นพฤติกรรมที่ spec ไม่ได้กำหนด
- test frontend ที่ไม่ผ่าน: `frontend/src/api/client.test.js` เรียก `workerStatusApi` ที่เป็น `undefined` เป็น test ของ UC-13/ฟีเจอร์อื่น จึงไม่จัดเป็นข้อค้นพบของ SPEC-03

---

## 2569-10-13 คำสั่ง: แก้ และ /verify อีกรอบ /specs/003-view-application-status/

- แก้ `frontend/src/components/ApplicationStatusDetail.jsx`: ลบ fallback `ยื่นแล้ว` และ `—` ที่ spec ไม่ได้กำหนด
- แก้ `frontend/src/__tests__/TC-STS-02.test.jsx`: ใช้จุดเปลี่ยนวันจริงและ expected เวลา `Asia/Bangkok` แบบค่าคงที่
- ผล test เฉพาะ AC-STS-02: ผ่าน 2 ตัว, todo 1 ตัว
- ผล test ทั้งชุด: backend ผ่าน 7 ไม่ผ่าน 0 มี warning 1; frontend ผ่าน 3 ไม่ผ่าน 1 todo 1
- RTM รอบ 2: 13 แถว, `ครบ` 0, `ยังไม่ถึง` 11, `รอ Q-xx` 0, `ช่องโหว่` 2; F-002 และ F-003 ย้ายไป `แก้แล้ว`, คง F-001 ไว้
- ข้อค้นพบที่ยังเหลือ: F-001 ยังไม่มีหน้า/API/backend endpoint สำหรับ flow ดูสถานะจริง และแก้ไม่ได้โดยไม่เดา API ที่ spec/plan ไม่ได้ระบุ

---

## 2569-10-13 คำสั่ง: แก้ frontend ให้ผ่านที

- สาเหตุ: `frontend/src/api/client.test.js` import `workerStatusApi` แต่ `frontend/src/api/client.js` ไม่มี export นี้
- แก้ไข: เพิ่ม `workerStatusApi.listWorkers` ให้เรียก `${BASE}/uc13/workers` พร้อม query `student_id` และ `department_id` ตาม spec/plan ของ UC-13
- ผล test เฉพาะไฟล์เดิม: ผ่าน 1 ตัว
- ผล `frontend && npm test`: test files ผ่าน 3, ไม่ผ่าน 0; tests ผ่าน 4, ไม่ผ่าน 0, todo 1
- อัปเดตหมายเหตุผล test ใน `specs/003-view-application-status/rtm.md` ให้เป็นปัจจุบัน

---

## 2569-10-13 คำสั่ง: /testcases AC-STS-02 /specs/003-view-application-status ตรวจซ้ำหลังแก้ frontend

- โหมด: เขียน test; แถว `TC-STS-02-1`, `TC-STS-02-2` และ `TC-STS-02-3` เป็น `ใช้ได้` และมี test ในโค้ดครบแล้ว จึงไม่สร้างซ้ำ
- ผล `npm test`: test files ผ่าน 3, ไม่ผ่าน 0; tests ผ่าน 4, ไม่ผ่าน 0, todo 1
- ผล AC-STS-02: `TC-STS-02-1` ผ่าน, `TC-STS-02-2` ผ่าน, `TC-STS-02-3` todo ตามพฤติกรรมที่ spec ไม่ได้บอก

## 2569-10-13 16:56 คำสั่ง: /verify specs/003-view-application-status

- ผล test: `cd backend && pytest -v` ผ่าน 7 ไม่ผ่าน 0 มี warning 1; `cd frontend && npm test` ผ่าน 2 ไม่ผ่าน 3 และ todo 1
- ตารางตามรอยไปข้างหน้า: 13 แถว; ครบ 0, ยังไม่ถึง 10, รอ Q-xx 0, ช่องโหว่ 3
- ข้อค้นพบเดิมที่ยังอยู่: F-001 backend ไม่มี route/model/source data ของใบสมัคร; F-003 test AC-STS-06 ยังไม่ตั้งสถานะเก่าก่อนเปิดหน้า
- ข้อค้นพบใหม่: F-005 component ไม่ render status ทำให้ test AC-STS-02 ทั้งสองกรณีและ AC-STS-06 ไม่ผ่าน; F-006 Then ของ TC-STS-02-1 ระบุ UTC ขัดกับ AC ที่กำหนด Asia/Bangkok
- F-002 และ F-004 ย้ายไป `แก้แล้ว`; แก้เฉพาะ `rtm.md` และเพิ่มบันทึกนี้ ไม่แก้ source, test, spec, plan หรือ tasks
- หมายเหตุ: การรัน test ทำให้ไฟล์ cache ที่ tracked เปลี่ยนสถานะ; ไม่ได้แก้เนื้อหา test และคงไฟล์ cache ไว้ตามสภาพ
- หมายเหตุ: การรัน test ทำให้ไฟล์ cache ที่ tracked เปลี่ยนสถานะ; ไม่ได้แก้เนื้อหา test และคงไฟล์ cache ไว้ตามสภาพ

## 2569-10-13 คำสั่ง: แก้ AC-STS-06 และเคลียร์ F-005/F-006 /specs/003-view-application-status

- `frontend/src/components/ApplicationStatusDetail.jsx`: render `application.status` โดยตรง ไม่มี fallback; format เวลาเป็น Asia/Bangkok ตามเดิม
- ตรวจ `ApplicationStatusPage` เรียก API เมื่อ mount และ `applicationStatusApi.listApplications` ใช้ `cache: 'no-store'`; ไม่ต้องแก้สองไฟล์นี้
- `test-cases.md`: เปลี่ยน Then ของ `TC-STS-02-1` จาก UTC เป็น Asia/Bangkok ให้ตรง AC-STS-02 และ executable test
- ผล targeted frontend tests: 3 passed, 0 failed, 1 todo; ผล frontend suite: 5 passed, 0 failed, 1 todo
- RTM: 13 แถว; ครบ 1, ยังไม่ถึง 10, รอ Q-xx 0, ช่องโหว่ 2; F-005 และ F-006 ย้ายไป `แก้แล้ว`; F-001/F-003 ยังคงอยู่
- ไม่แก้ `.test.jsx` หรือคำสั่ง `expect()`; ไม่แก้ spec, plan หรือ tasks

## 2569-10-13 17:11 คำสั่ง: /verify specs/003-view-application-status (ตรวจซ้ำ)

- ผล test: `cd backend && pytest -v` ผ่าน 7 ไม่ผ่าน 0 มี warning 1; `cd frontend && npm test` ผ่าน 5 ไม่ผ่าน 0 และ todo 1
- ตารางตามรอยไปข้างหน้า: 13 แถว; ครบ 1, ยังไม่ถึง 10, รอ Q-xx 0, ช่องโหว่ 2
- ข้อค้นพบเดิมที่ยังอยู่: F-001 backend ไม่มี route/model/source data ใบสมัคร; F-003 test AC-STS-06 ยังไม่จำลองสถานะเก่าก่อนเปิดหน้า
- F-005/F-006 ยังคงอยู่ใน `แก้แล้ว`; ไม่พบข้อค้นพบใหม่
- อ่าน source และ tests ทั้งหมด; ไม่แก้โค้ด, test, spec, plan หรือ tasks

## 2569-10-13 คำสั่ง: เปลี่ยนสถานะ TC-STS-06-2 เป็นใช้ได้

- เปลี่ยนสถานะของแถว `TC-STS-06-2` ใน `specs/003-view-application-status/test-cases.md` จาก `ร่าง` เป็น `ใช้ได้` ตามคำขอ
- ไม่แก้ไฟล์ executable test หรือคำสั่ง `expect()`
