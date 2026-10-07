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

---

## [2026-10-03] [09:45 UTC] คำสั่ง: /tasks specs/15-15-create-recruitment-announcement/spec.md

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-15 จัดทำประกาศรับสมัคร
- ขอบเขต: แตก `spec.md` และ `plan.md` เป็น `tasks.md` โดยยึดหลัก traceability และไม่เพิ่ม requirement / ID ใหม่

### ผลการทำงาน

- สร้างไฟล์ [specs/15-15-create-recruitment-announcement/tasks.md](specs/15-15-create-recruitment-announcement/tasks.md)
- จำนวน task ทั้งหมด: 8 task
- จำนวน task ที่รอ Q-xx: 0 task
- Status ของ spec อยู่ที่ Draft v2 จึงถือว่า clarified แล้วและไม่จำเป็นต้องหยุดเพื่อรอคำถามเพิ่มเติม

### สิ่งที่ได้จากการแยกงาน

- task ที่ยากที่สุดคือ T-04 เพราะต้องรวมประวัติ audit log, metadata ของผู้จัดทำ/ผู้เผยแพร่, และ append-only behavior ให้สอดคล้องกับ NFR-AUD-01 และ AC-ANN-03 พร้อมกัน
- task ที่ทดสอบยากที่สุดคือ AC-ANN-02 เพราะต้องคุยกับ vəziความไม่ครบและค่าที่ขาดหลายฟิลด์พร้อมกัน จึงต้องมี test case สำหรับ missing field combinations และ message ที่แสดงรายการฟิลด์ที่ขาดอย่างชัดเจน

### ข้อเสนอการทดสอบแบบย่อสำหรับทีม

- AC-ANN-02: ใช้ scenario ที่ส่งประกาศเมื่อขาดเฉพาะ 1 ฟิลด์, 2 ฟิลด์, และครบทุกฟิลด์; ตรวจว่า API เรียกคืนข้อผิดพลาดและ UI แสดงรายการที่ขาดทุกรอบอย่างถูกต้อง
- AC-ANN-03: ใช้ fixture ของผู้ใช้ 2 role (Department Staff และ Admin) ตรวจว่า operator_id, operator_role, timestamp, changed_fields ถูกบันทึกอย่างครบถ้วนและ immutable โดยเพิ่ม log entry ใหม่ไม่ลบ/แก้ข้อมูลเดิม
- AC-ANN-01: ใช้บททดสอบสร้าง Draft ตาม template พร้อม check status = Draft และการซ่อนข้อมูลจากนักศึกษาในช่วงยังไม่ได้เผยแพร่

### สรุป

การแยก tasks สำหรับ UC-15 เสร็จสิ้นตาม spec และ plan โดยไม่เพิ่ม requirement อื่นนอก scope และไม่มี task ใดที่ต้องรอ Open Question เนื่องจาก Q-01 ได้รับการยืนยันแล้วว่าทำงานแบบ RBAC โดยไม่มี approval ขั้นกลาง

---

## [2026-10-03] [09:50 UTC] คำสั่ง: Implement UC-15 recruitment announcement (T-01 ถึง T-08)

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-15 จัดทำประกาศรับสมัคร
- ขอบเขต: ปฏิบัติตาม `spec.md`, `plan.md`, `tasks.md`, และ `AGENTS.md` โดยไม่เพิ่ม feature นอก scope และไม่สร้าง ID ใหม่

### ผลการทำงาน

- T-01: เพิ่ม backend store และ contract สำหรับ announcement model
- T-02: สร้างประกาศแบบ Draft โดยใช้ template และ status Draft
- T-03: ตรวจ required publish fields ก่อนเผยแพร่ พร้อม error payload ที่ระบุ missing_fields
- T-04: เพิ่ม audit log append-only พร้อม operator_id, operator_role, timestamp, changed_fields
- T-05: เพิ่ม lifecycle Draft → Published → Expired และ refresh expiry ตาม end_date
- T-06: สร้าง frontend form สำหรับ Draft and publish workflow
- T-07: ต่อหน้าจอกับ API จริง และแสดงการปฏิเสธ/เผยแพร่ตาม state
- T-08: เพิ่ม acceptance tests backend/frontend สำหรับ AC-ANN-01 ถึง AC-ANN-03

### ผลการทดสอบ

