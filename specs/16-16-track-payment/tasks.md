# Tasks: UC-16 ติดตามและตรวจสอบการจ่ายเงิน
- Feature: ติดตามและตรวจสอบการจ่ายเงิน
- Spec ID: SPEC-16-16
- อ้างอิง spec.md: [spec.md](spec.md)
- ขอบเขตการพัฒนา: Backend API และ Business Logic เท่านั้น; ไม่มี Frontend/UI

## รายการ task

### T-01 จัดทำ contract API และ Mock Finance Data
- รองรับ: FR-PAY-01, FR-PAY-02, ASM-01
- ตรวจด้วย: test พื้นฐานของ contract/provider (ไม่มี AC ตรงโดยตรง)
- ไฟล์ที่แตะ: `backend/app/payments/__init__.py` (สร้าง), `backend/app/payments/schemas.py` (สร้าง), `backend/app/payments/mock_finance.py` (สร้าง), `backend/tests/test_T01_payment_contract.py` (สร้าง)
- สถานะ: เสร็จ
- ต้องทำหลัง: ไม่มี
- Contract fields: `payment_id`, `worker_id`, `worker_name`, `payment_reference`, `amount`, `currency`, `finance_status`, `status_updated_at`, `last_synced_at`, `data_source`
- ข้อมูลจำลองต้องมีสถานะ `PAID`, `UNPAID`, `ABNORMAL`, ยอดเงินและข้อมูลผู้ปฏิบัติงาน; `data_source` ต้องระบุ `MOCK`; timestamp ใช้ timezone `Asia/Bangkok`
- ข้อจำกัด: ข้อมูลเป็น Mock Finance Data สำหรับพัฒนา/ทดสอบเท่านั้น ไม่ใช่ข้อมูลจริงและไม่ใช่ integration ระบบการเงินจริง; provider อ่านอย่างเดียว
- เสร็จเมื่อ: contract และ provider มี fields ที่ระบุ, mock ครบสามสถานะพร้อมยอดเงิน/ผู้ปฏิบัติงาน/timezone, แยกป้าย MOCK ชัดเจน และ test ผ่าน

### T-02 ระบุสถานะและรายการที่ต้องดำเนินการต่อ
- รองรับ: FR-PAY-03
- ตรวจด้วย: AC-PAY-02
- ไฟล์ที่แตะ: `backend/app/payments/schemas.py`, `backend/app/payments/service.py` (สร้าง), `backend/tests/test_AC_PAY_02.py` (สร้าง)
- สถานะ: เสร็จ
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: business logic ทำเครื่องหมาย `UNPAID` และ `ABNORMAL` ว่าต้องติดตามต่อ และไม่ทำเครื่องหมาย `PAID`; ไม่แก้ข้อมูลต้นทาง; test AC-PAY-02 ผ่าน

### T-03 บังคับสิทธิ์และบันทึก Audit Log
- รองรับ: FR-PAY-04, FR-PAY-05, NFR-SEC-01, NFR-AUD-01
- ตรวจด้วย: AC-PAY-04, AC-PAY-05
- ไฟล์ที่แตะ: `backend/app/config.py`, `backend/app/payments/auth.py` (สร้าง), `backend/app/payments/audit.py` (สร้าง), `backend/app/db/models.py`, `backend/app/db/migrations/002_payment_audit_log.py` (สร้าง), `backend/tests/test_AC_PAY_04.py` (สร้าง), `backend/tests/test_AC_PAY_05.py` (สร้าง)
- สถานะ: เสร็จ
- ต้องทำหลัง: T-01
- สิทธิ์ที่ยืนยัน: HR และ Manager/Executive อ่านได้แบบ Read-only; Student และผู้ปฏิบัติงานทั่วไปถูกปฏิเสธ
- Auth สำหรับสาธิต: `PAYMENT_DEMO_AUTH_TOKENS` เป็น JSON map จาก bearer token ไป `user_id`/role; ใช้ได้เฉพาะ `APP_ENV=local` หรือ `test` และค่าเริ่มต้น `APP_ENV=production`; ห้ามรับ role จาก request และห้ามบันทึก token
- Audit Log: ตาราง `payment_audit_logs` แยก เก็บ user ID (nullable เมื่อระบุตัวตนไม่ได้), วันเวลา UTC, resource/item และผล `ALLOWED`/`DENIED`
- เสร็จเมื่อ: HR/MANAGER/EXECUTIVE ได้รับอนุญาต, STUDENT/WORKER และ token ที่ไม่ถูกต้องถูกปฏิเสธ; demo auth ปิดเมื่อไม่ใช่ local/test; ทุกผลการอนุญาต/ปฏิเสธถูกบันทึกลงตารางโดยไม่เก็บ token; migration และ test AC-PAY-04/05 ผ่าน

### T-04 กำหนดรูปแบบการแสดงยอดเงินตามคำตอบ Q-01
- รองรับ: ASM-01, Q-01
- สถานะ: เสร็จ
- รูปแบบที่ยืนยัน: API แยก `amount` และ `finance_status`; client ที่นำไปแสดงใช้รูปแบบ `ยอดเงิน | สถานะการจ่ายเงิน` เช่น `15,000 บาท | ชำระแล้ว`
- ขอบเขตปัจจุบัน: คงรูปแบบข้อมูล/การแสดงผลที่ยืนยันไว้ แต่ไม่พัฒนา Frontend/UI สำหรับ UC-16
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: รูปแบบยอดเงินพร้อมสถานะถูกกำหนดและ test ของ format ที่มีอยู่ผ่าน

