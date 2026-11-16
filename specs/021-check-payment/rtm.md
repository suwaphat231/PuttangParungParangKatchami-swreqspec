# RTM: ตรวจสอบการจ่ายเงิน
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | ผลตรวจ: ไม่พบ implementation/test ของ UC-21

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test | สถานะ |
|---|---|---|---|---|---|
| FR-FIN-01 | AC-FIN-01 | T-01 | ไม่พบ reference lookup ของ UC-21 | ไม่พบ test AC-FIN-01 | ยังไม่ถึง |
| FR-FIN-02 | AC-FIN-02 | T-02 | ไม่พบ status/timestamp intake ของ UC-21 | ไม่พบ test AC-FIN-02 | ยังไม่ถึง |
| FR-FIN-03 | AC-FIN-01 | T-03, T-05 | ไม่พบ idempotent update ของ UC-21 | ไม่พบ test AC-FIN-01 | ยังไม่ถึง |
| FR-FIN-04 | AC-FIN-03 | T-04, T-06 | ไม่พบ mismatch rejection/audit reason | ไม่พบ test AC-FIN-03 | ยังไม่ถึง |
| NFR-REL-01 | AC-FIN-03 | T-05 | ไม่พบ workflow จริง | ไม่พบ test | ยังไม่ถึง |
| NFR-SEC-01 | ไม่มี AC ตรง | T-03, T-06 | ไม่พบ encrypted/authenticated finance connection | ไม่พบ test | ช่องโหว่ |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/payments/` | FR-PAY-* | ไม่ใช่ UC-21 | เป็นฟีเจอร์ UC-16 ตาม spec คนละโฟลเดอร์ |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | FR ไม่มี AC | `spec.md`: Traceability | FR-FIN-02, NFR-SEC-01 | FR-FIN-02 และ NFR-SEC-01 ไม่มี AC โดยตรง | |

## 4. แก้แล้ว
ไม่มี
