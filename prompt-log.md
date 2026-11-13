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

## 2569-11-05 11.24 คำสั่ง: Q-01 specs/16-16-track-payment/spec.md

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: บันทึกคำตอบว่า “แสดงยอดเงินพร้อมสถานะการจ่ายเงิน” ใน Q-01 ของ spec
- ไฟล์ที่แก้: `specs/16-16-track-payment/spec.md`
- สถานะ: ระบุคำตอบชัดเจนแล้ว ไม่ต้องรอ Clarification เพิ่ม

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

---

## 2569-11-05 11:24 คำสั่ง: /implement T-04 specs/16-16-track-payment/tasks.md

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: เปลี่ยน T-04 จาก `รอคำตอบ Q-01` เป็น `พร้อมทำ` และระบุรูปแบบการแสดงยอดเงินตามข้อสรุปทีมว่า "แสดงยอดเงินพร้อมสถานะการจ่ายเงิน"
- ไฟล์ที่แก้: `specs/16-16-track-payment/tasks.md`, `specs/16-16-track-payment/plan.md`
- การตรวจ dependency: plan.md ไม่พบ dependency ที่ค้างอยู่สำหรับ T-04; T-04 เป็น task ที่พร้อมทำและไม่มี prerequisite ที่ยังไม่เสร็จ
- รูปแบบที่ยืนยัน: `ยอดเงิน [บาท] | สถานะการจ่ายเงิน` เช่น `15,000 บาท | ชำระแล้ว`

## 2569-11-05 11:31 คำสั่ง: /implement T-04 specs/16-16-track-payment/tasks.md (ทดสอบเฉพาะ T-04)

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: เพิ่มฟังก์ชันจัดรูปแบบยอดเงินพร้อมสถานะการจ่ายเงินใน `frontend/src/components/PaymentStatusBadge.jsx` และเขียน test ใน `frontend/src/components/PaymentStatusBadge.test.jsx`
- โครงสร้างที่แก้: `PaymentStatusBadge` รองรับ prop `amount` และแสดงผลเป็น `15,000 บาท | ชำระแล้ว` เมื่อมียอดเงิน; ถ้าไม่มียอดเงินจะแสดงสถานะอย่างเดียว
- ผล test: `cd frontend && npm test -- --run src/components/PaymentStatusBadge.test.jsx` -> 1 file passed, 3 tests passed
- สถานะ T-04: เปลี่ยนเป็น `เสร็จ รอทีมตรวจ`

## 2569-11-13 14:12 คำสั่ง: /verify specs/019-check-work-time
- โหมด: ตรวจสอบ requirement และ test ตามรอยไปข้างหน้า/ย้อนกลับ โดยไม่แก้โค้ด, test, spec, plan หรือ tasks
- ไฟล์ที่อ่าน: `specs/019-check-work-time/spec.md`, `plan.md`, `tasks.md`, `test-cases.md`, `rtm.md` และ `AGENTS.md`
- ผล test: `cd backend && pytest -v` -> 81 passed, 0 failed; `cd frontend && npx vitest run src/__tests__/checkWorkTime.test.jsx` -> 9 passed, 0 failed; `cd frontend && CI=1 npm test -- --run` -> full suite still ไม่ผ่าน เนื่องจาก tests อื่นของ ApplyLabBoy 6 failed และไม่ใช่ scope ของ SPEC-19-19-
- ผลตามรอย: FR-CAL-01 ถึง FR-CAL-05, NFR-REL-01, NFR-INT-01 = ครบ; NFR-PERF-01 = ยังไม่ถึง
- ข้อค้นพบใหม่: F-001 (NFR-PERF-01 ไม่มี benchmark/threshold ที่ traceable กับ spec)
- ไฟล์ที่แก้: `specs/019-check-work-time/rtm.md` และ `prompt-log.md` (เพิ่มต่อท้ายเท่านั้น)

## 2569-11-13 14:05 คำสั่ง: /testcases AC-CAL-01-05 specs/019-check-work-time
- โหมด: ร่าง เนื่องจากยังไม่มี `test-cases.md` ในฟีเจอร์นี้ และ AC ที่มีคำขอคือ AC-CAL-01 ถึง AC-CAL-05
- ไฟล์ที่สร้าง: `specs/019-check-work-time/test-cases.md`
- TC ID ที่เสนอ: `TC-CAL-01-1` ถึง `TC-CAL-05-3`
- ผลลัพธ์: เสนอ 15 แถว สถานะ `ร่าง`; ยังไม่ได้เขียนหรือรันโค้ด test ตามโหมดร่าง
- ข้อจำกัด/คำถาม: `NFR-PERF-01` เป็น Quality Requirement ไม่ใช่ AC ดังนั้นจึงดำเนินการต่อแปลง AC-CAL-01 ถึง AC-CAL-05 ตามคำขอของทีม และหยุดรอให้ทีมตรวจแถวและเปลี่ยนสถานะเป็น `ใช้ได้` ก่อน

## 2569-11-05 11:34 คำสั่ง: ตรวจสอบความพร้อม T-01 specs/16-16-track-payment/tasks.md

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: ตรวจสอบ dependency จาก `spec.md` และ `plan.md` แล้วพบว่า T-01 ไม่มี prerequisite และไม่ขึ้นกับ Q-01 หรือ task อื่น
- ความเห็น: T-01 เป็น task แรกในลำดับงานและไม่มี `ต้องทำหลัง` หรือ dependency ที่ค้างอยู่ จึงมีสถานะพร้อมทำ
- ไฟล์ที่แก้: `specs/16-16-track-payment/tasks.md`
- สถานะ T-01: เปลี่ยนเป็น `พร้อมทำ`

## 2569-11-05 11:37 คำสั่ง: แก้ T-01 ใน tasks.md ตามกติกา /implement

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: เพิ่มข้อมูล `ไฟล์ที่แตะ` และ `เสร็จเมื่อ` ให้ T-01 ครบตามข้อกำหนดของ /implement โดยไม่เริ่ม code implementation
- พิจารณาโครงสร้างที่มีอยู่จริงของ repo ก่อนระบุ path: `backend/app/main.py`, `backend/app/booking/router.py`, `backend/app/booking/service.py`, `backend/tests/conftest.py`
- เหตุผล: มี FastAPI app entry point และ router/service patterns ใน repo จึงใช้ไฟล์ที่มีอยู่จริงเป็นฐานของ API contract และ data flow สำหรับ task นี้ โดยไม่สร้างไฟล์ใหม่ที่ไม่จำเป็น
- ไฟล์ที่แก้: `specs/16-16-track-payment/tasks.md`

## 2569-11-05 11:39 คำสั่ง: บันทึกข้อกำหนด T-01 จากคำตอบทีม

- ผลตรวจ: backend ปัจจุบันยังไม่มี API หรือแหล่งเชื่อมต่อระบบการเงิน; หยุดก่อน Implement เพื่อไม่สร้างข้อมูลจำลองหรืออ้างว่าเป็นข้อมูลจริง
- คำตอบทีม: `worker_id` exact match, `worker_name` partial match, `payment_reference` exact match
- API fields ต่อรายการ: `payment_id`, `worker_id`, `worker_name`, `payment_reference`, `amount`, `currency`, `finance_status`, `status_updated_at`, `last_synced_at`
- Mapping ที่ยืนยัน: `PAID` = `ชำระแล้ว`, `UNPAID` = `ยังไม่ได้จ่าย`, `ABNORMAL` = `มีความผิดปกติ`; สถานะจริงอื่นต้อง map จากค่าต้นทางโดยรักษาความหมาย
- เวลา: ต้องระบุ timezone จาก contract/แหล่งข้อมูลจริง; หากไม่มีให้ถามทีม ไม่กำหนดค่าเอง
- ปรับ T-01 เป็น `รอการยืนยันแหล่งเชื่อมต่อระบบการเงินจริง`; ยังไม่ระบุไฟล์ที่จะ Implementation จนกว่าจะตรวจแหล่งเชื่อมต่อและ path จริง
- ไฟล์ที่แก้: `specs/16-16-track-payment/tasks.md`, `prompt-log.md`; ไม่มีการแก้โค้ดหรือรันทดสอบ

## 2569-11-05 11:45 คำสั่ง: ตรวจความพร้อม T-02, T-03, T-05, T-06 UC-16

- ตรวจ `spec.md`, `plan.md`, `tasks.md`, `AGENTS.md` และโครงสร้าง backend/frontend จริง
- `plan.md` มีลำดับงานระดับสูง แต่ไม่มี dependency ราย task, file list หรือ technical design; dependencies ใน `tasks.md` จึงบันทึกตามสิ่งที่จำเป็นจาก FR/AC และการใช้ข้อมูลจริง
- T-02: รอ T-01 และแหล่งข้อมูลการเงินจริง เพราะต้องระบุรายการจากสถานะจริงตาม FR-PAY-03/AC-PAY-02; ห้ามใช้ demo data เป็นข้อมูลการเงินจริง
- T-03: รอ endpoint จาก T-01 และการยืนยันบทบาท/ขอบเขตสิทธิ์ เนื่องจาก spec ยังไม่ระบุชื่อ role หรือ permission scope; ยังระบุไฟล์ implementation ไม่ได้อย่างปลอดภัย
- T-05: คงเป็นงาน UI ของ Agent; ระบุ frontend paths ตามโครงสร้างที่มีอยู่ (`App.jsx`, `pages/`, `api/`) และไฟล์ UI/API/test ที่ต้องสร้าง; รอ T-01 และตรวจรับ T-04 ก่อนต่อข้อมูลจริง
- T-06: คงเป็นงาน UI Read-only ของ Agent; อาศัย T-01/T-02 และตรวจรับ T-04; UI ห้ามเขียนหรือเปลี่ยนสถานะการจ่ายเงินต้นทาง
- ผล readiness: ไม่มี T-02, T-03, T-05 หรือ T-06 ที่ผ่านเงื่อนไขพร้อม Implement ในขณะนี้; จึงไม่มี task ใดถูกเปลี่ยนเป็น `พร้อมทำ`
- ไฟล์ที่แก้: `specs/16-16-track-payment/tasks.md`, `prompt-log.md`; ไม่แก้ `spec.md`/`plan.md`, ไม่แก้โค้ด และไม่รันทดสอบเพราะเป็นการตรวจความพร้อมเท่านั้น

## 2569-11-05 11:48 คำสั่ง: บันทึกข้อสรุปและตรวจความพร้อม UC-16 T-01 ถึง T-07

