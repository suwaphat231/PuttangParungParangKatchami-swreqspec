# Prompt log

บันทึกคำสั่งและผลการทำงานกับ AI ต่อท้ายเรื่อย ๆ ไม่ลบรายการเดิม

---

## [2026-10-03] [08:30 UTC] คำสั่ง: /implement T-01 ถึง T-16

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-13 ตรวจสอบสถานะผู้ปฏิบัติงาน
- ขอบเขต: ทำ T-01 ถึง T-16 ตาม `spec.md`, `plan.md` และ `tasks.md` โดยไม่แก้ FR/AC และไม่ทำ UC อื่น

### ผลการทำงาน

- T-01: บังคับ role-scoping สำหรับ Department Staff, Instructor และ Admin ผ่าน API
- T-02 ถึง T-05: เพิ่ม in-memory worker records, status transitions, partial search/OR filters, timestamp และ status report
- T-06 ถึง T-10: เพิ่มหน้าค้นหา/กรอง, รายการสถานะ, no-results, รายละเอียด timestamp และ report UI
- T-11 ถึง T-14: เพิ่ม Backend/API และ Frontend acceptance tests
- T-15: เชื่อม App กับ API client ผ่าน Vite `/api` proxy
- T-16: เพิ่ม performance test สำหรับ 10,000 records

### Technical decisions ที่ใช้

- ใช้ deterministic in-memory data ตามคำยืนยันของทีม; ไม่เชื่อม PostgreSQL หรือสร้าง schema
- Production principal รับจาก trusted `request.state.principal`; dev mode ใช้ `UC13_AUTH_MODE=demo` และ environment configuration เท่านั้น ไม่รับ role จาก query/body
- Report นับ latest status ของ records ที่ช่วงปฏิบัติงานซ้อนกับช่วงที่ร้องขอ
- ไม่สร้าง login/authentication infrastructure หรือ external service

### ผลการทดสอบ

- Backend (`backend/`): `pytest -q` ผ่าน 17 tests, 1 Starlette/httpx deprecation warning
- T-16 performance: 10,000 records, search/filter ใช้เวลา 0.0628 วินาที (เกณฑ์ไม่เกิน 2 วินาที)
- Frontend (`frontend/`): `npm test` ผ่าน 8 tests
- Frontend (`frontend/`): `npm run build` ผ่าน
- Diagnostics ของไฟล์ Backend, Frontend และเอกสารที่แก้: ไม่พบ errors

### สิ่งที่เกือบต้องเดา

- Repo ไม่มี model/database หรือ production auth provider; ใช้ in-memory/demo principal ตามคำตัดสินใจของทีม
- รายงานใช้ช่วง work period overlap และ current status ตามข้อกำหนดสถานะล่าสุด; ไม่สร้างประวัติ status transitions เพิ่ม

---

## [2026-10-03] [09:10 UTC] คำสั่ง: /tasks 14-14-review-student-documents/spec.md

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-14 ตรวจสอบเอกสารนักศึกษา
- ขอบเขต: แตก `spec.md` และ `plan.md` เป็น `tasks.md` โดยไม่นำโค้ดหรือ requirement ใหม่

### ผลการทำงาน

- สร้างไฟล์ [specs/14-14-review-student-documents/tasks.md](specs/14-14-review-student-documents/tasks.md)
- จำนวน task ทั้งหมด: 8 task
- จำนวน task ที่รอ Q-xx: 0 task
- Q-01 และ Q-02 ใน spec อยู่ในสถานะปิดแล้ว ตาม ASM-Q1-01, ASM-Q1-02 และ ASM-Q2-01 จึงไม่ก่อให้เกิดงานค้าง

### สิ่งที่ได้จากการแยกงาน

- task ที่ยากที่สุดคือ T-03 เพราะต้องรวม validation, notification, และ confirmation logic ให้มั่นใจว่าไม่สามารถส่งกลับแก้ไขโดยไม่มีเหตุผลและเอกสารที่มีปัญหาได้
- AC ที่ทดสอบยากที่สุดคือ AC-OFC-03 เพราะต้อง simulation ของกระบวนการส่งกลับเพื่อแก้ไขที่มีหลายเงื่อนไข: ต้องมีเอกสารที่มีปัญหา, ต้องระบุเหตุผล, ต้องกดยืนยันแบบครบถ้วน, และต้องส่งแจ้งเตือนทั้งแอปและอีเมล

### ข้อเสนอการทดสอบแบบย่อสำหรับทีม

- AC-OFC-03: ใช้ test case ที่คัดกรอง 3 scenario: (1) ไม่มีเอกสารที่มีปัญหา, (2) มีเอกสารแต่ไม่มีเหตุผล, (3) มีทั้งสองอย่างครบถ้วนแล้วยืนยันส่งกลับ; ตรวจว่า form ปฏิเสธ/อนุญาตตามลำดับ และ notification ถูกสร้าง
- AC-OFC-02: ใช้ fixture ของใบสมัคร 1 ใบที่มีเอกสาร 3 รายการ ตรวจว่าผลตรวจสอบแต่ละสถานะ, effect on audit log, และ UI แสดงค่าล่าสุดได้ตรงตามรอบการตรวจ
- AC-OFC-01: ใช้ประกาศรับสมัคร 1 ฉบับที่กำหนด checklist 4 รายการ แล้วเปิดใบสมัครตรวจว่าค checklist ถูก auto-generated อย่างครบถ้วน

### สรุป

การแยก task เสร็จแล้วตามหลัก traceability Requirement → AC → Task โดยไม่มีการสร้าง ID ใหม่ และไม่มี task ใดที่ต้องรอ Open Question เนื่องจากเหตุการณ์ที่กำกวมหรือคำถามใน spec ได้ถูกปิดแล้ว

