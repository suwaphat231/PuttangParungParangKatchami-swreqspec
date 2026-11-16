# Plan: UC-16 ติดตามและตรวจสอบการจ่ายเงิน
Spec Target: [specs/16-16-track-payment/spec.md](specs/16-16-track-payment/spec.md) (v2)

## วัตถุประสงค์
- คง Backend API และ Business Logic ตาม FR/AC เดิม และเพิ่ม Prototype UI แยกจากงาน Backend
- รองรับการสาธิตด้วย Mock Finance Data ที่แยกจากข้อมูลจริงชัดเจน
- ไม่กล่าวอ้างว่าเชื่อมต่อระบบการเงินจริงจนกว่าจะมี integration จริง
- Prototype UI ใช้ Mock Data ภายใน Frontend เท่านั้น; ไม่เรียก Backend API และไม่เชื่อม Database

## เทคโนโลยีและแนวทาง
- Python, FastAPI, Pydantic และ pytest มีรูปแบบใช้อยู่ใน repository; ระบุเป็นการเลือกเทคนิคของทีม ไม่ได้มาจาก spec
- React, Vite, Tailwind CSS และ Vitest มีอยู่แล้วใน Frontend; ใช้โครงสร้างเดิมโดยไม่ติดตั้ง package เพิ่ม
- Mock Finance Data เก็บเป็นข้อมูลจำลองแบบอ่านอย่างเดียวใน backend; ข้อมูลต้องมี `data_source: MOCK`, สถานะ `PAID`, `UNPAID`, `ABNORMAL`, ยอดเงินและข้อมูลผู้ปฏิบัติงาน
- Mock Data ของ Prototype UI อยู่ใน Frontend แยกจาก Backend และต้องติดป้ายว่าเป็นข้อมูลสมมติ ไม่ใช่ข้อมูลการเงินจริง
- Timestamp ใน Mock Finance Data ใช้ timezone `Asia/Bangkok` ตามที่ทีมยืนยัน; ห้ามอนุมาน timezone ของระบบการเงินจริงจาก mock
- ค่า API ที่ใช้ตอบต้องแยก `amount` และ `finance_status`; ไม่สร้าง endpoint สำหรับแก้ไขยอดหรือสถานะ
- API ที่คืนข้อมูลการเงินต้องผ่านการตรวจ role และบันทึก Audit Log; ห้ามปล่อยข้อมูลก่อน T-03 พร้อม
- demo auth สำหรับ UC-16 ใช้ server-side JSON map จาก `PAYMENT_DEMO_AUTH_TOKENS`; map token ไป `user_id`/role โดยไม่รับ role จาก request
- demo auth ใช้ได้เฉพาะ `APP_ENV=local` หรือ `APP_ENV=test`; ค่า `APP_ENV` เริ่มต้นเป็น `production` เพื่อปิด demo auth แบบ fail-closed และ auth module แยกจาก `backend/app/auth/idp.py`
- Audit Log สำหรับ UC-16 ใช้ตาราง `payment_audit_logs` แยกจากตาราง audit ของการจอง เก็บ actor, timestamp, resource และผล ALLOWED/DENIED โดยไม่เก็บ token
- UI เป็น Read-only: แสดง summary, รายการค้นหา/กรอง, รายละเอียด และยอดเงินคู่สถานะตาม Q-01; ไม่เพิ่มการแก้ไขยอดหรือสถานะ
- ปัจจุบัน `App.jsx` แสดงหน้า Application Status โดยตรงและไม่มี Router; เปิด Prototype ผ่าน path `/payments` ด้วยการเลือกหน้าแบบจำกัด โดยคงหน้าเดิมที่ path อื่น
- UI ไม่ทำหน้าที่ Authentication/Authorization หรือ Audit Log; ข้อกำหนด FR-PAY-04/05 ยังคงบังคับและตรวจผ่าน Backend ที่ทำเสร็จแล้ว

## เฟสและ Dependency