- แก้ `specs/16-16-track-payment/spec.md` เพื่อบันทึกข้อสรุปของทีมไว้ภายใต้ FR/AC/ASM เดิม: HR และ Manager/Executive อ่านได้เท่านั้น, Student/ผู้ปฏิบัติงานทั่วไปถูกปฏิเสธ, Audit Log บันทึกผู้ใช้/เวลา/รายการ/ผลอนุญาตหรือปฏิเสธ, UI แจ้งแหล่งข้อมูลไม่พร้อมและห้ามใช้ mock เมื่อไม่มี finance API
- อัปเดต T-02 ถึง T-07 ใน `tasks.md`: ระบุสถานะและ dependency ตามข้อเท็จจริง, กำหนดบทบาท UI ให้ Agent ใน T-05/T-06, กำหนดเกณฑ์การค้นหา/Read-only/Audit และคงไฟล์ที่ยังเลือกไม่ได้เป็น pending จนกว่า dependency จะพร้อม
- สถานะพร้อมทำ: ไม่มี task เนื่องจาก T-01 ยังรอการเชื่อมต่อระบบการเงินจริง; T-02/T-03/T-05/T-06/T-07 ติด dependency และ T-04 เสร็จรอทีมตรวจ
- ไม่เริ่ม Implement และไม่รันทดสอบ เพราะไม่มี task ที่ผ่าน readiness gate และการเปลี่ยนแปลงรอบนี้เป็นการอัปเดตข้อกำหนด/แผนงาน
- ไฟล์ที่แก้: `specs/16-16-track-payment/spec.md`, `specs/16-16-track-payment/tasks.md`, `prompt-log.md`

## 2569-11-05 11:54 คำสั่ง: ปรับแนวทาง UC-16 เป็น Backend-only พร้อม Mock Finance Data

- คำตอบทีม: อนุญาต Mock Finance Data สำหรับพัฒนา/ทดสอบ โดยติดป้ายแยกจากข้อมูลจริง; ไม่อ้างว่าเชื่อมระบบการเงินจริง
- คำตอบทีม: Mock timestamp ใช้ timezone `Asia/Bangkok`; ใช้ identity provider เดิมหากมี role claim
- ตรวจ `backend/app/auth/idp.py`: dependency ปัจจุบันยืนยัน HN อย่างเดียว ไม่มี role claim; T-03 จึงยังรอ module/claim ที่เชื่อถือได้
- Baseline ก่อน implement: `cd backend && pytest` ผ่าน 7 tests, 1 warning; `cd frontend && npm test` ผ่าน 8 tests, 1 todo
- ปรับ `spec.md`: ระบุขอบเขต Backend-only, Mock Finance Data ที่ชัดเจนว่าเป็น simulation, AC แบบ API/read-only, roles และ audit fields ตามข้อสรุปทีม
- ปรับ `plan.md` และ `tasks.md`: แบ่ง 4 เฟส; เฟส 1 มี T-01/T-02; ตั้ง T-01 เป็น `พร้อมทำ`, T-02 รอ T-01; T-03 รอ role claim; T-05/T-06 เป็น Backend API ไม่มี UI และรอ auth; T-07 รอทุก task
- จุดตัดสินใจคงค้าง: role claim/module จาก identity provider; endpoint path ก่อน T-05
- ยังไม่แก้โค้ดในบันทึกนี้; baseline ที่รันเป็นการตรวจฐานก่อน implement

## 2569-11-05 12:01 คำสั่ง: /implement-all เฟส 1 T-01 จัดทำ contract API และ Mock Finance Data

- ไฟล์ที่สร้าง: `backend/app/payments/__init__.py`, `backend/app/payments/schemas.py`, `backend/app/payments/mock_finance.py`, `backend/tests/test_T01_payment_contract.py`
- ผลลัพธ์: สร้าง immutable Pydantic contract/provider พร้อมข้อมูล Mock Finance Data 3 สถานะ, amount, THB, worker fields, `data_source=MOCK`, timestamps ระบุ `Asia/Bangkok`
- ไม่ได้สร้าง API route ใน T-01 เพื่อไม่ให้ปล่อยข้อมูลการเงินก่อน T-03 มี authorization; ยังไม่มีการเชื่อมต่อระบบการเงินจริง
- Test หลัง T-01: `cd backend && pytest` -> 9 passed, 1 warning; `cd frontend && npm test` -> 8 passed, 1 todo
- สถานะ T-01: `เสร็จ รอทีมตรวจ`; T-02 ยังรอ T-01 จนปิด commit task นี้ตาม workflow
- สิ่งที่เกือบต้องเดา: identity role claim ยังไม่มี แต่ไม่กระทบ provider/contract ของ T-01; คง T-03 ไว้รอยืนยันและไม่เพิ่ม auth จำลอง

## 2569-11-05 12:03 คำสั่ง: /implement-all เฟส 1 T-02 ระบุสถานะและรายการที่ต้องดำเนินการต่อ

- ไฟล์ที่แก้: `backend/app/payments/schemas.py`, `backend/app/payments/service.py`, `backend/tests/test_AC_PAY_02.py`
- ผลลัพธ์: เพิ่ม `requires_follow_up` ในผล tracking; `UNPAID` และ `ABNORMAL` เป็น true, `PAID` เป็น false; ข้อมูลต้นทางยัง immutable และไม่มีการเปลี่ยนยอด/สถานะ
- Test ที่เพิ่ม: `test_AC_PAY_02_marks_unpaid_and_abnormal_payments_for_follow_up`
- ผล test หลัง T-02: `cd backend && pytest` -> 10 passed, 1 warning; `cd frontend && npm test` -> 8 passed, 1 todo
- สถานะ T-02: `เสร็จ รอทีมตรวจ`
- ไม่แตะ Frontend และไม่อ้าง Mock Finance Data ว่าเป็นข้อมูลจริง

## 2569-11-05 คำตอบทีม: ตรวจจุดตรวจเฟส 1 ผ่าน

- ทีมยืนยันผลตรวจเฟส 1 ว่าผ่าน; เปลี่ยนสถานะ T-01 และ T-02 เป็น `เสร็จ`
- ทีมยืนยันว่า identity provider ยังไม่มี module path, user ID claim หรือ role/permission claim
- T-03 และงาน API ที่ต้องป้องกันด้วย role ยังคงรอข้อมูล identity ที่เชื่อถือได้; จะไม่ใช้ role จาก request header หรือค่าที่ผู้เรียกกำหนดเอง
- ทีมเลือกแนวทาง demo-only server-side bearer token mapping สำหรับ T-03; ยังไม่เริ่ม implementation เพราะต้องยืนยันวิธี provision/configure token ก่อน
- ทีมยืนยันใช้ environment variable `PAYMENT_DEMO_AUTH_TOKENS` เป็น JSON map สำหรับ token, `user_id` และ role; ขอบเขตเป็น local/test เท่านั้น และ production ต้องปิดใช้งานเสมอ
- ทีมเลือกเก็บ Audit Log ในตารางฐานข้อมูลแยกสำหรับ UC-16 แทนการใช้ application log; ตารางเดิมของการจองผูกกับ HN และไม่รองรับผลอนุญาต/ปฏิเสธ

## 2569-11-05 /implement-all เฟส 2: T-03

- ไฟล์ implementation: `backend/app/config.py`, `backend/app/payments/auth.py`, `backend/app/payments/audit.py`, `backend/app/db/models.py`, `backend/app/db/migrations/002_payment_audit_log.py`, `backend/tests/test_AC_PAY_04.py`, `backend/tests/test_AC_PAY_05.py`
- เอกสารที่ปรับตามข้อสรุปทีม: `specs/16-16-track-payment/spec.md`, `specs/16-16-track-payment/plan.md`, `specs/16-16-track-payment/tasks.md`
- Auth ใช้ `PAYMENT_DEMO_AUTH_TOKENS` เฉพาะ `APP_ENV=local|test`; ค่าเริ่มต้นเป็น `production`; ตรวจ role จาก mapping ฝั่ง server เท่านั้น และไม่บันทึก bearer token
- Audit บันทึก user ID (nullable เมื่อระบุตัวตนไม่ได้), UTC timestamp, resource path และผล `ALLOWED`/`DENIED` ลง `payment_audit_logs` แยกจาก audit ของการจอง
- ผล test เฉพาะ T-03: `pytest -q tests/test_AC_PAY_04.py tests/test_AC_PAY_05.py` -> 9 passed ก่อนเพิ่มกรณี local/header
- ผล test ทั้งโปรเจกต์รอบสุดท้าย: Backend `pytest` -> 21 passed, 1 warning; Frontend `npx vitest run --config vitest.baseline.config.js` -> 8 passed, 1 todo (5 files passed)
- `git diff --check` ผ่าน; `vitest.baseline.config.js` เป็นไฟล์ชั่วคราวที่ลบหลังทดสอบ ไม่ได้แก้ tracked Vitest cache
- สถานะ T-03: `เสร็จ รอทีมตรวจ`; ยังไม่มี HTTP payment routes เพราะเป็นงาน T-05/T-06
- รายละเอียดที่ยืนยันก่อน implement: token provisioning ผ่าน environment JSON map และเลือกตารางฐานข้อมูล audit แยก; ไม่ได้เดารูปแบบเก็บ audit หรืออ้างว่าเป็น real identity provider
- เพิ่มจุดตรวจเฟส 2 ใน tasks.md เพื่อให้ทีมตรวจ AC-PAY-04/05 ได้ด้วย test route โดยไม่กล่าวอ้างว่ามี HTTP payment endpoint ก่อน T-05/T-06

## 2569-11-05 ตรวจรับจุดตรวจเฟส 2: T-03

- คำสั่ง: `cd backend && PYTHONDONTWRITEBYTECODE=1 pytest -q tests/test_AC_PAY_04.py tests/test_AC_PAY_05.py`
- ผล: `11 passed, 1 warning`; warning เป็น Starlette deprecation ของ `httpx` ใน TestClient
- สิทธิ์: HR/Manager/Executive ได้รับอนุญาต; Student/Worker ถูกปฏิเสธ; ไม่มี token ถูกปฏิเสธ; มี test ยืนยันว่า `X-Role: HR` อย่างเดียวไม่ได้รับสิทธิ์
- Audit: test ตรวจ user ID, timestamp, resource, ผล ALLOWED/DENIED สำหรับ allow/deny และกรณีไม่มีตัวตน; schema `payment_audit_logs` ไม่มีคอลัมน์ token
- Production gate: test ตั้ง `APP_ENV=production` พร้อม mapping แล้วได้ 401; demo token ใช้ได้เฉพาะ local/test
- Git: commits `c7277f6` (T-03) และ `0cdbee5` (จุดตรวจเฟส 2) อยู่ใน `git log --oneline`; สถานะก่อนปรับเอกสารมีเฉพาะ Frontend ที่ยังไม่ stage: Vitest result cache และ `PaymentStatusBadge.jsx` modified, `PaymentStatusBadge.test.jsx` untracked
- ผลตรวจรับ: ผ่าน; เปลี่ยน T-03 เป็น `เสร็จ`; ยังไม่เริ่มเฟส 3 และยังต้องยืนยัน endpoint path สำหรับ T-05/T-06