- Backend: `cd backend && pytest -q` ผ่าน 26 tests
- Frontend: `cd frontend && npm test -- --run` ผ่าน 14 tests ใน 5 files
- Frontend build: `cd frontend && npm run build` ผ่าน
- Diagnostics ของไฟล์ที่เกี่ยวข้อง: ไม่พบ errors

### สรุป

UC-15 ดำเนินการเสร็จแล้วตาม requirement และ plan โดยคงความเข้ากันของ UC-13 และ UC-14 ไว้ ไม่เพิ่ม workflow อนุมัติกลาง และตรวจสอบ RBAC, audit log, lifecycle, และ published visibility ตาม spec
---

## [2026-10-03] [09:56 UTC] คำสั่ง: /tasks specs/16-16-track-payment/spec.md

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-16 ติดตามและตรวจสอบการจ่ายเงิน
- ขอบเขต: แตก `spec.md` และ `plan.md` เป็น `tasks.md` โดยยึด traceability, ไม่เพิ่ม requirement หรือ ID ใหม่, และคง Open Question Q-01 ไว้เป็นงานที่ต้องรอคำตอบ

### ผลการทำงาน

- สร้างไฟล์ [specs/16-16-track-payment/tasks.md](specs/16-16-track-payment/tasks.md)
- จำนวน task ทั้งหมด: 7 task
- จำนวน task ที่รอ Q-xx: 1 task (T-04 รอ Q-01)
- Status ของ spec อยู่ที่ Draft v1 จึงมีคำเตือนว่า still requires clarification; task ที่เกี่ยวข้องกับคำถาม Q-01 ถูกคงไว้เป็นสถานะรอ Q-01 ตามกฎไม่เดา

### สิ่งที่ได้จากการแยกงาน

- task ที่ยากที่สุดคือ T-03 เพราะต้องรวม RBAC, Audit Log, และการจำกัด scope ของข้อมูลการเงินให้สอดคล้องกับ 4 บทบาทที่กำหนดไว้
- AC ที่ทดสอบยากที่สุดคือ AC-PAY-04 และ AC-PAY-05 เพราะต้องใช้ role-scoped data และ audit trail ที่สามารถตรวจได้จริงในสภาพแวดล้อมที่มีผู้ใช้งานหลายบทบาทพร้อมกัน

### ข้อเสนอการทดสอบแบบย่อสำหรับทีม

- AC-PAY-04: ใช้ fixture 3 role (Lab Boy, Instructor, Department Staff) และตรวจว่าคำขอเข้าถึงข้อมูลจ่ายเงินของแต่ละ role คืนผลตามสิทธิ์เท่านั้น โดยไม่มีข้อมูลข้ามภาควิชา/ข้ามคน
- AC-PAY-05: ตั้งค่า audit log แล้วเรียกดูรายการ 3-5 ครั้งจาก role เดียวกัน ตรวจว่า log record มี actor, timestamp, resource, access outcome, และไม่ซ้ำ/หายระหว่างการเรียกดู
- AC-PAY-02: ใช้ incoming financial record ที่มีสถานะ "ยังไม่จ่าย" และ "ข้อมูลผิดปกติ" ตรวจว่ารายการติด flag ชัดเจนและไม่ถูกบิดเบือนใน UI

---

## [2026-10-03] [09:58 UTC] คำสั่ง: /tasks specs/022-notify-user/spec.md

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: แจ้งเตือนผู้ใช้งาน
- ขอบเขต: แตก `spec.md` และ `plan.md` เป็น `tasks.md` โดยยึดหลัก traceability, ไม่เพิ่ม requirement หรือ ID ใหม่, และคง Q-01 ไว้ในสถานะที่ได้รับคำตอบแล้วเนื่องจาก spec ระบุว่าช่องทางรองรับเฉพาะ notification ภายในระบบเท่านั้น

### ผลการทำงาน

- สร้างไฟล์ [specs/022-notify-user/tasks.md](specs/022-notify-user/tasks.md)
- จำนวน task ทั้งหมด: 6 task
- จำนวน task ที่รอ Q-xx: 0 task
- Status ของ spec อยู่ที่ Draft v1 แต่ Q-01 ได้ถูกตอบแล้วว่า "notification ในระบบเท่านั้น" จึงไม่จำเป็นต้องค้างงานเพราะคำถามดังกล่าวถูก clarify แล้ว

### สิ่งที่ได้จากการแยกงาน

