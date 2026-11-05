# Plan: UC-16 ติดตามและตรวจสอบการจ่ายเงิน
Spec Target: [specs/16-16-track-payment/spec.md](specs/16-16-track-payment/spec.md) (v1)

## วัตถุประสงค์
- พัฒนา Backend API และ Business Logic ตาม FR/AC ใน spec โดยไม่ทำ Frontend/UI
- รองรับการสาธิตด้วย Mock Finance Data ที่แยกจากข้อมูลจริงชัดเจน
- ไม่กล่าวอ้างว่าเชื่อมต่อระบบการเงินจริงจนกว่าจะมี integration จริง

## เทคโนโลยีและแนวทาง
- Python, FastAPI, Pydantic และ pytest มีรูปแบบใช้อยู่ใน repository; ระบุเป็นการเลือกเทคนิคของทีม ไม่ได้มาจาก spec
- Mock Finance Data เก็บเป็นข้อมูลจำลองแบบอ่านอย่างเดียวใน backend; ข้อมูลต้องมี `data_source: MOCK`, สถานะ `PAID`, `UNPAID`, `ABNORMAL`, ยอดเงินและข้อมูลผู้ปฏิบัติงาน
- Timestamp ใน Mock Finance Data ใช้ timezone `Asia/Bangkok` ตามที่ทีมยืนยัน; ห้ามอนุมาน timezone ของระบบการเงินจริงจาก mock
- ค่า API ที่ใช้ตอบต้องแยก `amount` และ `finance_status`; ไม่สร้าง endpoint สำหรับแก้ไขยอดหรือสถานะ
- API ที่คืนข้อมูลการเงินต้องผ่านการตรวจ role และบันทึก Audit Log; ห้ามปล่อยข้อมูลก่อน T-03 พร้อม
- Identity provider ปัจจุบันใน `backend/app/auth/idp.py` คืน HN เท่านั้นและไม่มี role claim; T-03 รอทีมยืนยัน module/claim ที่เชื่อถือได้จาก identity provider

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
- T-03 ต้องรอการยืนยัน role claim/module จาก identity provider; ห้ามใช้ role ที่ผู้เรียกส่งมาเองแทน identity ที่เชื่อถือได้

### เฟส 3: Read-only Backend API
ลำดับ: T-05 → T-06
- T-05 เพิ่ม API ค้นหาและรายการจ่ายเงินตาม AC-PAY-03 หลัง T-03
- T-06 เพิ่ม API อ่านสถานะล่าสุดและรายการที่ต้องติดตามตาม AC-PAY-01/02 หลัง T-02, T-03 และ T-05
- Endpoint path เป็น technical decision ที่ต้องยืนยันก่อนเริ่ม T-05 หากยังไม่มี pattern/ข้อสรุปที่ใช้กับ UC-16

### เฟส 4: ตรวจรับ
ลำดับ: T-07
- ทดสอบ AC-PAY-01 ถึง AC-PAY-05 และ NFR-SEC-01/NFR-AUD-01 หลัง T-01 ถึง T-06

## สถานะ
- [x] บันทึก Q-01: แสดงยอดเงินพร้อมสถานะการจ่ายเงิน
- [x] ยืนยันว่า Mock Finance Data ใช้พัฒนา/ทดสอบได้และต้องระบุว่าเป็นข้อมูลจำลอง
- [x] ยืนยัน timezone ของ Mock Finance Data เป็น `Asia/Bangkok`
- [x] กำหนดการพัฒนารอบนี้เป็น Backend-only
- [ ] ยืนยัน role claim/module จาก identity provider ก่อน T-03
- [ ] ยืนยัน endpoint path ก่อน T-05