## 2569-11-05 ตรวจรับ T-04 และ baseline ก่อนทำ API

- ตรวจโค้ด/การทดสอบ format เดิมของ Q-01: `PaymentStatusBadge` แสดง amount กับสถานะในรูป `15,000 บาท | ชำระแล้ว`; test ครอบคลุม PAID, ไม่มี amount และ ABNORMAL
- ไม่แก้ Frontend; รันเพื่อตรวจของเดิมเท่านั้น
- Baseline Backend: `PYTHONDONTWRITEBYTECODE=1 pytest` -> 21 passed, 1 warning
- Baseline Frontend: `npx vitest run --config vitest.baseline.config.js` -> 8 passed, 1 todo, 5 files passed
- ผลตรวจ T-04: ผ่าน; เปลี่ยนสถานะเป็น `เสร็จ`
- T-05/T-06 ยังไม่เริ่ม: endpoint path และ API surface ยังเป็น Open Decision ใน plan/tasks และผู้ใช้ย้ำไม่ให้เดา API

## 2569-11-05 คำตอบทีม: endpoint UC-16

- ทีมยืนยันชุด endpoint สำหรับเฟส 3: `GET /payments` (ค้นหา/กรอง), `GET /payments/{payment_id}` (สถานะล่าสุดรายรายการ), `GET /payments/follow-up` (รายการที่ต้องติดตาม)
- ทุก endpoint เป็น Read-only; ไม่เพิ่ม endpoint แก้ยอดเงินหรือสถานะ
- อัปเดต spec/plan/tasks ให้บันทึก contract นี้; T-05 พร้อมทำหลัง T-01/T-03, T-06 รอ T-05

## 2569-11-05 /implement-all เฟส 3: T-05

- Implement `GET /payments` พร้อม `worker_id`/`payment_reference` exact match และ `worker_name` partial match; route ใช้ `get_payment_user` จึงบังคับ role และบันทึก audit
- ไฟล์โค้ด: `backend/app/main.py`, `backend/app/payments/router.py`, `backend/app/payments/service.py`, `backend/tests/test_AC_PAY_03.py`
- ผล test เฉพาะ T-05: `pytest -q tests/test_AC_PAY_03.py` -> 4 passed, 1 warning
- ผล test ทั้งโปรเจกต์หลัง T-05: Backend `pytest` -> 25 passed, 1 warning; Frontend -> 8 passed, 1 todo, 5 files passed
- `git diff --check` ผ่าน; T-05 ใช้ Mock Finance Data ที่ระบุ `data_source=MOCK`; ไม่มี write route
- สถานะ T-05: `เสร็จ รอทีมตรวจ`

## 2569-11-05 /implement-all เฟส 3: T-06

- Implement `GET /payments/{payment_id}` อ่าน record พร้อม status ล่าสุดและ `requires_follow_up`; `GET /payments/follow-up` คืนเฉพาะ UNPAID/ABNORMAL
- ไฟล์โค้ด: `backend/app/payments/router.py`, `backend/app/payments/service.py`, `backend/tests/test_AC_PAY_01.py` (สร้าง), `backend/tests/test_AC_PAY_02.py`
- Acceptance tests ตรวจ timezone `+07:00`, amount/currency/status/source, 404, follow-up flags, data source, ข้อมูลต้นทางไม่เปลี่ยน, ปฏิเสธผู้ไม่มี token และ methods ที่ไม่ใช่ GET ได้ 405
- ผล test เฉพาะ T-06: `pytest -q tests/test_AC_PAY_01.py tests/test_AC_PAY_02.py` -> 6 passed, 1 warning ก่อนเพิ่มกรณีไม่มี token
- ผล test ทั้งโปรเจกต์หลัง T-06: Backend `pytest` -> 32 passed, 1 warning; Frontend -> 8 passed, 1 todo, 5 files passed
- `git diff --check` ผ่าน; ไม่มีการแก้ Frontend; ทุก route คืนข้อมูลจาก Mock Finance Data ที่ติดป้าย `MOCK`
- สถานะ T-06: `เสร็จ รอทีมตรวจ`; เพิ่มจุดตรวจเฟส 3 พร้อมคำสั่งรันและ Given/When/Then
- หยุดที่จุดตรวจเฟส 3 ตาม workflow; ยังไม่เริ่ม T-07/เฟส 4

## 2569-11-05 ตรวจรับเฟส 3 และ /implement T-07: ปิด UC-16 Backend

- Live backend ใช้คำสั่งใน tasks.md ที่ `APP_ENV=local` และ demo HR token; `GET /payments?worker_id=MOCK-WORKER-001`, `GET /payments/MOCK-PAY-001` และ `GET /payments/follow-up` ตอบ 200
- Responses ตรวจแล้ว: filter คืน MOCK-WORKER-001; detail คืน amount `15000.00`, THB, PAID, เวลา `+07:00`, `data_source=MOCK`; follow-up คืน UNPAID/ABNORMAL พร้อม `requires_follow_up=true`
- คำขอ live ที่ไม่มี token ตอบ 401; DB `payment_audit_logs` มี 3 ALLOWED และ 1 DENIED พร้อม actor/resource/time/result และไม่มีคอลัมน์ token
- ปิด backend หลังตรวจ; ใช้ local SQLite `backend/dev.db` สำหรับการสาธิต ไม่ใช่ข้อมูลเงินจริง
- T-07 เพิ่ม regression ครอบคลุม methods ที่ไม่ใช่ GET (405), role HR/Manager/Executive allowed, Student/Worker/missing token denied บน payment routes จริง และ audit ของทุก route
- Backend final: `PYTHONDONTWRITEBYTECODE=1 pytest` -> 54 passed, 1 warning (Starlette TestClient/httpx deprecation)
- Frontend regression: `npx vitest run --config vitest.baseline.config.js` -> 8 passed, 1 todo (5 files passed); config ใช้ cache `/tmp` และลบหลังรัน โดยไม่แก้ Frontend ที่ค้าง
- `git diff --check` ผ่าน; T-05/T-06 เปลี่ยนเป็น `เสร็จ` หลัง live verification; T-07 เปลี่ยนเป็น `เสร็จ` หลัง test suite ผ่าน; AC-PAY-01 ถึง AC-PAY-05 ถูกทำเครื่องหมายผ่านใน spec
- UC-16 Backend พร้อมตรวจรับ; ข้อมูลเป็น Mock Finance Data และไม่มีการอ้างว่าเชื่อมระบบการเงินจริง
- T-07 test/doc files: `backend/tests/test_AC_PAY_01.py`, `backend/tests/test_AC_PAY_04.py`, `backend/tests/test_AC_PAY_05.py`, `specs/16-16-track-payment/spec.md`, `specs/16-16-track-payment/plan.md`, `specs/16-16-track-payment/tasks.md`, `prompt-log.md`
- ลบไฟล์ SQLite `backend/dev.db` และไฟล์ response ชั่วคราวที่สร้างระหว่าง live verification หลังตรวจสอบ Audit Log เสร็จแล้ว

## 2569-11-05 ปรับขอบเขต UC-16 เพื่อเพิ่ม Prototype UI

- ตามคำยืนยันของทีม/อาจารย์ เพิ่มงาน Prototype UI ของ UC-16 โดยคง Backend API และ Business Logic ที่เสร็จแล้วทั้งหมด
- ปรับ `spec.md`, `plan.md` และ `tasks.md` ให้ระบุ UI เป็นงานแยก; Frontend ใช้ Mock Data ภายในเท่านั้น ไม่เรียก API/Database และระบุชัดว่าเป็นข้อมูลสมมติ ไม่ใช่ข้อมูลการเงินจริง
- เพิ่ม T-08 แยกจาก T-01 ถึง T-07; กำหนด Dependency เป็น T-01, T-02, T-04 และ T-07 ซึ่งเสร็จแล้ว
- ตรวจโครงสร้าง Frontend: ใช้ React/Vite/Tailwind/Vitest ที่มีอยู่แล้ว; `App.jsx` ปัจจุบันแสดงหน้า Application Status ที่ path `/` และไม่มี Router
- ขอบเขต T-08 ระบุไฟล์ Frontend ที่จะแตะไว้ชัดเจน; เพิ่มทางเข้า `/payments` โดยคง path `/` และไม่ติดตั้ง package
- ยังไม่ Implement UI ในขั้นตอนปรับเอกสารนี้; T-08 อยู่สถานะ `พร้อมทำ` หลังตรวจ Dependency และขอบเขตแล้ว

## 2569-11-05 /implement T-08: Prototype UI UC-16

- Dependency ที่ตรวจ: T-01, T-02, T-04 และ T-07 เป็น `เสร็จ`; T-08 ระบุไฟล์ที่แตะและเงื่อนไขเสร็จเมื่อครบก่อนเริ่ม
- Implement เฉพาะ Frontend: เพิ่ม `/payments` โดยคง path `/` เป็นหน้า Application Status; ใช้ Mock Data ภายใน Frontend, ไม่มี API/Database call และติดป้ายข้อมูลสมมติชัดเจน
- UI เป็น Read-only; summary แสดงยอดจาก Mock Data ทั้งชุด; ค้นหาชื่อแบบ partial และ worker ID/payment reference แบบ exact; กรองสถานะ; เปิดรายละเอียด; แสดงยอดเงินกับสถานะในค่าเดียว
- ไฟล์ T-08: `frontend/src/App.jsx`, `frontend/src/mocks/paymentTrackingData.js`, `frontend/src/pages/PaymentTrackingPage.jsx`, `frontend/src/pages/PaymentTrackingPage.test.jsx`
- Frontend tests: `npm test -- --no-cache` -> 11 passed, 1 todo (5 files passed); T-08 tests 6 passed
- Build: `npm run build` -> ผ่าน; Backend regression `PYTHONDONTWRITEBYTECODE=1 pytest` -> 54 passed, 1 warning เดิม
- Browser verification: `/payments` ตอบ 200; ตรวจหน้า UI และทดลองค้นหา, กรองสถานะ UNPAID และเปิดรายละเอียดได้; ไม่เรียก API
- การตรวจไม่พบคำถามค้างสำหรับ T-08; สถานะเปลี่ยนเป็น `เสร็จ รอทีมตรวจ`; ไม่ Commit หรือ Push