- task ที่ยากที่สุดคือ T-04 เพราะต้องรวม logic เลือกช่องทาง, การบันทึกสถานะ, และ retry ให้สอดคล้องกับ AC-MSG-02 และ AC-MSG-03 พร้อมกัน
- AC ที่ทดสอบยากที่สุดคือ AC-MSG-03 เพราะต้องจำลองสถานะช่องทางไม่พร้อมและค่า failed/queued ที่ต่างกันพร้อมกัน รวมถึง retry policy และ audit trail ของการพยายามส่ง

### ข้อเสนอการทดสอบแบบย่อสำหรับทีม

- AC-MSG-03: ใช้ fixture 3 กรณีคือ (1) ส่งสำเร็จทันที, (2) ช่องทางไม่พร้อมและระบบบันทึก failed/queued, (3) retry ตาม policy และตรวจว่ามี timestamp และเหตุผลของการพยายามส่งครบถ้วน
- AC-MSG-02: ใช้ผู้ใช้ที่เปิดใช้งาน notification และผู้ใช้ที่ปิดการแจ้งเตือน/ไม่มีข้อมูลช่องทาง จากนั้นตรวจว่า API/UI เลือกช่องทางที่อนุญาตและไม่ส่งเข้าสู่ช่องทางที่ปิด
- AC-MSG-04: ใช้ข้อความที่มีข้อมูลส่วนบุคคลหลัก เช่น ชื่อ, รหัสนักศึกษา, ผลการสมัคร แล้วตรวจว่าภาพรวมข้อความลดข้อมูลให้เหลือเฉพาะสิ่งที่จำเป็นต่อเหตุการณ์

### สรุป

การแยก tasks สำหรับ UC-22 เสร็จสิ้นตาม spec และ plan โดยไม่มีการเพิ่ม requirement หรือ ID ใหม่ และไม่มี task ใดที่ต้องรอ Open Question เนื่องจาก Q-01 ได้รับการยืนยันแล้วว่าช่องทางที่รองรับเป็น notification ภายในระบบเท่านั้น

---

## [2026-10-03] [10:15 UTC] คำสั่ง: /tasks specs/019-check-work-time/spec.md

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-19 ตรวจสอบวันและเวลาปฏิบัติงาน
- ขอบเขต: แตก `spec.md` และ `plan.md` เป็น `tasks.md` โดยใช้ traceability ครบทุก AC และไม่เพิ่ม requirement หรือ ID ใหม่

### ผลการทำงาน

- สร้างไฟล์ [specs/019-check-work-time/tasks.md](specs/019-check-work-time/tasks.md)
- จำนวน task ทั้งหมด: 7 task
- จำนวน task ที่รอ Q-xx: 0 task
- Status ของ spec อยู่ที่ Draft v2 จึงถือว่า clarified แล้วและไม่มีงานค้างที่ต้องรอคำถามเพิ่มเติม

### สิ่งที่ได้จากการแยกงาน

- task ที่ยากที่สุดคือ T-03 เพราะต้องรวม overlap logic, policy ของวันหยุดและช่วงที่ห้ามปฏิบัติงาน, และเหตุผลที่ชัดเจนให้ครบทั้งแบบ partial overlap และ full-day blocking
- AC ที่ทดสอบยากที่สุดคือ AC-CAL-02 และ AC-CAL-03 เพราะต้องจำลองข้อมูลปฏิทินที่มีวันหยุดและสถานะไม่พร้อมใช้งานพร้อมกัน โดยต้องตรวจว่าผลลัพธ์เป็น FAIL ทันทีและไม่อนุญาตให้ผ่านแม้มีบางส่วนของช่วงระหว่างที่ไม่ได้รับอนุญาต

### ข้อเสนอการทดสอบแบบย่อสำหรับทีม

- AC-CAL-02: ใช้ fixture 3 กรณี: ช่วงปฏิบัติงานไม่ทับวันหยุด, ทับเพียงบางส่วน, และทับทั้งวัน; ตรวจว่าผลตอบกลับเป็น FAIL เมื่อ overlap เกิดขึ้นแม้เพียงบางส่วน และ reason ระบุวันหยุดหรือช่วงที่ห้ามปฏิบัติงานอย่างชัดเจน
- AC-CAL-03: ใช้ mock calendar source ที่คืนค่า null, stale timestamp, และ unavailable payload; ตรวจว่าระบบส่ง FAIL ทันทีและไม่ให้ status = PASS ในทุกกรณี
- AC-CAL-04 / AC-CAL-05: ใช้ข้อมูลปฏิทินปกติที่เป็นปัจจุบันและช่วงที่อนุญาตอย่างเดียว ตรวจว่า response JSON มี status, reason, calendarVersion, effectiveDate และไม่มีข้อมูลที่ขาดหาย

