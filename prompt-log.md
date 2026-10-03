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