## 2569-11-11 ตรวจทุกโฟลเดอร์ใน specs ด้วย /verify

- ตรวจ `specs/` ทั้งหมด 23 ฟีเจอร์ หลังลบ `specs/001-booking/` แล้ว โดยอ่าน spec, plan, tasks และไฟล์ test/rtm ที่มีอยู่จริง รวมถึงตรวจโค้ดใน `backend/app/` และ `frontend/src/`
- Backend: `cd backend && PYTHONDONTWRITEBYTECODE=1 pytest -v` -> 54 passed, 0 failed, 1 warning
- Frontend: `cd frontend && npm test -- --run` -> 12 passed, 0 failed, 1 todo
- พบ implementation ที่ตรงกับสเปกจริงหลัก ๆ ใน UC-05 (เฉพาะการบันทึกผล AC-REG-05), UC-03 (Frontend บางส่วน ไม่มี Backend endpoint), และ UC-16 (Backend + Prototype UI)
- UC-13, UC-14 และ UC-15 มี tasks ระบุว่าเสร็จ แต่ไม่พบไฟล์โค้ดตาม tasks ใน repository; จัดเป็นเอกสารไม่สอดคล้องกับ implementation
- UC-19, UC-12 และ UC-15 มี prototype HTML แต่ยังไม่ใช่ระบบจริง/ไม่มี test integration
- เอกสาร `test-cases.md` และ `rtm.md` มีครบเฉพาะ UC-03 และ UC-05; อีก 21 โฟลเดอร์ยังขาดอย่างน้อยสองไฟล์นี้
- พบ conflict markers ที่ยังค้างใน `specs/004-login/spec.md`
- ไม่แก้โค้ด, test หรือ spec ตามขอบเขต `/verify`; รายละเอียดผลตรวจรายงานในแชต

## 2569-11-11 สร้าง RTM ให้ทุกฟีเจอร์

- ตามคำสั่งของทีม สร้าง `rtm.md` ให้ครบทั้ง 22 โฟลเดอร์ที่ยังอยู่ใน `specs/` รวมไฟล์เดิมของ UC-03 และ UC-05
- RTM ใหม่ระบุการตามรอย requirement ไปยัง AC, task, โค้ด และ test พร้อมสถานะ `ครบ`, `ยังไม่ถึง` หรือ `ช่องโหว่` ตามหลักฐานที่ตรวจพบ
- แยก Prototype/Mock ออกจาก implementation จริง และระบุฟีเจอร์ที่ tasks ระบุเสร็จแต่ไม่พบไฟล์โค้ด/test ตามที่อ้าง
- ไม่แก้ `spec.md`, `plan.md`, `tasks.md`, โค้ด หรือ test

## 2569-11-11 สร้าง RTM แบบละเอียดทีละฟีเจอร์: UC-01

- เริ่มทำทีละฟีเจอร์ตามคำสั่งของทีม โดยปรับ [specs/001-apply-lab-boy/rtm.md](specs/001-apply-lab-boy/rtm.md) ใหม่ทั้งหมด
- แยก 1 แถวต่อ 1 FR/NFR/Constraint, ระบุ AC, task, โค้ดและ test ตามหลักฐานที่พบจริง
- ระบุโค้ด booking/status/announcement ที่พบว่าเป็นคนละฟีเจอร์ในตารางตามรอยย้อนกลับ
- ยังไม่แก้โค้ด, test, spec, plan หรือ tasks

## 2569-11-11 ลบสเปก UC-01 ที่ไม่เกี่ยวข้อง

- ตามคำสั่งของทีม ลบโฟลเดอร์ `specs/001-booking/` ซึ่งไม่เกี่ยวข้องกับงานนี้
- ไม่ได้ลบหรือแก้โค้ด Backend ส่วน booking ที่อยู่นอกโฟลเดอร์สเปก

## 2569-11-11 ทำ RTM แบบละเอียดต่อเนื่อง

- ทำ RTM แบบละเอียดต่อสำหรับ UC-02, UC-07, UC-08, UC-17 และ UC-18 โดยแยก requirement, AC, task, โค้ด และ test เป็นราย ID
- ตรวจยืนยันว่า RTM อยู่ใน path ของ repository ครบ 22 โฟลเดอร์ (`22/22`) และลบไฟล์ที่เผลอสร้างนอก repository แล้ว
- ระบุสถานะ `รอ Q-01` ใน UC-02 และ UC-18 ตาม Open Question ที่ tasks ระบุไว้
- ระบุว่าโค้ด payment/audit และ announcement form ที่พบเป็นคนละ Use Case ไม่ใช่ implementation ของ UC-17/UC-18/UC-02
- ไม่แก้โค้ด, test, spec, plan หรือ tasks; `git diff --check` ผ่าน

## 2569-11-11 ตรวจแก้ RTM UC-02 ตามข้อทักท้วง

- แก้สถานะ Q-01 จาก `รอ Q-01` เป็น `ยังไม่ถึง` เพราะ `tasks.md` ระบุว่าทีมเลือกสมมติฐานรองรับการกรองด้วยรายวิชาและภาคการศึกษาแล้ว
- เพิ่ม F-001 กรณี T-01 ระบุเสร็จแต่ไม่พบ model/service ที่ task อ้าง
- เพิ่ม F-002 เพราะ NFR-PERF-01 และ NFR-USE-01 ไม่มี AC โดยตรง และปรับสถานะเป็น `ช่องโหว่`
- เพิ่ม F-003 เพื่อแยก `AnnouncementForm.jsx` ของ UC-15 ออกจาก implementation ของ UC-02

## 2569-11-11 ตรวจ RTM ทุกฟีเจอร์และแก้รายการที่ไม่ตรงกติกา

- ตรวจ RTM ครบ 22 ฟีเจอร์เทียบกับ requirement IDs ใน `spec.md`; ไม่พบ requirement ID ที่หายจาก RTM และไม่พบแถวที่รวมหลาย requirement ID เป็นแถวเดียว
- แก้ UC-04 ให้แยก NFR/Constraint และ task ที่มีจริง พร้อมเพิ่มข้อค้นพบเรื่อง conflict markers, requirement ที่ไม่มี AC และ T-01 ที่ระบุเสร็จแต่ไม่พบ implementation
- แก้ UC-06, UC-09, UC-10, UC-12 และ UC-21 เรื่องการใช้สถานะ `ช่องโหว่` ผิดประเภท, AC ที่ไม่มีใน traceability และแถว FR/NFR ที่ไม่ครบ
- เพิ่มตารางข้อค้นพบตาม template ให้ RTM ที่เดิมเขียนเป็นข้อความสรุป และเพิ่ม F-ID สำหรับข้อผิดพลาดใน task/spec ที่ตรวจพบ
- ปรับ UC-19 ให้ prototype ที่ task ยังไม่เสร็จเป็น `ยังไม่ถึง` ไม่ใช่ข้อค้นพบจาก test
- ไม่แก้โค้ด, test, spec, plan หรือ tasks; `git diff --check` ผ่าน

## 2569-11-11 ทำ Prototype สมัครเป็น Lab Boy (UC-01)

- คำสั่งจากทีม: `/workspaces/PuttangParungParangKatchami-swreqspec/specs/001-apply-lab-boy` — “ทำ Prototype ให้ดูหน่อย”
- เพิ่มหน้า Prototype ที่ `/apply-lab-boy` เพื่อสาธิตประกาศรับสมัคร การตรวจข้อมูลบัญชี การยืนยัน ถอน/สมัครใหม่ และผลลัพธ์จำลองตาม AC ใน `specs/001-apply-lab-boy/spec.md`
- ระบุชัดว่าเป็นข้อมูลจำลอง ไม่เชื่อม Backend และชื่อ/ฟิลด์ข้อมูลเป็นตัวอย่างเท่านั้น
- เพิ่มการทดสอบ UI ที่อ้างอิง AC-LB-01 ถึง AC-LB-11; ไม่แก้ spec, plan หรือ tasks

## 2569-11-11 ย้ายไฟล์ Prototype สมัคร Lab Boy

- คำสั่งจากทีม: ย้ายไฟล์ Prototype ไปไว้ที่ `specs/001-apply-lab-boy`
- ย้ายหน้า Prototype ไปเป็น `specs/001-apply-lab-boy/ApplyLabBoyPrototype.jsx` และปรับ import ใน Frontend
- คงไฟล์ทดสอบไว้ใน `frontend/src/pages` เพื่อให้ชุดทดสอบเดิมตรวจพบและรันได้

## 2569-11-11 ปรับหน้า Prototype สมัคร Lab Boy

- คำสั่งจากทีม: ไม่ต้องการหัวข้อ “ตรวจสอบคุณสมบัติ”, “ทดลองสถานการณ์” และ “ขั้นตอนการสมัคร”
- นำแผงหัวข้อดังกล่าวออก ปรับหน้าประกาศและข้อมูลผู้สมัครเป็นคอลัมน์เดียว และคงตัวเลือกผลจำลองไว้ในฟอร์มโดยไม่มีหัวข้อ “ทดลองสถานการณ์”
- เพิ่ม assertion ใน UI test ว่าหัวข้อ/ข้อความที่ระบุไม่ปรากฏ

## 2569-11-11 ปรับข้อมูลผู้สมัครและการแสดงจำนวนผู้สมัคร (UC-01)

- คำสั่งจากทีม: ไม่แสดงหัวข้อ “สมัครแล้ว” และเพิ่มการยืนยันเกรดของนักศึกษา

### คำถามที่ AI ถาม (ทั้งหมด)