### สรุป

งานแยก task สำหรับ UC-19 เสร็จสมบูรณ์ตาม spec และ plan โดยยึด traceability ระหว่าง requirement → AC → task และไม่เพิ่ม requirement นอก scope หรือสร้าง ID ใหม่

### สรุป

การแยก task สำหรับ UC-16 เสร็จสิ้นตาม spec และ plan โดยคง Open Question Q-01 ไว้เป็น task ที่ต้องรอคำยืนยัน และไม่ได้เพิ่ม requirement นอก scope

---

## [2026-10-03] [10:10 UTC] คำสั่ง: Resolve merge state for UC-16 branch

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-16 ติดตามและตรวจสอบการจ่ายเงิน
- ขอบเขต: ตรวจสอบและยืนยันสถานะ merge ของ branch ให้สอดคล้องกับผลลัพธ์ของ UC-16 โดยไม่เพิ่ม requirement ใหม่และไม่สร้าง ID ใหม่

### ผลการทำงาน

- ตรวจสอบคอนฟิกและสเตทัสของ branch ทั้ง backend/frontend พบว่าเงื่อนไข UC-16 และ API integration 已อยู่ในสถานะที่ยอมรับได้แล้ว
- ปรับ metadata ของหน้าเริ่มต้นให้ตรงกับ UC-16 โดยเปลี่ยน document title จาก "ตรวจสอบสถานะผู้ปฏิบัติงาน" เป็น "ติดตามและตรวจสอบการจ่ายเงิน"
- ยืนยันว่า App, API client, Vite proxy, และ smoke test สำหรับ UC-16 ตรงกับ flow ที่ถูกสร้างไว้ก่อนหน้า

### ผลการทดสอบ

- Backend: `cd backend && pytest -q` ผ่าน 32 tests
- Frontend: `cd frontend && npm test -- --run` ผ่าน 18 tests

### สรุป

