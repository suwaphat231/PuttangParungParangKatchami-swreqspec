# Implementation Plan: UC-13 ตรวจสอบสถานะผู้ปฏิบัติงาน
Spec Target: [specs/13-13-check-worker-status/spec.md](specs/13-13-check-worker-status/spec.md) (v2)

## 1. ขอบเขตและข้อกำหนด

- **การจำกัดสิทธิ์ (NFR-SEC-01):** ใช้ role และขอบเขตตาม `spec.md` เท่านั้น
  - **เจ้าหน้าที่ภาควิชา:** ดูข้อมูล Lab Boy เฉพาะรายวิชาที่สังกัดภาควิชาของตน
  - **อาจารย์ผู้สอน:** ดูข้อมูล Lab Boy เฉพาะรายวิชาที่ตนเองรับผิดชอบ
  - **ผู้ดูแลระบบ:** ดูข้อมูลได้ทุกภาควิชาและสลับภาควิชาที่ต้องการดูได้
  - ไม่มี Student/Lab Boy เป็น role สำหรับ access control ของ UC-13
- **สถานะปัจจุบัน (FR-WKS-01):** แสดงสถานะมาตรฐาน ได้แก่ `คัดเลือกแล้ว`, `กำลังปฏิบัติงาน`, `ปฏิบัติงานเสร็จสิ้น`, `ยกเลิก/พ้นสภาพ`
- **การค้นหาและกรอง (FR-WKS-02):** รองรับรหัสนักศึกษา, ชื่อ-นามสกุล, รายวิชา, ภาคการศึกษา, ช่วงเวลาปฏิบัติงาน และสถานะ
  - การค้นหาชื่อหรือรหัสนักศึกษาใช้ partial match
  - เมื่อเลือกหลาย filter ใช้ OR ข้าม filter ที่เลือก
  - เมื่อไม่พบข้อมูล แสดงข้อความ "ไม่พบข้อมูลผู้ปฏิบัติงานตามเงื่อนไขที่ระบุ"
- **Timestamp (FR-WKS-03):** แสดงวันและเวลาแบบเต็ม (full date-time) ในหน้าจอรายละเอียด และอัปเดตเมื่อสถานะเปลี่ยน
- **รายงานสรุปสถานะ (Q-01):** ตามผล Clarify ล่าสุด รายงานสรุปสถานะตามช่วงเวลาเป็น Required โดยแสดงผลในระบบ
- **ประสิทธิภาพ (NFR-PERF-01):** การค้นหาและกรองต้องแสดงผลภายในไม่เกิน 2 วินาที เมื่อทดสอบกับข้อมูลไม่เกิน 10,000 รายการ

## 2. งานพัฒนาและทดสอบ

- [ ] **Backend**
  - ดึงข้อมูลและกรองตามรหัสนักศึกษา, ชื่อ-นามสกุล, รายวิชา, ภาคการศึกษา, ช่วงเวลาปฏิบัติงาน และสถานะ
  - ใช้ partial match สำหรับการค้นหา และ OR logic ระหว่าง filter ที่เลือก
  - บังคับใช้สิทธิ์และขอบเขตข้อมูลตาม NFR-SEC-01 และ role ที่ระบุใน `spec.md`
  - จัดเตรียมข้อมูลสรุปสถานะตามช่วงเวลาสำหรับรายงานตาม Q-01
  - บันทึกหรือดึง timestamp ที่เปลี่ยนเมื่อสถานะเปลี่ยน

- [ ] **Frontend**
  - แสดงช่องค้นหาและ filter ครบทั้ง 6 ข้อตาม FR-WKS-02 โดยแสดงเฉพาะขอบเขตข้อมูลที่ role นั้นเข้าถึงได้
  - แสดงรายการ Lab Boy พร้อมสถานะมาตรฐาน
  - แสดงข้อความเมื่อไม่พบข้อมูลตาม FR-WKS-02
  - แสดง timestamp แบบ full date-time ในหน้าจอรายละเอียด
  - แสดงรายงานสรุปสถานะตามช่วงเวลาตาม Q-01