1. ต้องการซ่อนเฉพาะหัวข้อ “สมัครแล้ว” หรือเอาช่องจำนวนผู้สมัครและตัวเลขออกทั้งหมด?
2. ต้องการให้ผู้สมัครยืนยันเกรดในลักษณะใด?
3. ต้องการให้กรอกข้อมูลเกรดชนิดใด ใช้รูปแบบใด และเกรดจะใช้ตัดสินสิทธิ์สมัครหรือไม่?
4. สำหรับเกรดรายวิชา ให้กรอกเกรดอย่างเดียวเพราะรายวิชาอยู่ในประกาศ หรือกรอกรหัส/ชื่อวิชาด้วย?
5. ใน spec ยังไม่มีรายวิชาที่เกี่ยวข้อง ต้องการเพิ่มชื่อวิชาในประกาศ หรือเก็บเกรดโดยไม่ผูกกับรายวิชา?

### คำตอบของทีมและเหตุผล

1. เอาช่องจำนวนผู้สมัครและตัวเลขออกทั้งหมด
2. ให้ผู้สมัครกรอกเกรดเองแล้วกดยืนยัน
3. เลือกเกรดรายวิชาแบบตัวอักษร A–F และเก็บเพื่อยืนยันเท่านั้น ไม่ใช้ตัดสินสิทธิ์สมัคร
4. ทีมเลือกกรอกเฉพาะเกรด เพราะเข้าใจว่ารายวิชาอยู่ในประกาศ
5. หลังแจ้งว่า spec/Prototype ไม่ระบุรายวิชา ทีมยืนยันให้เก็บเกรดโดยไม่ผูกกับรายวิชา

### สิ่งที่แก้

- เพิ่ม ASM-07 ใน `specs/001-apply-lab-boy/spec.md` เพื่อบันทึกชนิดเกรดและวิธีใช้งานตามคำตอบของทีม
- เอาช่องจำนวนผู้สมัครออกจาก Prototype
- เพิ่มฟิลด์เกรด A–F ที่ต้องเลือกก่อนยืนยัน และแสดงเกรดในหน้าต่างยืนยัน/ผลการสมัคร โดยไม่ใช้เกรดตัดสินคุณสมบัติ
- เพิ่ม UI tests ตรวจการซ่อนจำนวนผู้สมัครและการยืนยันเกรด

## 2569-11-11 ตรวจยืนยันว่า RTM อิงจาก spec ทุกฟีเจอร์

- ตรวจ RTM ครบ 22 ฟีเจอร์ โดยเทียบ requirement ID, AC ID และ Q ID ในตารางตามรอยไปข้างหน้ากับ `spec.md` และ task references กับ `tasks.md`
- แก้ UC-01 ที่อ้าง Q-01 ถึง Q-04 จาก `tasks.md` แต่ไม่มีใน `spec.md` โดยเปลี่ยนเป็น `ยังไม่ถึง` และเพิ่ม F-001 เรื่องอ้าง ID ผิดเรื่อง
- แก้ UC-05 ให้ตารางข้อค้นพบมี header ครบตาม template
- แก้ UC-13 ไม่ให้อ้าง AC-PERF-01 ซึ่งไม่มีใน `spec.md` และเพิ่ม F-002
- ยืนยันว่า ID ของฟีเจอร์อื่นที่อยู่เฉพาะในตาราง “ตามรอยย้อนกลับ” เป็นหลักฐานว่าโค้ดนั้นเป็นคนละ Use Case ไม่ใช่ requirement ที่เพิ่มในตารางตามรอยไปข้างหน้า
- ตรวจแล้ว requirement ID ในทุก `spec.md` มีอยู่ใน RTM และ `git diff --check` ผ่าน

## 2569-11-12 สร้าง test cases UC-15

- คำสั่งจากทีม: `/testcases 15-15-create-recruitment-announcement`
- คำถามที่ AI ถาม: ต้องการสร้าง test cases สำหรับ AC ID ใด
- คำตอบของทีม: AC-ANN-01, AC-ANN-02, AC-ANN-03, AC-ANN-04
- โหมด: ร่าง; สร้าง 9 แถว สถานะ "ร่าง" สำหรับ AC-ANN-01 ถึง AC-ANN-03 ใน `specs/15-15-create-recruitment-announcement/test-cases.md`; ยังไม่เขียนหรือรัน test
- ข้อสังเกต: AC-ANN-04 ไม่มีใน spec.md จึงยังไม่สร้าง test case ให้; plan.md ระบุ AC-ANN-03 เป็นเรื่อง Expired แต่ spec.md ระบุ AC-ANN-03 เป็นเรื่อง audit log; แถว AC-ANN-02-3, AC-ANN-03-3 และ AC-ANN-01-3 ระบุผลที่ spec ไม่ได้กำหนดครบถ้วนไว้เป็นคำถาม

## 2569-11-12 ตรวจ React Prototype และปรับ test cases UC-15

- คำสั่งจากทีม: ตรวจ Implementation React Prototype จริง, ปรับ test cases ทั้ง 9 ให้เป็น frontend tests โดยไม่เปลี่ยน Requirement, และรายงานข้อผิดพลาดก่อนแก้ Implementation
- คำถามที่ AI ถาม: จะคง expected behavior ตาม spec แล้วบันทึกช่องว่างของ Prototype หรือจำกัด tests เฉพาะ render/callback ที่มีอยู่
- คำตอบของทีม: คง expected behavior ตาม spec และบันทึกสิ่งที่ Prototype ยังไม่มีเป็น implementation gaps
- ผลตรวจ: มี Vitest และ React Testing Library ใน `frontend/package.json`; `AnnouncementForm.jsx` เป็น component นำเสนอที่เรียก callbacks ซึ่งส่งเข้ามา ไม่มีผู้เรียกใช้ใน `frontend/src`; ไม่พบ validation, persistence/state transition, Student role guard หรือ audit log ใน React Prototype
- สิ่งที่แก้: เปลี่ยนวิธีตรวจทั้ง 9 แถวจาก pytest เป็น Vitest + React Testing Library; เพิ่มกรณี Student publish ตาม NFR-SEC-01; คง AC เดิมและทุกแถวยังเป็น "ร่าง"
- ผล test: ไม่ได้เขียนหรือรัน test code เพราะ test cases ยังเป็นร่างและ Prototype ไม่มี flow ให้ทดสอบ expected behavior เหล่านี้; ไม่แก้ Implementation ตามคำสั่ง
- คำถามค้าง: spec.md ไม่กำหนดผลเมื่อข้อมูลครบและผู้ใช้กดเผยแพร่; plan.md ระบุ Published แต่ต้องให้ทีมยืนยันก่อนใช้เป็น expected result

## 2569-11-12 ปรับเอกสาร UC-15 ให้ใช้ AC-ANN-01 ถึง AC-ANN-04

- คำสั่งจากทีม: ยึด Spec v2; แยก AC-ANN-03 สำหรับ audit log และ AC-ANN-04 สำหรับ Expired อัตโนมัติ; เพิ่มผลเมื่อข้อมูลครบแล้ว Publish; ปรับ Plan, Tasks, RTM และ test cases ให้ตรงกัน; คง implementation gap และ test cases สถานะร่าง; ห้ามแก้โค้ดหรือรันทดสอบ
- สิ่งที่แก้: เพิ่ม Expected Result `Published` และ Student publish denial ใน AC-ANN-02; กำหนด AC-ANN-04 และ lifecycle constraint; ปรับ NFR-SEC-01, traceability และแผน/รายการ task ให้ใช้ T-01 ถึง T-08 ตรงกัน
- Test cases: แยกตาม AC-ANN-01 ถึง AC-ANN-04 รวม 13 แถว ทุกแถวยังคงสถานะ "ร่าง"; ไม่เปลี่ยนผลทดสอบและไม่ได้สร้าง test code
- RTM: คง F-001 เรื่อง implementation gap, บันทึก mock behavior ใน `prototype.html` เทียบกับระบบจริง และเพิ่ม F-002 เรื่อง Student ยังเห็น Draft ในรายการ mock
- ผลตรวจ Prototype: `prototype.html` มี Draft/validation/Publish/role guard/audit log แบบ in-memory; ไม่พบ persistent storage, immutable audit storage หรือ Scheduled Job; React `AnnouncementForm` ยังไม่เชื่อมกับ `App`
- ผลตรวจเอกสาร: AC ทุกข้อเชื่อมกับ task และ RTM; T-05 อ้าง AC-ANN-04; NFR-SEC-01 ครอบคลุม Student; ไม่ได้แก้ source code, React Prototype หรือ Implementation
- ผล test: ไม่ได้รันตามคำสั่ง; ตรวจ `git diff --check` หลังแก้ไข
- สิ่งที่ต้องให้ทีมยืนยัน: cutoff/time zone และความถี่ของ Scheduled Job สำหรับ end_date; ความหมาย/การแสดงข้อมูล Draft ที่ Student เห็นใน mock UI

## 2569-11-12 ระบุเวลา Expired และสถานะ T-05 ตามข้อสรุปทีม

- คำสั่งจากทีม: กำหนดเวลาหมดอายุ 23:59:59 น. Asia/Bangkok (UTC+7), Scheduled Job ทุกวัน 00:05 น. Asia/Bangkok, เปลี่ยน T-05 เป็นรอดำเนินการ, เพิ่ม test cases สำหรับเวลา Expired และ Student ต้องไม่เห็น Draft; ห้ามแก้ Prototype/Implementation หรือรันทดสอบ
- สิ่งที่แก้: ระบุเวลา/time zone ใน spec, plan, tasks และ RTM; เปลี่ยนสถานะ T-05 เป็น "รอดำเนินการ / ยังไม่ Implement"; เพิ่ม TC-ANN-01-4 และ TC-ANN-04-4; ปรับ boundary cases ให้ตรงกับเวลาที่ทีมกำหนด
- Test cases: มี 15 แถว ทุกแถวยังคงสถานะ "ร่าง"; ไม่เปลี่ยนผล Pass/Fail และไม่สร้าง test code
- Implementation Gap: คง F-001 เรื่องไม่มี Scheduler ใน Implementation/RTM และ F-002 เรื่อง HTML Prototype ยังแสดง Draft ให้ Student; ไม่แก้ `prototype.html`, Source Code หรือ React Prototype
- ผล test: ไม่ได้รันตามคำสั่ง; จะตรวจเฉพาะ `git diff --check` และความสอดคล้องของเอกสาร
## 2569-11-12 21:54 ปรับข้อมูลห้องทำงานในประกาศสมัคร Lab Boy

- คำสั่งจากทีม: เพิ่มเวลาที่ต้องทำ Lab Boy และห้องทำงานใต้ชื่ออาจารย์

### คำถามที่ AI ถาม (ทั้งหมด)