Branch ในสถานะที่พร้อมดำเนินการต่อแล้ว โดยไม่มี unresolved conflict markers ใน working tree และ metadata ของหน้าเริ่มต้นสอดคล้องกับ UC-16 ที่กำหนดไว้ใน spec
---
วันที่: 2026-10-02
คำสั่ง: /tasks specs/001-apply-lab-boy/spec.md
ผลลัพธ์: สร้างไฟล์ `specs/001-apply-lab-boy/tasks.md` สำหรับ feature สมัครเป็น Lab Boy พร้อมสรุป 9 task และ 4 task ที่รอ Open Questions (Q-01 ถึง Q-04) และจัดทำตารางตรวจความครบ AC/Constraint ให้ครอบคลุมตาม spec
---
---
วันที่: 2026-10-02
คำสั่ง: /implement T-01 specs/001-apply-lab-boy/tasks.md
สถานะ: ถูกบล็อกก่อนเริ่มพัฒนา เพราะ task T-01 มีสถานะ `รอ Q-03` ตาม `tasks.md` และกติกาใน `prompt_implement.md` ระบุว่าต้องหยุดเมื่อ task ในสถานะ `รอ Q-xx`
ไฟล์ที่พยายามใช้: ไม่มี (ไม่เริ่มเขียนโค้ด)
ผล test: ไม่มีการรันเนื่องจาก task ถูกบล็อกก่อนเริ่ม
สิ่งที่เกือบต้องเดา: รูปแบบเลขใบสมัครและรูปแบบแสดงวันเวลา (Q-03) แต่ต้องถามแทนเพื่อไม่ละเมิด spec
---
---
วันที่: 2026-10-02
คำสั่ง: /tasks specs/002-view-recruitment/spec.md
ผลลัพธ์: สร้างไฟล์ `specs/002-view-recruitment/tasks.md` สำหรับ feature ดูประกาศรับสมัคร โดยใช้สมมติฐานที่ทีมเลือกว่า “รองรับการค้นหา/กรองด้วยรายวิชาและภาคการศึกษา” เนื่องจาก spec ยังอยู่ในสถานะ Draft v1 และ Open Question Q-01 ยังไม่คลี่คลาย แต่ผู้ใช้ยืนยันให้ทำต่อตามสมมติฐานนี้
---
---
วันที่: 2026-10-02
คำสั่ง: /tasks specs/003-view-application-status/spec.md
ผลลัพธ์: สร้างไฟล์ `specs/003-view-application-status/tasks.md` สำหรับ feature ดูสถานะการสมัคร โดยวิเคราะห์จาก spec, plan และความจริงว่ามีไม่มี Open Question ต้องรอใน feature นี้
---
---
วันที่: 2026-10-02
คำสั่ง: /tasks specs/004-login/spec.md
ผลลัพธ์: สร้างไฟล์ `specs/004-login/tasks.md` สำหรับ feature เข้าสู่ระบบ โดยใช้เวอร์ชัน spec ที่รวม merge conflict ระหว่าง Draft v1/v2 และเลือกแก้ไขตามโครงสร้าง final merged โดยไม่เพิ่ม requirement ใหม่ นอกเหนือจากที่ spec ระบุ
---
---
วันที่: 2026-10-02
คำสั่ง: /implement T-01 specs/004-login/tasks.md
ไฟล์ที่สร้าง/แก้: `backend/app/models/user.py`, `backend/app/models/session.py`, `backend/app/services/auth_policy.py`, `backend/tests/test_auth_policy.py`
ผล test: `cd backend && pytest tests/test_auth_policy.py -q` → 3 passed in 0.02s
สิ่งที่เกือบต้องเดา: ไม่มี; ใช้ความจริงจาก spec ว่า session หมดอายุ 120 นาที และ lockout 5 ครั้ง/15 นาที เป็นหลักสำหรับ policy และ model
---
---
วันที่: 2026-10-02
คำสั่ง: /implement T-03 specs/003-view-application-status/tasks.md
ไฟล์ที่สร้าง/แก้: `backend/app/controllers/application_detail_controller.py`, `frontend/src/components/ApplicationStatusDetail.jsx`, `backend/tests/test_application_detail_controller.py`
ผล test: `cd backend && pytest tests/test_application_detail_controller.py -q` → 2 passed in 0.02s
สิ่งที่เกือบต้องเดา: ไม่มี; ค่าทำงานสอดคล้องกับ spec ที่ระบุว่า “แสดงสถานะล่าสุดและเวลาอัปเดตเป็นเวลา Asia/Bangkok” และ “โหลดข้อมูลสถานะล่าสุดเมื่อเปิดหน้าใหม่”
---
---
วันที่: 2026-10-02
คำสั่ง: /implement T-01 specs/002-view-recruitment/tasks.md
ไฟล์ที่สร้าง/แก้: `backend/app/models/announcement.py`, `backend/app/services/announcement_status_service.py`, `backend/tests/test_announcement_status_service.py`
ผล test: `cd backend && pytest tests/test_announcement_status_service.py -q` → 3 passed in 0.03s
สิ่งที่เกือบต้องเดา: ไม่มี; กำหนดสถานะประกาศและเงื่อนไขการแสดงรายการตาม spec และ plan ได้ตรงตามสัญญาเรื่อง `เปิดรับสมัคร`, `เต็ม`, `ปิดรับสมัคร`
---

---
## [2026-10-03] [10:31 UTC] คำสั่ง: Resolve merge conflicts before integrating UC-16 into main

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-16 ติดตามและตรวจสอบการจ่ายเงิน
- ขอบเขต: แก้ merge conflicts ระหว่าง branch `wha` กับ `main` โดยรักษา implementation UC-16 และประวัติเดิมของทั้งสองฝั่ง

### ผลการทำงาน

- คงหน้า UC-16, smoke test, API client สำหรับ UC-13 ถึง UC-16 และ Vite proxy configuration จาก branch ที่พัฒนา
- รวม metadata lockfile ที่เพิ่มจาก `main` และเก็บรายการ prompt log ทั้งสองฝั่งโดยนำเฉพาะ conflict markers ออก
- ไม่แก้ไข requirement หรือสร้าง ID ใหม่

### ผลการทดสอบ

- Backend: `cd backend && pytest -q` ผ่าน 40 tests; มี 1 Starlette/httpx deprecation warning
- Frontend: `cd frontend && npm test -- --run` ผ่าน 18 tests ใน 6 files