- [ ] **การทดสอบ**
  - ทดสอบการเข้าถึงข้อมูลและขอบเขต role ตาม NFR-SEC-01
  - ทดสอบ filter ทั้ง 6 ข้อ, partial match, OR logic และกรณีไม่พบข้อมูล
  - ทดสอบรายงานสรุปสถานะตามช่วงเวลา
  - ทดสอบ timestamp แบบ full date-time และยืนยันว่าเปลี่ยนเมื่อสถานะเปลี่ยน
  - ทำ Performance Test กับข้อมูลไม่เกิน 10,000 รายการ โดยการค้นหาและกรองต้องแสดงผลภายใน 2 วินาที

## 3. Acceptance Criteria และ Test Checklist

- [ ] **AC-WKS-01 (FR-WKS-01, NFR-SEC-01):** แสดงสถานะมาตรฐานล่าสุด โดยผู้ใช้เห็นเฉพาะข้อมูลตาม role และขอบเขตที่กำหนดใน `spec.md`
- [ ] **AC-WKS-02 (FR-WKS-02):** ค้นหาและกรองได้ครบทั้ง 6 ข้อ ใช้ partial match และ OR logic พร้อมแสดงข้อความเมื่อไม่พบข้อมูล
- [ ] **AC-WKS-03 (FR-WKS-03):** แสดงวันและเวลาแบบ full date-time และ timestamp อัปเดตเมื่อสถานะเปลี่ยน
- [ ] **AC-WKS-04 (Q-01):** แสดงรายงานสรุปสถานะตามช่วงเวลาภายในระบบ
- [ ] **AC-PERF-01 (NFR-PERF-01):** Performance Test ผ่านเมื่อค้นหาและกรองข้อมูลไม่เกิน 10,000 รายการแล้วแสดงผลภายใน 2 วินาที

## 4. Traceability

| Requirement / Clarification | Plan Task | Acceptance Criteria / Test |
|---|---|---|
| FR-WKS-01 | Backend ดึงสถานะล่าสุด; Frontend แสดงสถานะมาตรฐาน | AC-WKS-01 |
| FR-WKS-02 | Backend และ Frontend รองรับ filter ทั้ง 6 ข้อ, partial match, OR logic และ no-results message | AC-WKS-02; ทดสอบเงื่อนไขค้นหาและ filter |
| FR-WKS-03 | Backend จัดการ timestamp ที่เปลี่ยนเมื่อสถานะเปลี่ยน; Frontend แสดง full date-time | AC-WKS-03; ทดสอบรูปแบบและ trigger ของ timestamp |
| NFR-SEC-01 | บังคับใช้ role และขอบเขตข้อมูลตาม `spec.md` | AC-WKS-01; ทดสอบสิทธิ์ทั้ง 3 role |
| Q-01 (ยืนยัน Required) | Backend จัดเตรียมข้อมูล; Frontend แสดงรายงานสรุปสถานะตามช่วงเวลา | AC-WKS-04; ทดสอบรายงาน |
| NFR-PERF-01 | ปรับการค้นหาและกรองให้รองรับข้อมูลไม่เกิน 10,000 รายการ | AC-PERF-01; Performance Test ไม่เกิน 2 วินาที |

## 5. วัตถุประสงค์ของแผน

- ให้การพัฒนาและการทดสอบสอดคล้องกับ `spec.md` และผล Clarify ล่าสุด
- ทำให้ role, filter, timestamp, รายงาน และเกณฑ์ประสิทธิภาพตรวจสอบได้
- รักษา traceability จาก Requirement/Clarification → Plan Task → Acceptance Criteria/Test

## 6. Status

- [x] ตรวจสอบข้อกำหนดใน `spec.md` และผล Clarify ล่าสุด
- [x] ยืนยัน Q-01 ว่ารายงานสรุปสถานะตามช่วงเวลาเป็น Required
- [x] ดำเนินงาน Backend, Frontend และ Test ตามแผน
- [x] ตรวจสอบ Acceptance Criteria และ traceability ก่อนส่งมอบ