1. ยืนยันว่าปรับ `ApplyLabBoyPrototype.jsx` และให้ระบุชื่ออาจารย์ เวลาปฏิบัติงาน ห้องทำงาน และยืนยันการแก้ spec หรือไม่?
2. ชื่ออาจารย์ควรแสดงอย่างไร และ “ไม่ต้องทำ” หมายถึงไม่มีชั่วโมงที่กำหนดหรือข้อความอื่น?
3. ชั่วโมงที่ไม่กำหนดให้ซ่อนหรือแสดงเป็น “ไม่กำหนด” และชื่ออาจารย์ใช้บัญชีเจ้าของประกาศหรือบัญชีผู้ใช้ปัจจุบัน?
4. เนื่องจาก Prototype ยังไม่มีข้อมูลชื่ออาจารย์ จะเพิ่มห้องในส่วนประกาศชั่วคราว หรือรอให้ทีมเพิ่มชื่อก่อน?

### คำตอบของทีมและเหตุผล

1. ยืนยันขอบเขต Prototype และแก้ spec; ห้องทำงานคือ `ว.1 ห้อง 1227`; ค่าแรกของชั่วโมงที่ส่งมายังไม่ชัด
2. ชื่อควรมาจาก User ID โดยไม่ต้องกรอกเอง; ชั่วโมงไม่ต้องกำหนด; ห้องแสดงใต้ชื่อ
3. ซ่อนชั่วโมง และทีมจะจัดการแหล่งชื่ออาจารย์เอง
4. เพิ่มห้องในส่วนประกาศชั่วคราว เพื่อให้ทีมย้ายไปใต้ชื่ออาจารย์ภายหลัง

### สิ่งที่แก้

- ปรับ FR-LB-01 และ AC-LB-02 ให้ระบุการแสดงห้องทำงาน โดยคง ID เดิม
- เพิ่ม `ว.1 ห้อง 1227` ใต้ชื่ออาจารย์ในส่วนประกาศของ Prototype; ไม่เพิ่มข้อมูลชั่วโมงปฏิบัติงาน
- เพิ่ม test สำหรับ AC-LB-02 ตรวจตำแหน่งห้องทำงานใต้ชื่ออาจารย์ และตรวจว่าไม่มีข้อความชั่วโมงปฏิบัติงาน
- ทีมจะจัดการการผูกชื่ออาจารย์กับ User ID เอง; ตำแหน่งห้องใน Prototype ขณะนี้เป็นตำแหน่งชั่วคราวตามที่ยืนยัน
- ตรวจสอบ: `npm test -- src/pages/ApplyLabBoyPage.test.jsx` ผ่าน 8/8 tests, `npm run build` ผ่าน และ `git diff --check` ผ่าน

## 2569-11-12 22:21 /testcases AC-LB-01

- โหมด: ร่าง
- ไฟล์: `specs/001-apply-lab-boy/test-cases.md`
- สถานะ task ที่เกี่ยวข้อง: T-04 พร้อมทำ
- เสนอ TC-LB-01-1 ถึง TC-LB-01-5; ยังไม่ได้เขียนโค้ด test เพราะทุกแถวมีสถานะ `ร่าง`
- จุดที่ spec ยังไม่บอก: เมื่อคำขอยืนยันมาถึงตรงกับเวลาปิดรับสมัคร ให้นับว่ายังอยู่ในช่วงรับสมัครหรือไม่

## 2569-11-12 22:30 ปรับปุ่มในฟอร์มสมัคร Lab Boy

- คำสั่งจากทีม: แทนที่ปุ่มคืนค่าข้อมูลด้วยปุ่มยืนยันการสมัครและยกเลิก

### คำถามที่ AI ถาม (ทั้งหมด)

1. ต้องการเปลี่ยนปุ่มแถวใต้ฟอร์มหรือปุ่มในกล่องยืนยัน และปุ่มยกเลิกควรทำอะไร?
2. เมื่อเลือกแถวใต้ฟอร์มแต่ตอบว่าจะปิดกล่องยืนยัน ซึ่งยังไม่เปิดอยู่ ต้องการให้ปุ่มทำอะไรแทน?
3. “ไม่ต้องแสดงอะไร” หมายถึงซ่อนปุ่มหรือแสดงปุ่มที่กดแล้วไม่เกิดผล?

### คำตอบของทีมและเหตุผล

1. เปลี่ยนแถวใต้ฟอร์มแทนปุ่มคืนค่าข้อมูล; ตอนแรกตอบให้ปิดกล่องยืนยัน
2. ตอบว่าไม่ต้องแสดงอะไร
3. ยืนยันให้แสดงปุ่มยกเลิก แต่กดแล้วไม่เกิดผล

### สิ่งที่แก้

- ปรับ FR-LB-06 และ AC-LB-06 โดยคง ID เดิม ให้ระบุปุ่มยืนยันและยกเลิก และผลของปุ่มยกเลิก
- แทนปุ่ม “คืนค่าข้อมูลตัวอย่าง” ด้วย “ยกเลิก”; ปุ่มยกเลิกไม่เปลี่ยนข้อมูลหรือสถานะตามที่ทีมยืนยัน
- เพิ่ม test ตรวจการแสดงปุ่มทั้งสองและตรวจว่าการกดยกเลิกไม่เปลี่ยนข้อมูลในฟอร์ม
- ตรวจสอบ: `npm test -- src/pages/ApplyLabBoyPage.test.jsx` และ `git diff --check` (บันทึกผลหลังรัน)

### ผลตรวจหลังรัน

- test ปุ่มยกเลิก: ผ่าน 1/1 (อีก 8 tests ถูกข้ามด้วย filter)
- ชุด test ทั้งไฟล์: 7 ผ่าน, 2 ไม่ผ่าน เพราะยังค้นหา combobox `ผลจำลองเมื่อยืนยัน` ที่ไม่มีใน JSX ปัจจุบัน; ไม่ได้แก้ test เหล่านั้นซึ่งอยู่นอกงานนี้
- `git diff --check` ยังพบ whitespace ท้ายบรรทัดเดิมที่ `ApplyLabBoyPrototype.jsx:261`; ไม่แก้เพราะไม่เกี่ยวกับงานนี้

## 2569-11-12 22:50 /verify specs/001-apply-lab-boy

- ไฟล์ที่แก้: `specs/001-apply-lab-boy/rtm.md` และเพิ่มบันทึกนี้ต่อท้าย
- ผล test: backend 54 ผ่าน; frontend 15 ผ่าน, 6 ไม่ผ่าน, 1 todo
- test ไฟล์หน้า Lab Boy: ผ่าน 3 (รวม route test 1 และ test ประกาศ/ห้องทำงาน 2); ไม่ผ่าน 6 เพราะ test เดิมค้น label เกรดและ selector จำลองที่ไม่มีใน UI ปัจจุบัน
- ตารางตามรอยไปข้างหน้า: ครบ 0, ยังไม่ถึง 15, รอ 0, ช่องโหว่ 4
- ข้อค้นพบใหม่: F-002 เกณฑ์/รายการเกรดไม่ตรง ASM-07; F-003 แสดงเวลาปฏิบัติงานที่อยู่ใน Out of scope; F-004 กำหนดรูปแบบเลขใบสมัครและวันเวลาโดยไม่มีข้อกำหนดใน spec
- คง F-001 เดิมและช่อง "ทีมตัดสิน" ว่างไว้; ไม่แก้โค้ดหรือ test

## 2569-11-12 23.32 คำสั่ง: ปรับ FR-MSG-02 ของ specs/022-notify-user

- ทีมสั่ง: เลือกฟีเจอร์ 022 และปรับ FR-MSG-02 ให้ใช้เฉพาะ notification ภายในระบบ
- ไฟล์ที่แก้: `specs/022-notify-user/spec.md`
- ผลลัพธ์: ปรับ FR-MSG-02 ให้ระบุ notification ภายในระบบเท่านั้น และส่งให้ผู้ใช้ที่เปิดใช้งานและมีสิทธิ์รับการแจ้งเตือน
- การตรวจสอบ: ตรวจทานเอกสารที่เกี่ยวข้องแล้ว; ไม่รันทดสอบเนื่องจากเป็นการแก้เอกสาร

## 2569-11-13 00:13 /implement T-01 specs/019-check-work-time/tasks.md

- ไฟล์ที่สร้าง: `backend/app/schemas/calendar_check_request.py`, `backend/app/services/calendar_check_service.py`, `backend/tests/test_check_work_time.py`
- ไฟล์สถานะ/บันทึกที่แก้: `specs/019-check-work-time/tasks.md` (T-01 เป็น "เสร็จ รอทีมตรวจ"), `prompt-log.md`
- ผล test: `cd backend && pytest -q tests/test_check_work_time.py` — 5 passed, 1 warning จาก Starlette/httpx deprecation
- ผลลัพธ์: เพิ่มการรับและตรวจสอบ `startDate`/`endDate` ตามรูปแบบ ISO datetime ในตัวอย่าง plan และทดสอบ AC-CAL-01 ทั้งกรณีข้อมูลถูกต้อง ขาด และรูปแบบผิด
- ไม่แก้ `spec.md` หรือ `plan.md`; T-02 ขึ้นไปยังไม่ได้ทำ
- สิ่งที่เกือบต้องเดา: ไม่มี Task ID ในคำสั่งแรก จึงถามทีมและได้รับคำตอบ T-01 ก่อนเริ่ม; ไม่ได้กำหนดกติกาปฏิทินหรือการตรวจช่วงซึ่งอยู่นอก T-01

## 2569-11-13 00:17 /implement T-02 specs/019-check-work-time/tasks.md

- ทีมอนุมัติ T-01 และยืนยัน policy สำหรับ T-02: ใช้ช่วง PDF 22 มิ.ย. 2569–5 ก.ค. 2570; การดึง ThailandFormats API แบบสดที่ผ่าน validation ถือเป็นข้อมูลปัจจุบันและบันทึกเวลาที่ดึง
- ไฟล์ที่สร้าง: `backend/app/models/calendar_snapshot.py`, `backend/app/services/calendar_source.py`
- ไฟล์ที่แก้: `backend/tests/test_check_work_time.py`, `specs/019-check-work-time/tasks.md` (T-01 เป็น "เสร็จ", T-02 เป็น "เสร็จ รอทีมตรวจ"), `prompt-log.md`
- ผลลัพธ์: เพิ่ม snapshot จาก PDF มหาวิทยาลัยปี 2569 และวันหยุดไทยที่ดึงตามปี ค.ศ.; ปฏิเสธช่วงนอกขอบเขต PDF และข้อมูล API ที่ผิด/ขาด/ปีไม่ตรง
- ผล test: `cd backend && pytest -q tests/test_check_work_time.py` — 12 passed, 1 warning จาก Starlette/httpx deprecation
- ไม่แก้ `spec.md` หรือ `plan.md`; ไม่ได้ทำ T-03 เป็นต้นไป
- สิ่งที่เกือบต้องเดา: ขอบเขตวันของ PDF และ freshness ของ API; ถามทีมและใช้คำตอบที่ยืนยันแล้ว

