# Tasks Breakdown: UC-16 ติดตามและตรวจสอบการจ่ายเงิน
- Feature: ติดตามและตรวจสอบการจ่ายเงิน
- Spec ID: SPEC-16-16
- อ้างอิง plan.md: [plan.md](plan.md)
- วันที่: 2026-10-03
- สรุป: 7 task, 1 task รอ Open Question

## รายการ task

### T-01 สร้าง contract API และ model รายการจ่ายเงิน
- รองรับ: FR-PAY-01, FR-PAY-02, ASM-01
- ตรวจด้วย: AC-PAY-01, AC-PAY-03
- ไฟล์ที่แตะ: `backend/app/router.py`, `backend/app/payment_service.py`, `backend/tests/test_track_payment.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: API คืนรายการจ่ายเงินและสถานะล่าสุดจากระบบการเงินตาม filter ที่เลือกได้อย่างถูกต้อง
- สถานะ: พร้อมทำ

### T-02 กำหนดสถานะและเครื่องหมายรายการที่ต้องดำเนินการต่อ
- รองรับ: FR-PAY-03
- ตรวจด้วย: AC-PAY-02
- ไฟล์ที่แตะ: `backend/app/payment_service.py`, `backend/tests/test_track_payment.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: รายการถูกจัดกลุ่มเป็น จ่ายแล้ว / ยังไม่จ่าย / ข้อมูลผิดปกติ และรายการที่ยังไม่จ่ายหรือผิดปกติถูกทำเครื่องหมายชัดเจน
- สถานะ: พร้อมทำ

### T-03 บังคับ RBAC และ Audit Log สำหรับการเข้าถึงข้อมูลการเงิน
- รองรับ: FR-PAY-04, FR-PAY-05, NFR-SEC-01, NFR-AUD-01
- ตรวจด้วย: AC-PAY-04, AC-PAY-05
- ไฟล์ที่แตะ: `backend/app/router.py`, `backend/app/authorization.py`, `backend/app/payment_service.py`, `backend/tests/test_track_payment.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: บทบาทที่ไม่ได้รับอนุญาตถูกปฏิเสธ และทุกการเข้าถึง/เรียกดูข้อมูลถูกบันทึกลง Audit Log ได้
- สถานะ: พร้อมทำ

### T-04 กำหนดรูปแบบแสดงยอดเงินตามคำตอบ Q-01
- รองรับ: ASM-01, Q-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04
- ไฟล์ที่แตะ: `frontend/src/pages/PaymentTrackingPage.jsx`, `frontend/src/components/PaymentSummaryCard.jsx`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: รูปแบบแสดงยอดเงิน/สถานะถูกปรับตามคำตอบ Q-01 และไม่คาดเดาแนวทางแสดงผลก่อนมีคำยืนยัน
- สถานะ: รอ Q-01

### T-05 สร้างหน้า tracking payment list พร้อมค้นหาและกรองข้อมูล
- รองรับ: FR-PAY-01, FR-PAY-02
- ตรวจด้วย: AC-PAY-03
- ไฟล์ที่แตะ: `frontend/src/pages/PaymentTrackingPage.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/PaymentTrackingPage.test.jsx`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: หน้าแสดงรายการจ่ายเงินให้เห็นตามรหัสนักศึกษา รายวิชา ภาคการศึกษา และสถานะที่เลือกได้ถูกต้อง
- สถานะ: พร้อมทำ

### T-06 เชื่อมหน้าจอกับ API และจัด UI แบบ Read-only
- รองรับ: FR-PAY-02, FR-PAY-03, Constraint: หน้า tracking เป็นแบบ Read-only ไม่อนุญาตให้แก้ไขข้อมูลต้นทางหรือเปลี่ยนสถานะผ่านหน้าจอนี้
- ตรวจด้วย: AC-PAY-01, AC-PAY-02
- ไฟล์ที่แตะ: `frontend/src/pages/PaymentTrackingPage.jsx`, `frontend/src/api/client.js`, `frontend/src/components/PaymentStatusBadge.jsx`
- ต้องทำหลัง: T-01, T-02, T-05
- เสร็จเมื่อ: หน้าแสดงสถานะล่าสุดและแสดงเครื่องหมายรายการที่ต้องดำเนินการต่อ พร้อมไม่มีปุ่มหรือฟิลด์ใดที่อนุญาตให้แก้ไขข้อมูลต้นทาง
- สถานะ: พร้อมทำ

### T-07 ทดสอบยอมรับสำหรับ AC-PAY-01 ถึง AC-PAY-05
- รองรับ: FR-PAY-01, FR-PAY-02, FR-PAY-03, FR-PAY-04, FR-PAY-05, NFR-SEC-01, NFR-AUD-01
- ตรวจด้วย: AC-PAY-01, AC-PAY-02, AC-PAY-03, AC-PAY-04, AC-PAY-05
- ไฟล์ที่แตะ: `backend/tests/test_track_payment.py`, `frontend/src/__tests__/PaymentTrackingPage.test.jsx`
- ต้องทำหลัง: T-01, T-02, T-03, T-05, T-06
- เสร็จเมื่อ: test acceptance ครอบคลุมทุก AC และผ่านตามเงื่อนไขหน้าติดตามและตรวจสอบการจ่ายเงิน
- สถานะ: พร้อมทำ

## ตารางตรวจความครบ

### 1) AC ID | task ที่ตรวจ AC นี้
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-PAY-01 | T-01, T-06, T-07 |
| AC-PAY-02 | T-02, T-06, T-07 |
| AC-PAY-03 | T-01, T-05, T-07 |
| AC-PAY-04 | T-03, T-07 |
| AC-PAY-05 | T-03, T-07 |

### 2) Constraint (จาก spec) | task ที่ทำให้เป็นจริง
| Constraint (จาก spec) | task ที่ทำให้เป็นจริง |
|---|---|
| ข้อมูลการเงินเข้าถึงได้เฉพาะผู้มีสิทธิ์ตามบทบาทและสิทธิ์ของผู้ใช้งาน | T-03 |
| หน้าติดตามและตรวจสอบเป็นแบบ Read-only ไม่อนุญาตให้แก้ไขข้อมูลต้นทางหรือเปลี่ยนสถานะการจ่ายเงินผ่านหน้าจอนี้ | T-06 |
| ระบบการเงินเป็นแหล่งข้อมูลสถานะการจ่ายเงินที่ถูกต้องและเป็นแหล่งข้อมูลหลัก | T-01, T-02 |
| รายการที่ยังไม่จ่ายหรือผิดปกติต้องถูกทำเครื่องหมายชัดเจนเพื่อให้เจ้าหน้าที่ดำเนินการต่อ | T-02, T-06 |

## สิ่งที่ยังไม่ทำ
- Q-01: ควรแสดงยอดเงินพร้อมสถานะการจ่ายหรือไม่? -> ยืนยันนโยบายข้อมูล
  - รอ task: T-04