### สรุป

แก้ conflict ครบและตรวจสอบ tests ผ่าน เตรียมรวมผลลัพธ์เข้ากับ `main`

---

## [2026-10-03] [10:00 UTC] คำสั่ง: /tasks specs/018-approve-access/spec.md

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-18 อนุมัติสิทธิ์การเข้าใช้งาน
- ขอบเขต: แตก `spec.md` และ `plan.md` เป็น `tasks.md` โดยยึด traceability, ไม่เพิ่ม requirement หรือ ID ใหม่, และคง Open Questions ไว้เป็นงานที่ค้าง

### ผลการทำงาน

- สร้างไฟล์ [specs/018-approve-access/tasks.md](specs/018-approve-access/tasks.md)
- จำนวน task ทั้งหมด: 5 task
- จำนวน task ที่รอ Q-xx: 1 task (T-05 รอ Q-01)
- Status ของ spec อยู่ที่ Draft v2; จึงเตือนว่า requirement ยังไม่มีการ clarify บางส่วนและ task ที่เกี่ยวข้องกับ Q-01 ถูกคงไว้เป็นสถานะรอ Q-01 ตามกฎไม่เดา

### สิ่งที่ได้จากการแยกงาน

- task ที่ยากที่สุดคือ T-02 เพราะต้องรวม validation ของ role matrix, การปฏิเสธคำขอที่ไม่ได้รับอนุญาต, และข้อความแจ้งข้อผิดพลาดที่ต้องสอดคล้องกับ AC-IAM-02
- AC ที่ทดสอบยากที่สุดคือ AC-IAM-05 เพราะต้องจำลองผู้ใช้ที่ไม่มี approver privilege และตรวจว่าระบบปฏิเสธการอนุมัติ/ปฏิเสธอย่างเคร่งครัด โดยไม่บันทึกผลการพิจารณาใด ๆ

### ข้อเสนอการทดสอบแบบย่อสำหรับทีม

- AC-IAM-05: ใช้ fixture 2 role (normal user และ approver) แล้วลองอนุมัติ/ปฏิเสธจาก user ที่ไม่ใช่ approver ตรวจว่า response ปฏิเสธทันทีและไม่มี audit entry ใหม่
- AC-IAM-02: ใช้คำขอที่มีบทบาทหรือสิทธิ์อยู่นอกรายการอนุญาต 3 แบบ (บทบาทผิด, สิทธิ์ผิด, ทั้งสองผิด) ตรวจว่า message และ state ที่ส่งกลับตรงตาม requirement
- AC-IAM-03 และ AC-IAM-04: ใช้ workflow approve/reject แบบต่อเนื่องใน same request เพื่อยืนยันว่าสถานะ, ผู้อนุมัติ, เวลา, และเหตุผลถูกบันทึกอย่างครบถ้วนและไม่ละเมิด lockout rule

### สรุป

แยก tasks สำหรับ UC-18 เสร็จแล้วตาม spec และ plan โดยใช้ traceability ของ FR → AC → Task และคงงานที่เกี่ยวกับ Open Question ไว้เป็นสถานะรอ Q-01 เพื่อหลีกเลี่ยงการเดาผลลัพธ์ที่ยังไม่ผ่าน clarify

---

## [2026-10-03] [10:50 UTC] คำสั่ง: /tasks specs/020-send-notification/spec.md

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-20 ส่งคำขอแจ้งเตือน
- ขอบเขต: แตก `spec.md` และ `plan.md` เป็น `tasks.md` โดยยึด traceability, ไม่เพิ่ม requirement หรือ ID ใหม่, และคง warning ว่า spec ยังอยู่ใน Draft v1 จึงควร clarify ก่อน production implementation

### ผลการทำงาน

- สร้างไฟล์ [specs/020-send-notification/tasks.md](specs/020-send-notification/tasks.md)
- จำนวน task ทั้งหมด: 6 task
- จำนวน task ที่รอ Q-xx: 0 task
- Status ของ spec อยู่ที่ Draft v1 จึงมีคำเตือนว่า still requires clarification ก่อนเริ่ม implement จริงจัง แต่ task ถูกแยกตาม requirement และ plan ที่มีอยู่เพื่อให้ทีมใช้ต่อได้ทันที

### สิ่งที่ได้จากการแยกงาน