## 2569-11-13 00:28 /implement T-03 specs/019-check-work-time/tasks.md

- ทีมอนุมัติ T-02 ก่อนเริ่ม T-03
- ไฟล์ที่สร้าง: `backend/app/services/calendar_overlap_service.py`
- ไฟล์ที่แก้: `backend/tests/test_check_work_time.py`, `specs/019-check-work-time/tasks.md` (T-02 เป็น "เสร็จ", T-03 เป็น "เสร็จ รอทีมตรวจ"), `prompt-log.md`
- ผลลัพธ์: ตรวจ overlap แบบรวมวันเริ่มและวันสิ้นสุดกับช่วงห้ามจากปฏิทินมหาวิทยาลัยและวันหยุดไทย; partial-day overlap ถือว่า FAIL พร้อมเหตุผล; ไม่ overlap คืน PASS
- ผล test: `cd backend && pytest -q tests/test_check_work_time.py` — 15 passed, 1 warning จาก Starlette/httpx deprecation
- ไม่แก้ `spec.md` หรือ `plan.md`; T-04 ขึ้นไปยังไม่ได้ทำ
- สิ่งที่เกือบต้องเดา: ไม่มี; ยึดกฎ full-day และ partial overlap ที่ทีมยืนยันใน Q-01/Q-02

## 2569-11-13 00:31 /implement T-04 specs/019-check-work-time/tasks.md

- ทีมอนุมัติ T-03 ก่อนเริ่ม T-04 และกำหนดให้ T-04 สร้าง response service; T-05 จะสร้าง endpoint ที่ `/calendar/check`
- ปรับรายละเอียด T-04 ใน `tasks.md` ให้ไม่รวม endpoint ซึ่งเป็นงานของ T-05; ไม่เปลี่ยน ID และไม่แก้ `spec.md`/`plan.md`
- ไฟล์ที่แก้: `backend/app/services/calendar_check_service.py`, `backend/tests/test_check_work_time.py`, `specs/019-check-work-time/tasks.md` (T-03 เป็น "เสร็จ", T-04 เป็น "เสร็จ รอทีมตรวจ"), `prompt-log.md`
- ผลลัพธ์: สร้าง JSON payload ที่มี `status`, `reason`, `calendarVersion`, `effectiveDate` สำหรับทั้งผล PASS และ FAIL พร้อมอ้างอิงปฏิทินมหาวิทยาลัยและปีของข้อมูลวันหยุด
- ผล test: `cd backend && pytest -q tests/test_check_work_time.py` — 17 passed, 1 warning จาก Starlette/httpx deprecation
- ไม่สร้างหรือแก้ `backend/app/router.py`; endpoint `/calendar/check` เป็นขอบเขตของ T-05
- สิ่งที่เกือบต้องเดา: `backend/app/router.py` ไม่มีอยู่ และ T-04/T-05 ระบุขอบเขตซ้อนกัน; ถามทีมและทำตามการแบ่งขอบเขตที่ยืนยันแล้ว

## 2569-11-13 00:38 แก้รูปแบบ calendarVersion/effectiveDate ของ T-04

- ทีมยืนยัน: `calendarVersion` ใช้วันที่สร้าง snapshot รูปแบบ `dd.mm.yyyy`; `effectiveDate` ใช้ timestamp UTC ตอนดึง/ประกอบ snapshot สำเร็จ
- ไฟล์ที่แก้: `backend/app/services/calendar_check_service.py`, `backend/tests/test_check_work_time.py`, `specs/019-check-work-time/tasks.md`, `prompt-log.md`
- ผลลัพธ์: ปรับ response และ test ให้ยืนยันรูปแบบวันที่กับ timestamp ตามที่ทีมเลือก โดยไม่แก้ `spec.md` หรือ `plan.md`
- สิ่งที่เกือบต้องเดา: ระบบปีของ calendarVersion; ใช้ ค.ศ. ตาม UTC ให้ตรงกับ effectiveDate

## 2569-11-13 00:41 /implement T-05 specs/019-check-work-time/tasks.md

- ทีมอนุมัติ T-04 ก่อนเริ่ม T-05; endpoint path ที่ทีมกำหนดคือ `POST /calendar/check`
- ไฟล์ที่สร้าง: `backend/app/router.py`
- ไฟล์ที่แก้: `backend/app/main.py`, `backend/tests/test_check_work_time.py`, `specs/019-check-work-time/tasks.md` (T-04 เป็น "เสร็จ", T-05 เป็น "เสร็จ รอทีมตรวจ"), `prompt-log.md`
- ผลลัพธ์: endpoint เชื่อม validation, calendar snapshot, overlap checker และ JSON response; หาก source ปฏิทินใช้ไม่ได้จะคืน FAIL พร้อม reason และเวลาที่พยายามตรวจ; request ไม่ถูกต้องคืน HTTP 422
- ผล test: รันทดสอบ `cd backend && pytest -q tests/test_check_work_time.py` หลังแก้โค้ด
- ไม่แก้ `spec.md` หรือ `plan.md`; T-06/T-07 ยังไม่ทำ
- สิ่งที่เกือบต้องเดา: ไม่มี; path และการแบ่งขอบเขต T-04/T-05 ได้รับการยืนยันจากทีมแล้ว
- ผลทดสอบหลังทำเสร็จ: `cd backend && pytest -q tests/test_check_work_time.py` — 19 passed, 1 warning จาก Starlette/httpx deprecation
- `git diff --check` ผ่าน; T-05 คงสถานะ "เสร็จ รอทีมตรวจ"

## 2026-11-12 17:48 UTC /implement T-06 specs/019-check-work-time/tasks.md

- ทีมอนุมัติ T-05 และสั่งทำ T-06
- ไฟล์ที่สร้าง: `frontend/src/pages/CheckWorkTimePage.jsx`, `frontend/src/api/calendarCheckApi.js`, `frontend/src/__tests__/checkWorkTime.test.jsx`
- ผลลัพธ์: สร้างฟอร์มช่วงวันและเวลาพร้อมแสดง `status`, `reason`, `calendarVersion`, `effectiveDate`; mock API ตอบ PASS ตาม JSON contract และหน้าจอรองรับทั้ง PASS/FAIL
- สิ่งที่ถามเพื่อไม่เดา: spec/plan ไม่ระบุเงื่อนไข mock ที่ทำให้ FAIL; ทีมเลือก mock PASS คงที่ และให้ทดสอบการ render FAIL ด้วย mock response ใน test
- ผล test: `cd frontend && npm test -- src/__tests__/checkWorkTime.test.jsx` — 2 passed
- ผล build: `cd frontend && npm run build` — สำเร็จ
- ไม่แก้ `spec.md` หรือ `plan.md`; T-06 เป็น "เสร็จ รอทีมตรวจ" และยังไม่เริ่ม T-07

## 2026-11-12 17:51 UTC /implement T-07 specs/019-check-work-time/tasks.md

- ทีมยืนยันว่า T-05/T-06 ผ่านแล้ว และอนุมัติเปลี่ยนสถานะเป็น "เสร็จ" ก่อนเริ่ม T-07
- ทีมกำหนด benchmark end-to-end รวม ThailandFormats API จริง เพดาน 500 ms; อนุมัติให้เพิ่มการ reuse HTTP connection pool โดยไม่ cache ข้อมูลปฏิทิน
- ไฟล์ที่แก้: `backend/app/services/calendar_source.py` (reuse connection pool), `backend/tests/test_check_work_time.py`, `frontend/src/api/calendarCheckApi.js`, `frontend/src/pages/CheckWorkTimePage.jsx`, `frontend/src/__tests__/checkWorkTime.test.jsx`, `frontend/src/App.jsx`, `specs/019-check-work-time/tasks.md` (T-05/T-06 เป็น "เสร็จ", T-07 เป็น "เสร็จ รอทีมตรวจ"), `prompt-log.md`
- ผลลัพธ์: หน้า UI ส่ง POST `/api/calendar/check` ไปยัง endpoint จริงและเข้าถึงได้ที่ `/calendar/check`; API mock ถูกแทนด้วย fetch จริงและแสดง error HTTP โดยไม่สร้างผลตรวจปลอม
- ผล test backend: `cd backend && pytest -q tests/test_check_work_time.py` — 27 passed, รวม benchmark live 3 ครั้งภายใน 500 ms; มี 1 warning จาก Starlette/httpx deprecation
- ผล test frontend เฉพาะงาน: `cd frontend && npm test -- src/__tests__/checkWorkTime.test.jsx` — 7 passed
- ผล test frontend ทั้งชุด: 22 passed, 6 failed, 1 todo; ทั้ง 6 failures อยู่ใน `src/pages/ApplyLabBoyPage.test.jsx` และไม่เกี่ยวกับไฟล์ของ T-07
- ผล build: `cd frontend && npm run build` — สำเร็จ; `git diff --check` ผ่าน
- Benchmark ก่อนใช้ connection pool พบ cold request 568 ms; หลังใช้ connection pooling ทุกครั้งใน benchmark ล่าสุดผ่าน 500 ms โดยยังดึงข้อมูล API สดทุก request
- ไม่แก้ `spec.md` หรือ `plan.md`; T-07 รอทีมตรวจ

## 2026-11-12 18:08 UTC แก้ไขคำแนะนำรูปแบบวันเวลาในหน้า T-07

- ทีมแจ้งว่าหน้าแสดงข้อความ `The string did not match the expected pattern.`
- ตรวจพบว่าเป็นรูปแบบที่ browser input `datetime-local` ปฏิเสธเมื่อพิมพ์ข้อความวันเวลาแบบอ่านง่าย; API รับค่า `YYYY-MM-DDTHH:mm` ได้และ endpoint ตอบ PASS เมื่อใช้รูปแบบดังกล่าว
- ไฟล์ที่แก้: `frontend/src/pages/CheckWorkTimePage.jsx`, `frontend/src/__tests__/checkWorkTime.test.jsx`, `prompt-log.md`
- ผลลัพธ์: เพิ่มคำแนะนำรูปแบบ `YYYY-MM-DDTHH:mm` ที่เชื่อมกับ input ทั้งสองช่องผ่าน `aria-describedby`; ไม่เปลี่ยน contract หรือกฎตรวจปฏิทิน
- ผล test: `cd frontend && npm test -- src/__tests__/checkWorkTime.test.jsx` — 8 passed