### เฟส 1: Mock Finance Data และ Business Logic
ลำดับ: T-01 → T-02
- T-01 กำหนด contract และ provider ของข้อมูลจำลองที่ติดป้าย MOCK
- T-02 คำนวณรายการที่ต้องติดตามจากสถานะจำลอง โดยไม่แก้ข้อมูลต้นทาง
- จุดตรวจเฟส 1:
  - คำสั่ง: `cd backend && pytest -q tests/test_T01_payment_contract.py tests/test_AC_PAY_02.py`
  - Given มีข้อมูลจำลองครบสามสถานะและมี timezone `Asia/Bangkok`
  - When ตรวจ provider และ business logic
  - Then provider แสดงว่าเป็น MOCK, มี amount/worker fields ครบ, PAID ไม่ต้องติดตาม และ UNPAID/ABNORMAL ต้องติดตาม

### เฟส 2: การยืนยันสิทธิ์และ Audit Log
ลำดับ: T-03
- T-03 ใช้ demo-only server-side bearer token mapping ตามที่ทีมยืนยัน; production ปิดใช้งาน และห้ามใช้ role ที่ผู้เรียกส่งมาเอง
- T-03 สร้างตาราง audit แยก พร้อมบันทึกผลทั้งอนุญาตและปฏิเสธ

### เฟส 3: Read-only Backend API
ลำดับ: T-05 → T-06
- T-05 เพิ่ม API ค้นหาและรายการจ่ายเงินตาม AC-PAY-03 หลัง T-03
- T-06 เพิ่ม API อ่านสถานะล่าสุดและรายการที่ต้องติดตามตาม AC-PAY-01/02 หลัง T-02, T-03 และ T-05
- Endpoint path ที่ทีมยืนยัน: `GET /payments` (ค้นหา/กรอง), `GET /payments/{payment_id}` (อ่านสถานะล่าสุดรายรายการ), `GET /payments/follow-up` (รายการที่ต้องติดตาม)

### เฟส 4: ตรวจรับ
ลำดับ: T-07
- ทดสอบ AC-PAY-01 ถึง AC-PAY-05 และ NFR-SEC-01/NFR-AUD-01 หลัง T-01 ถึง T-06

### เฟส 5: Prototype UI
ลำดับ: T-08 หลัง T-01, T-02, T-04 และ T-07
- T-08 เพิ่มหน้ารายการติดตามการจ่ายเงินด้วย Mock Data ภายใน Frontend เท่านั้น โดยไม่แก้ Backend หรือ Database
- คงหน้าเดิมที่ path `/`; เพิ่มจุดเข้า Prototype ที่ `/payments` โดยไม่ติดตั้ง Router/package ใหม่
- ค้นหา `worker_name` แบบ partial และ `worker_id`/`payment_reference` แบบ exact; กรองสถานะ, แสดง summary, รายการและรายละเอียด
- แสดงยอดเงินและสถานะในรูป `ยอดเงิน | สถานะการจ่ายเงิน`; สถานะ UNPAID/ABNORMAL ต้องเห็นว่าต้องติดตาม
- ทดสอบ interactions ด้วย Vitest/Testing Library ที่ติดตั้งอยู่ และรัน `npm test` กับ `npm run build`
- จุดตรวจเฟส 5:
  - คำสั่ง: `cd frontend && npm test && npm run build`
  - Given เปิด `/payments` โดยใช้ข้อมูลจำลองใน Frontend
  - When ค้นหา/กรองรายการและเปิดดูรายละเอียด
  - Then ผลลัพธ์ตรงกับเงื่อนไขการค้นหาและสถานะ, summary แสดงจำนวนจาก Mock Data, ยอดเงินอยู่กับสถานะ, UI เป็น Read-only และมีป้ายข้อมูลสมมติ

## สถานะ
- [x] บันทึก Q-01: แสดงยอดเงินพร้อมสถานะการจ่ายเงิน
- [x] ยืนยันว่า Mock Finance Data ใช้พัฒนา/ทดสอบได้และต้องระบุว่าเป็นข้อมูลจำลอง
- [x] ยืนยัน timezone ของ Mock Finance Data เป็น `Asia/Bangkok`
- [x] เพิ่มขอบเขต Prototype UI แยกจาก Backend ตามคำสั่งทีม; UI ใช้ Frontend Mock Data เท่านั้น
- [x] ยืนยัน demo-only server-side bearer token mapping ผ่าน environment สำหรับ local/test และปิดใน production
- [x] ยืนยันตาราง Audit Log แยกสำหรับ UC-16
- [x] ยืนยัน endpoint path ก่อน T-05
- [x] แยก Prototype UI เป็น T-08; dependency และขอบเขตตรวจตาม tasks.md ก่อนเริ่มงาน