- task ที่ยากที่สุดคือ T-03 เพราะต้องรวม asynchronous dispatch, non-blocking flow, และ contract การส่งคำขอให้มั่นใจว่าธุรกรรมหลักไม่หยุดรอผลจากระบบแจ้งเตือน
- AC ที่ทดสอบยากที่สุดคือ AC-NOT-01 เพราะต้องตรวจทั้ง payload ที่มีข้อมูลจำเป็นเพียงพอและประสิทธิภาพที่ธุรกรรมหลักต้องไม่ติดค้างรอ external delivery

### ข้อเสนอการทดสอบแบบย่อสำหรับทีม

- AC-NOT-01: ใช้ fixtures ของเหตุการณ์ที่ต้องแจ้งเตือน (สมัคร/อนุมัติ/แจ้งผล) และตรวจว่า payload มี event, recipient, metadata ที่จำเป็นเพียงพอ และธุรกรรมหลักคืนผลก่อน external response
- AC-NOT-02: mock ระบบแจ้งเตือนให้ล้ม 3 รอบแรก แล้วตรวจว่า item ถูกเก็บใน queue/history และ retry กลับมาทำงานตาม backoff 1s/2s/4s ตาม policy
- AC-NOT-01/02: ควรมีการทดสอบทั้งชุด request/response payload และชุด retry behavior การล้มเหลวเพื่อยืนยันความต่อเนื่องของระบบ

### สรุป

การแยก task สำหรับ UC-20 เสร็จสิ้นตาม spec, plan, และกฎ traceability ของระบบ โดยไม่สร้าง requirement หรือ ID ใหม่ และยังคงย้ำ warning ว่าสเปคยังอยู่ใน Draft v1 จึงควรมีการ clarify ก่อนเริ่มพัฒนาในสภาพแวดล้อม production จริง

---

## [2026-10-03] [10:45 UTC] คำสั่ง: /tasks specs/018-approve-access/spec.md (แก้รอบที่ 1)

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-18 อนุมัติสิทธิ์การเข้าใช้งาน
- ขอบเขต: ปรับ `tasks.md` ตามคำตัดสินของทีม: Q-01 ต้องมีสถานะชัดเจนรอ T-05, Q-02 แก้ได้เลย, Q-03 ขยายคำถามให้ชัดเจนขึ้น, Q-04 แจ้งผ่านระบบแจ้งเตือนภายในระบบเท่านั้น

### การแก้ไข

- ปรับจำนวน task จาก 5 เป็น 6 โดยเพิ่ม T-06 สำหรับ workflow แก้ไขข้อมูลผู้ใช้ผิดพลาดโดย Admin/ผู้ดูแลระบบโดยไม่ต้องอนุมัติใหม่
- คง T-05 ไว้เป็นงานที่ต้องรอ Q-01 ตามกฎไม่เดา
- ขยายข้อความ Q-03 ให้ชัดเจนว่าเป็นเรื่อง dual approval และนโยบาย IAM ที่ต้องตัดสินใจ
- บันทึก Q-04 ว่าเป็น “แจ้งผ่านระบบแจ้งเตือนภายในระบบเท่านั้น” และไม่เกี่ยวข้องกับอีเมลภายนอก
- รักษา traceability ให้ยึด FR / AC / ASM ใน spec และไม่เพิ่ม requirement / ID ใหม่

### ผลการทำงาน

- ไฟล์ที่อัปเดต: [specs/018-approve-access/tasks.md](specs/018-approve-access/tasks.md)
- สรุปใหม่: 6 task ทั้งหมด, 1 task รอ Q-xx

### สรุป

การปรับแก้ tasks.md เป็นไปตามคำตอบที่ทีมให้ไว้ โดยคง Q-01 เป็น blocker ที่ถูกต้อง, ยอมรับ Q-02 เป็นงานที่สามารถทำต่อได้ทันที, และบันทึกเงื่อนไข Q-03/Q-04 ให้ชัดเจนก่อนเริ่มพัฒนา

---

## [2026-10-03] [11:02 UTC] คำสั่ง: /tasks specs/021-check-payment/spec.md (แก้รอบที่ 1)

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-21 ตรวจสอบการจ่ายเงิน
- ขอบเขต: ปรับ `tasks.md` ตามคำตอบที่ทีมให้ไว้สำหรับ Q-01 ถึง Q-03 โดยไม่เพิ่ม requirement หรือ ID ใหม่ และยกเลิกสถานะรอคำถามที่ได้ปิดแล้ว