---

## [2026-10-03] [09:15 UTC] คำสั่ง: /implement UC-14 ตรวจสอบเอกสารนักศึกษา T-01 ถึง T-08

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-14 ตรวจสอบเอกสารนักศึกษา
- ขอบเขต: ปฏิบัติตาม `specs/14-14-review-student-documents/spec.md`, `plan.md`, และ `tasks.md` โดยไม่เพิ่ม feature นอก scope และไม่สร้าง ID ใหม่

### ผลการทำงาน

- T-01: เพิ่ม backend checklist generation และ access enforcement สำหรับใบสมัครใน workflow ตรวจสอบเอกสาร
- T-02: เพิ่มการบันทึกผลตรวจสอบและ audit trail การตรวจสอบต่อใบสมัคร
- T-03: เพิ่ม validation สำหรับสถานะ "ส่งกลับเพื่อแก้ไข" ให้ต้องมีเอกสารที่มีปัญหาและเหตุผลก่อนยืนยัน และสร้าง notification ทั้งในแอปและอีเมล
- T-04: ใช้ trusted principal / RBAC ที่สอดคล้องกับพฤติกรรมเดิมของ repo และกันการส่ง role จาก request body/query
- T-05: สร้าง UI ตรวจสอบเอกสารนักศึกษา พร้อมโหลด checklist อัตโนมัติ และแสดงสถานะ/ผลตรวจสอบ
- T-06: เพิ่มฟอร์มส่งผลตรวจสอบและ validation สำหรับการกลับมาปรับปรุงเอกสาร
- T-07: เพิ่มการแสดง audit log และข้อมูลใบสมัครให้สอดคล้องกับกระบวนการตรวจสอบเอกสาร
- T-08: เพิ่ม tests backend/frontend สำหรับ UC-14 และตรวจสอบการทำงานต่อไปนี้: checklist generation, validation, audit log, และ review submission

### กำหนดทางเทคนิคที่ใช้

- ใช้ FastAPI backend ที่มีอยู่ และเรียกใช้ `request.state.principal` อย่างถูกต้องตาม pattern เดิมของ repo
- ใช้ React/Vite frontend ที่มีอยู่ สำหรับหน้าตรวจสอบเอกสาร โดยคงโครงสร้าง API client เดิมให้สอดคล้องกับ UC-13
- ไม่เพิ่ม schema ฐานข้อมูลใหม่หรือ auth flow ใหม่ เพราะ spec ไม่กำหนด และทีมยืนยันให้ใช้ in-memory demo data ตาม pattern ของ repository

### ผลการทดสอบ

- Backend: `cd backend && pytest -q` ผ่าน 20 tests
- Frontend: `cd frontend && npm test -- --run` ผ่าน 11 tests ใน 4 files
- Frontend build: `cd frontend && npm run build` ผ่าน
- Diagnostics: โหมด lint/compile ของ project ที่เกี่ยวข้องไม่มี errors ที่ชัดเจนในหน้าต่าง Problems

### ข้อสรุป

การ implement UC-14 จบแล้วตามสเปคและ plan ที่กำหนด โดยยึดหลัก traceability และไม่เพิ่ม requirement นอก scope การทดสอบ backend/frontend และ build ได้ผ่านตามเกณฑ์ที่ระบุไว้

---

## [2026-10-03] [09:27 UTC] คำสั่ง: เปิดหน้า UC-14 และเตรียม commit

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-14 ตรวจสอบเอกสารนักศึกษา
- ขอบเขต: ตั้งหน้า UC-14 เป็นหน้าเริ่มต้น ตรวจสอบ audit trail, validation, และ RBAC ก่อน commit

### การแก้ไขเพิ่มเติม

- ตั้ง `App` ให้เปิดหน้า UC-14 และปรับ integration test ให้ตรวจ checklist บนหน้าเริ่มต้น โดย test ของ UC-13 ยังผ่านแยกต่างหาก
- เพิ่ม Vite API proxy target แบบกำหนดผ่าน environment variable ได้ โดยค่าเริ่มต้นยังเป็น port 8000; preview นี้ใช้ backend port 8001 เนื่องจาก port 8000 มีบริการเดิมอยู่
- ส่ง timestamp และ audit log จาก checklist/review API เพื่อแสดงสถานะล่าสุดและประวัติการตรวจสอบใน UI
- บังคับให้ระบุเอกสารที่มีปัญหาและเหตุผลก่อนส่งกลับ โดย UI ไม่เลือกเอกสารแทนผู้ใช้ และบังคับเหตุผลเมื่อผลเป็นไม่ผ่าน
- จำกัดให้ student อ่านใบสมัครของตนเองได้แต่ไม่สามารถบันทึกผลตรวจของเจ้าหน้าที่ และเพิ่ม test ครอบคลุม role scope
- อัปเดตสถานะ T-01 ถึง T-08 เป็นเสร็จแล้วตาม implementation และผลทดสอบ

### ผลการตรวจสอบ

- Backend: `cd backend && pytest -q` ผ่าน 21 tests; มี 1 Starlette/httpx deprecation warning
- Frontend: `cd frontend && npm test -- --run` ผ่าน 11 tests ใน 4 files
- Frontend build: `cd frontend && npm run build` ผ่าน
- Diagnostics ของ backend/frontend: ไม่พบ errors

### ข้อสรุป

UC-14 เปิดจากหน้าแรกได้ พร้อม checklist, audit trail, validation และ role scope ตาม spec โดยไม่ stage ไฟล์ build/cache ที่เกิดจากการทดสอบ