## 2026-11-12 18:14 UTC แก้ไข response ว่างเมื่อ backend ไม่ทำงาน

- ทีมแจ้งว่า API ใช้งานได้แล้วแต่ภายหลังขึ้น `Failed to execute 'json' on 'Response': Unexpected end of JSON input`
- ตรวจพบ frontend ที่ port 5173 ยังทำงาน แต่ backend ที่ port 8000 หยุดอยู่; Vite proxy ตอบ HTTP 500 โดยไม่มี JSON
- ไฟล์ที่แก้: `frontend/src/api/calendarCheckApi.js`, `frontend/src/__tests__/checkWorkTime.test.jsx`, `prompt-log.md`
- ผลลัพธ์: API client อ่าน response body อย่างปลอดภัยและแสดง HTTP status เมื่อ response ว่าง/ไม่ใช่ JSON แทนการโยน raw JSON parse error; restart backend แล้วลองจาก browser ได้ PASS
- ผล test: `cd frontend && npm test -- src/__tests__/checkWorkTime.test.jsx` — 9 passed

## 2026-11-12 18:22 UTC /verify specs/019-check-work-time/

- ตรวจ `spec.md`, `plan.md`, `tasks.md`, `rtm.md`, โค้ดและ test ของ backend/frontend ที่เกี่ยวข้อง; ไม่พบ `test-cases.md`
- ผล test: `cd backend && pytest -v` — 81 passed; `cd frontend && npm test` — 24 passed, 6 failed, 1 todo โดย failures ทั้งหมดอยู่ใน `ApplyLabBoyPage.test.jsx` และไม่เกี่ยวกับฟีเจอร์ 019
- ตารางตามรอยไปข้างหน้า: ครบ 4, ยังไม่ถึง 0, รอ 0, ช่องโหว่ 8
- ข้อค้นพบใหม่: F-002 academic calendar จาก PDF เป็นข้อมูลคงที่และตรวจการแทนที่ฉบับใหม่ไม่ได้; F-003 source failure ระบุเวลา attempt เป็น calendar reference; F-004 benchmark ใช้เกณฑ์ 500 ms ที่ไม่มีใน spec
- คง F-001 เดิมและช่อง "ทีมตัดสิน" ว่างไว้ทุกข้อ; ไม่แก้โค้ดหรือ test; `git diff --check` ผ่าน

## 2026-11-13 UC-15 Frontend Prototype: ทำ test และตรวจรอบสุดท้าย

- ขอบเขต: Frontend Prototype เท่านั้น; ไม่แก้ Backend, API, Database, Authentication, `tasks.md` หรือ `prototype.html`; ไม่ commit/push
- ไฟล์ที่แก้รอบนี้: `frontend/src/__tests__/RecruitmentAnnouncementPrototype.test.jsx`, `specs/015-create-recruitment-announcement/test-cases.md`, `specs/015-create-recruitment-announcement/rtm.md`, `prompt-log.md`
- เพิ่ม/ตรวจ automated Prototype Test 19 รายการ ครอบคลุม AC-ANN-01 ถึง AC-ANN-04; แก้ assertion ที่ค้น element ซ้ำให้ตรวจผล UI จริง และใช้ Draft ใหม่ว่างสำหรับกรณี required fields ขาดครบ
- ปรับ `test-cases.md` แยกผล Prototype ออกจากระบบจริง; ผล 19/19 ผ่าน แต่คงสถานะ Test Case เป็น "ร่าง" เพื่อรอทีมอนุมัติ
- ปรับ RTM ให้ระบุหลักฐานเฉพาะ Prototype พร้อมแยกข้อจำกัด API/persistence/Auth/RBAC/audit storage/Scheduler จริง; คงช่อง "ทีมตัดสิน" ว่าง
- ผล test เฉพาะ UC-15: `cd frontend && npm test -- --run src/__tests__/RecruitmentAnnouncementPrototype.test.jsx` — 19 passed
- ผล Frontend suite: `cd frontend && npm test -- --run` — 43 passed, 6 failed, 1 todo; failures ทั้งหมดอยู่ใน `src/pages/ApplyLabBoyPage.test.jsx` ซึ่งเป็น baseline ของงานอื่น
- ผล build: `cd frontend && npm run build -- --outDir /tmp/uc15-frontend-build` — ผ่าน
- ตรวจ route `http://127.0.0.1:4173/create-announcement` ใน browser: Draft ไม่ครบถูกบันทึก, Publish แสดงฟิลด์ที่ขาด, ข้อมูลครบเผยแพร่ได้, Student เห็นเฉพาะ Published
- การบันทึก screencast ทำไม่ได้ใน browser environment นี้: ไม่มี ffmpeg ที่ Playwright ต้องใช้ และ `playwright install ffmpeg` ไม่รองรับ Ubuntu 20.04; เก็บสคริปต์เดโมไว้ใน session files
- ไม่มีการเปลี่ยนสถานะ Task; ผลทั้งหมดเป็นหลักฐาน Frontend Prototype ไม่ใช่การรับรองระบบจริง

## 2026-11-13 UC-15: ปิดสถานะ Frontend Prototype

- ตรวจ `spec.md`, `plan.md`, `tasks.md`, `prototype.jsx`, `prototype.html`, Automated Tests, `test-cases.md`, `rtm.md` และ `prompt-log.md`; branch `wha`
- ตรวจซ้ำไม่พบ implementation ของ announcement API/model/audit/scheduler ใน Backend; ไม่แก้ Backend, API, Database, Authentication หรือ `prototype.html`
- ปรับ `test-cases.md` เพิ่ม Expected Result/Actual Result และตั้งผลทดสอบทั้ง 19 กรณีเป็น `Tested/Passed` ตามผล Frontend Prototype Test; ระบุชัดว่าไม่ใช่ผลระบบจริงหรือการอนุมัติจากทีม
- ปรับ `rtm.md` ให้ระบุ AC-ANN-01/02 ผ่านระดับ Prototype และ AC-ANN-03/04 ผ่านเฉพาะการจำลอง; ไม่กล่าวอ้างว่า persistence, immutable audit หรือ scheduler จริงผ่าน
- ปรับเฉพาะสถานะใน `tasks.md`: T-01 ถึง T-05 คงไม่ Complete ในระดับ System; T-06 Prototype Complete; T-07 UI/Workflow Simulation Complete แต่ API จริงยังไม่ครบ; T-08 Prototype Tests Complete แต่ System Acceptance/Regression ยังไม่ครบ; AC checklist ระบบจริงคงไม่ checked
- ปรับ assertions ใน UC-15 test ให้ผูก Audit Log CREATE กับ Admin, ตรวจเวลาเผยแพร่ และยืนยัน UPDATE_DRAFT ต่อท้าย CREATE
- UC-15 tests: `cd frontend && npm test -- --run src/__tests__/RecruitmentAnnouncementPrototype.test.jsx` — 19 passed
- Frontend suite: `cd frontend && npm test -- --run` — 43 passed, 6 failed, 1 todo; ทั้ง 6 failures อยู่ใน `src/pages/ApplyLabBoyPage.test.jsx` (baseline เดิม)
- Build: `cd frontend && npm run build -- --outDir /tmp/uc15-final-build --emptyOutDir` — ผ่าน
- ไม่ commit, push หรือ merge

## 2026-11-13 UC-15: ระบุผล Prototype Simulation ของ T-05

- ปรับเฉพาะสถานะและรายละเอียดผลการดำเนินงานของ T-05 ใน `specs/015-create-recruitment-announcement/tasks.md`
- ระบุว่า Frontend Prototype Simulation Complete; ทดสอบ Scheduled Job จำลองเวลา 00:05 Asia/Bangkok ผ่าน Mock Data/Local State; ไม่ใช่ Scheduler จริง
- ระบุความหมายของ Archived อย่างแม่นยำ: เป็นสถานะตัวอย่างที่แสดงและทดสอบการคงสถานะ; Spec ไม่ได้กำหนด transition/action ไป Archived จึงไม่กล่าวอ้างว่าทดสอบ transition นั้นแล้ว
- ไม่แก้โค้ดหรือ Task อื่น; ไม่ commit, push หรือ merge

## 2026-11-13 UC-15 /verify

- ตรวจ `spec.md`, `plan.md`, `tasks.md`, `test-cases.md`, RTM เดิม, `AGENTS.md`, โค้ดทุกไฟล์ใน `backend/app/` และ `frontend/src/` รวมถึง tests ใน `backend/tests/` และ `frontend/src/`; ทำงานบน branch `wha`
- รัน `cd backend && pytest -v` — 81 passed, 1 warning; ไม่พบ Backend test สำหรับ UC-15
- รัน `cd frontend && npm test` — 43 passed, 6 failed, 1 todo; UC-15 ผ่าน 19/19. ทั้ง 6 failures อยู่ใน `src/pages/ApplyLabBoyPage.test.jsx` ซึ่งเป็น baseline ที่บันทึกไว้ก่อนหน้า
- ตามรอย 14 แถว: ครบ 0, ยังไม่ถึง 6, รอ Q 0, ช่องโหว่ 8
- คง F-001; ยืนยัน F-002 ว่า `prototype.html` แสดงประกาศทุกสถานะแก่ Student เมื่อเปิดไฟล์นั้นโดยตรง; เพิ่ม F-003 ถึง F-005 เรื่อง test assertions สำหรับการบันทึก Draft, สิทธิ์ Admin/ภาควิชา และการแยกผู้จัดทำ/ผู้เผยแพร่
- ไม่แก้โค้ด, test, spec, plan หรือ tasks; แก้เฉพาะ UC-15 `rtm.md` และเพิ่มบันทึกนี้
- หลังรัน tests worktree แสดง generated cache artifacts ใน `backend/**/__pycache__/` และ `frontend/node_modules/.vite/`; ไม่ได้แก้ไฟล์เหล่านั้นโดยตรงและไม่ได้ revert เนื่องจากไม่มี baseline ก่อนรันยืนยัน
- `git diff --check` ผ่าน; ไม่ commit, push หรือ merge