## 7. Next Action

ส่งมอบ UC-13 demo/test implementation ให้ทีมตรวจ โดยเฉพาะการยอมรับ in-memory source, demo-principal configuration และการสรุป report จากสถานะล่าสุดของช่วงปฏิบัติงาน

## 8. Technical Decisions ที่ใช้ใน UC-13 รอบนี้

การเลือก FastAPI, React/Vite และรูปแบบ in-memory demo มาจากคำตัดสินใจของทีมและโครงสร้าง repo ไม่ได้เพิ่มหรือเปลี่ยน FR/AC ใน `spec.md`

- **แหล่งข้อมูล:** ใช้ deterministic in-memory `WorkerStatusStore`; ไม่เชื่อม PostgreSQL และไม่สร้าง database/schema ใหม่
- **Model/entity:** `WorkerRecord` มี worker ID, student ID, full name, department, course, semester, academic year, work-period start/end, status และ `last_updated_at`; ค่าเริ่มต้นเป็น demo records ที่คงที่เพื่อให้ tests ทำซ้ำได้
- **Status transition:** สถานะก่อนวันเริ่มเป็น `คัดเลือกแล้ว`, ตั้งแต่วันเริ่มถึงวันสิ้นสุดรวมวันสิ้นสุดเป็น `กำลังปฏิบัติงาน`, หลังวันสิ้นสุดเป็น `ปฏิบัติงานเสร็จสิ้น`; `ยกเลิก/พ้นสภาพ` ไม่ถูกเปลี่ยนอัตโนมัติ การเปลี่ยนสถานะจะตั้ง `last_updated_at` เป็น UTC
- **Authenticated principal:** production path รับ `Principal` จาก trusted `request.state.principal` และตอบ 401 เมื่อไม่มี; demo mode เปิดด้วย `UC13_AUTH_MODE=demo` เฉพาะเมื่อ `APP_ENV` เป็น `development` หรือ `test` และอ่าน role/scope จาก server environment เท่านั้น (`UC13_DEMO_ROLE`, `UC13_DEMO_DEPARTMENT`, `UC13_DEMO_COURSES`) ห้ามส่ง role ผ่าน query/body
- **API contract:**
  - `GET /uc13/context` คืน role และ Department/course ที่ principal มองเห็น
  - `GET /uc13/course-scope?department_id=...` คืน course IDs ใน scope
  - `GET /uc13/workers` รองรับ `student_id`, `full_name`, `course_id`, `semester`, `academic_year`, `work_period_from`, `work_period_to`, `status` และ `department_id`
  - `GET /uc13/workers/{worker_id}` คืนรายละเอียดรวม Last Updated Timestamp ภายใน scope
  - `GET /uc13/reports/status?period_from=...&period_to=...&department_id=...` คืนยอดรวมแยกตามสถานะ
- **Filter semantics:** authorization scope ถูก apply ก่อน; selected search/filter criteria ภายใน scope ใช้ OR; student ID/full name เป็น case-insensitive partial match; work period ใช้ช่วงที่ซ้อนทับกันแบบรวมวันขอบเขต
- **Report semantics:** นับ latest current status ของผู้ปฏิบัติงานที่ work period ซ้อนทับช่วงที่เลือก ไม่ใช่ประวัติการเปลี่ยนสถานะ เพราะ model นี้เก็บสถานะล่าสุดเท่านั้น
- **Frontend/API integration:** Vite proxy ส่ง `/api/*` ไป Backend โดยตัด prefix `/api`; T-15 เชื่อม list, detail, context, department scope และ report ผ่าน API client เดียว
- **Performance:** AC-PERF-01 วัด API search/filter กับ in-memory dataset 10,000 records; เวลาไม่รวมการสร้าง dataset

ไม่มี external service หรือ production authentication/database ถูกสร้างเพิ่มในรอบนี้