### T-05 สร้าง API ค้นหารายการจ่ายเงิน
- รองรับ: FR-PAY-01, FR-PAY-02
- ตรวจด้วย: AC-PAY-03
- ไฟล์ที่แตะ: `backend/app/main.py`, `backend/app/payments/router.py` (สร้าง), `backend/app/payments/service.py`, `backend/tests/test_AC_PAY_03.py` (สร้าง)
- สถานะ: เสร็จ รอทีมตรวจ
- ต้องทำหลัง: T-01, T-03
- เงื่อนไขค้นหา: `worker_id` exact match, `worker_name` partial match, `payment_reference` exact match
- ข้อจำกัด: API อ่านอย่างเดียวและต้องระบุ `data_source=MOCK` เมื่อใช้ provider จำลอง; ไม่มี Frontend/UI
- เสร็จเมื่อ: API คืนรายการตาม filter ตาม AC-PAY-03, ถูกป้องกันด้วย authorization/audit ของ T-03 และ test ผ่าน

### T-06 สร้าง API อ่านสถานะล่าสุดและรายการที่ต้องติดตามแบบ Read-only
- รองรับ: FR-PAY-02, FR-PAY-03
- ตรวจด้วย: AC-PAY-01, AC-PAY-02
- ไฟล์ที่แตะ: `backend/app/payments/router.py`, `backend/app/payments/service.py`, `backend/tests/test_AC_PAY_01.py` (สร้าง), `backend/tests/test_AC_PAY_02.py`
- สถานะ: รอ T-02, T-03 และ T-05
- ต้องทำหลัง: T-02, T-03, T-05
- ข้อจำกัด: API อ่านอย่างเดียว ไม่มีการแก้ไขยอดเงินหรือเปลี่ยนสถานะ; แสดง source เป็น MOCK ตามจริง
- เสร็จเมื่อ: API คืนสถานะล่าสุดตาม AC-PAY-01 และ flag รายการตาม AC-PAY-02 โดยไม่แก้ข้อมูลต้นทาง และ test ผ่าน

### T-07 ทดสอบ acceptance criteria ทั้งหมด
- รองรับ: FR-PAY-01 ถึง FR-PAY-05 และ NFR-SEC-01, NFR-AUD-01
- ตรวจด้วย: AC-PAY-01 ถึง AC-PAY-05
- ไฟล์ที่แตะ: `backend/tests/test_T01_payment_contract.py`, `backend/tests/test_AC_PAY_01.py`, `backend/tests/test_AC_PAY_02.py`, `backend/tests/test_AC_PAY_03.py`, `backend/tests/test_AC_PAY_04.py` (สร้าง), `backend/tests/test_AC_PAY_05.py` (สร้าง)
- สถานะ: รอ T-01 ถึง T-06
- ต้องทำหลัง: T-01, T-02, T-03, T-04, T-05, T-06
- เสร็จเมื่อ: API tests ครอบคลุม AC-PAY-01 ถึง AC-PAY-05 และยืนยัน NFR-SEC-01/NFR-AUD-01 ผ่านทั้งหมด; ไม่มี test หรือข้อความใดอ้าง Mock Finance Data ว่าเป็นข้อมูลจริง

## เฟส 1: Mock Finance Data และ Business Logic
ลำดับ: T-01 → T-02

### จุดตรวจเฟส 1
- คำสั่ง: `cd backend && pytest -q tests/test_T01_payment_contract.py tests/test_AC_PAY_02.py`
- Given: Mock Finance Data มีรายการ PAID, UNPAID และ ABNORMAL พร้อมยอดเงิน, ผู้ปฏิบัติงาน และ timezone Asia/Bangkok
- When: ตรวจ contract/provider และเรียก business logic ระบุรายการติดตาม
- Then: ทุก record ระบุ `data_source=MOCK`; PAID ไม่ถูกระบุว่าต้องติดตาม; UNPAID และ ABNORMAL ถูกระบุว่าต้องติดตาม; ไม่มีการแก้ข้อมูลต้นทาง

## เฟส 2: Authorization และ Audit Log
ลำดับ: T-03
- จุดเริ่มเฟส: หลัง T-01 เสร็จและทีมยืนยัน demo auth กับรูปแบบตาราง Audit Log

### จุดตรวจเฟส 2
- คำสั่ง: `cd backend && pytest -q tests/test_AC_PAY_04.py tests/test_AC_PAY_05.py`
- Given: test ตั้ง `APP_ENV=test` พร้อม server-side token mapping ของ HR, Manager, Executive, Student และ Worker
- When: เรียก test route ด้วย token ที่ถูกต้อง/ไม่ถูกต้อง และตรวจ `payment_audit_logs`
- Then: HR/Manager/Executive ได้รับอนุญาต; Student/Worker และคำขอไม่มี token ถูกปฏิเสธ; ทุกผลมี user ID (ถ้าระบุตัวตนได้), เวลา, resource และผล ALLOWED/DENIED โดยไม่มี token ในตาราง
- ข้อจำกัด: T-03 ยังไม่เปิด HTTP payment endpoint ใน app จริง; การตรวจผ่าน test route จนกว่า T-05/T-06 จะเพิ่ม API

## เฟส 3: Read-only Backend API
ลำดับ: T-05 → T-06
- จุดเริ่มเฟส: หลัง T-03 เสร็จและทีมยืนยัน endpoint path ที่ใช้กับ UC-16
- Endpoint ที่ยืนยัน: `GET /payments` ค้นหา/กรอง; `GET /payments/{payment_id}` อ่านสถานะล่าสุด; `GET /payments/follow-up` รายการที่ต้องติดตาม

## เฟส 4: ตรวจรับ
ลำดับ: T-07
- จุดเริ่มเฟส: หลัง T-01 ถึง T-06 เสร็จและผ่านการตรวจของทีม