### การแก้ไข

- Q-01: กำหนดให้ paid, pending, failed, cancelled, refunded แมปเป็นสถานะเดียวกันใน LAB BOY และ status ที่ไม่รู้จักให้ reject + audit
- Q-02 และ Q-03: กำหนดให้ timestamp เป็นหลัก, ใช้ event_id/sequence_number เป็นข้อมูลเสริมสำหรับ duplicate check, และ timestamp เก่ากว่าให้ถือว่า stale ไม่ update
- ปรับ summary และ task status ใน [specs/021-check-payment/tasks.md](specs/021-check-payment/tasks.md) ให้เป็นพร้อมทำแทนการรอ Q-xx
- รักษา traceability ตาม FR / AC / NFR ใน spec โดยไม่เพิ่ม requirement ใหม่

### ผลการทำงาน

- ไฟล์ที่อัปเดต: [specs/021-check-payment/tasks.md](specs/021-check-payment/tasks.md)
- สรุปใหม่: 7 task ทั้งหมด, 0 task รอ Q-xx

### สรุป

การแก้ไข tasks.md ครั้งนี้ยืนยันว่า Q-01 ถึง Q-03 ได้รับคำตอบแล้ว จึงไม่มี task ใดที่ค้างรอคำถามอีกต่อไป และทุก task สามารถเริ่มทำต่อได้ตามหลัก traceability ที่วางไว้

---

## [2026-10-03] [10:55 UTC] คำสั่ง: /tasks specs/021-check-payment/spec.md

- เครื่องมือ: GitHub Copilot ใน VS Code Codespaces
- Feature: UC-21 ตรวจสอบการจ่ายเงิน
- ขอบเขต: แตก `spec.md` และ `plan.md` เป็น `tasks.md` โดยยึด traceability, ไม่เพิ่ม requirement หรือ ID ใหม่, และคง Open Questions Q-01 ถึง Q-03 ไว้เป็นงานที่ต้องรอคำตอบ

### ผลการทำงาน

- สร้างไฟล์ [specs/021-check-payment/tasks.md](specs/021-check-payment/tasks.md)
- จำนวน task ทั้งหมด: 7 task
- จำนวน task ที่รอ Q-xx: 3 task
- Status ของ spec อยู่ที่ Draft v1 จึงมีคำเตือนว่า requirement ยังต้อง clarification ก่อน production implementation แต่ task ถูกแยกตาม spec และ plan ที่มีอยู่โดยไม่เดาแนวทางใหม่

### สิ่งที่ได้จากการแยกงาน

- task ที่ยากที่สุดคือ T-05 เพราะต้องผสานการแมปสถานะจากระบบการเงินกับ idempotent update และการคงสถานะเดิมเมื่อข้อมูลไม่เหมาะสมพร้อมกัน
- AC ที่ทดสอบยากที่สุดคือ AC-FIN-02 เพราะต้องจำลอง callback ที่ส่ง status paid และตรวจสอบว่า mapping ของ LAB BOY ไม่ถูกบิดเบือนจากข้อมูลซ้ำหรือ stale callback

### ข้อเสนอการทดสอบแบบย่อสำหรับทีม

- AC-FIN-02: ใช้ fixture 2 กรณีคือ callback paid ที่ถูกต้องและ callback paid ที่เป็น duplicate/stale แล้วตรวจว่าผลสุดท้ายยังเป็น paid และไม่ถูก overwrite ด้วยข้อมูลเก่า
- AC-FIN-03: ใช้ reference ผิดหรือ amount ผิด และตรวจว่าระบบปฏิเสธการอัปเดตไม่เปลี่ยนสถานะเดิมและบันทึก mismatch reason
- AC-FIN-01: ใช้ callback กลับมา 3 ครั้งพร้อม reference เดียวกันและตรวจว่าไม่สร้าง payment record ใหม่และ status เดิมยังคงสอดคล้องกับข้อมูลล่าสุด

### สรุป

การแยก task สำหรับ UC-21 เสร็จสิ้นตาม spec และ plan โดยคง Open Questions ให้เป็น task ที่ต้องรอคำตอบตามกฎและทำให้ทุก AC มี task ตรวจรับอย่างชัดเจน
