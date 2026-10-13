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

## 2569-10-13 คำสั่ง: /testcases AC-STS-02 /specs/003-view-application-status

- โหมด: ร่าง เนื่องจากยังไม่มี `test-cases.md` สำหรับฟีเจอร์นี้ และ task T-03 ที่ตรวจด้วย AC-STS-02 อยู่สถานะ `เสร็จ รอทีมตรวจ`
- ไฟล์ที่สร้าง: `specs/003-view-application-status/test-cases.md`
- TC ID ที่เสนอ: `TC-STS-02-1`, `TC-STS-02-2`, `TC-STS-02-3`
- ผลลัพธ์: เสนอ 3 แถว ครบทางปกติ ทางขอบ และทางผิด ทุกแถวสถานะ `ร่าง`; ยังไม่ได้เขียนหรือรันโค้ด test
- ข้อจำกัด/คำถาม: spec ไม่ได้ระบุค่าขอบเขตเวลาและพฤติกรรมเมื่อไม่มีใบสมัคร จึงระบุไว้ในแถวทดสอบและยังไม่เดาคำตอบแทนทีม
