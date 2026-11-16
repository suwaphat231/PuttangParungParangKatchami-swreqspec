# RTM: ติดตามและตรวจสอบการจ่ายเงิน
อ้างอิง: [spec.md](./spec.md) | [plan.md](./plan.md) | [tasks.md](./tasks.md)
สร้างด้วย /verify เมื่อ 2569-11-11 | test: backend 54 ผ่าน, frontend 12 ผ่าน, 1 todo

## 1. ตามรอยไปข้างหน้า
| ID | AC | task | โค้ด | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-PAY-01 | AC-PAY-03 | T-01, T-05 | `payments/service.py: search_payment_records`, `payments/router.py: list_payments` | `test_AC_PAY_03.py` ผ่าน | ครบ |
| FR-PAY-02 | AC-PAY-01 | T-01, T-05, T-06 | `payments/schemas.py`, `payments/service.py`, `payments/router.py` | `test_AC_PAY_01.py` ผ่าน | ครบ |
| FR-PAY-03 | AC-PAY-02 | T-02, T-06 | `build_tracking_records`, `get_follow_up_payment_records` | `test_AC_PAY_02.py` ผ่าน | ครบ |
| FR-PAY-04 | AC-PAY-04 | T-03 | `payments/auth.py: get_payment_user` | `test_AC_PAY_04.py` ผ่าน | ครบ |
| FR-PAY-05 | AC-PAY-05 | T-03, T-07 | `payments/audit.py: record_payment_access` | `test_AC_PAY_05.py` ผ่าน | ครบ |
| NFR-SEC-01 | AC-PAY-04 | T-03 | role authorization และปฏิเสธ token ที่ไม่ถูกต้อง | `test_AC_PAY_04.py` ผ่าน | ครบ |
| NFR-AUD-01 | AC-PAY-05 | T-03, T-07 | `PaymentAuditLog` และ audit dependency | `test_AC_PAY_05.py` ผ่าน | ครบ |

## 2. ตามรอยย้อนกลับ
| โค้ด | อ้าง ID | ตรงกับ spec ไหม | หมายเหตุ |
|---|---|---|---|
| `GET /payments` | FR-PAY-01/02 | ตรง | read-only และใช้ Mock Data |
| `GET /payments/{payment_id}` | FR-PAY-02 | ตรง | คืนสถานะล่าสุดพร้อม timezone |
| `GET /payments/follow-up` | FR-PAY-03 | ตรง | คืน UNPAID/ABNORMAL |
| `payments/auth.py` | FR-PAY-04/NFR-SEC-01 | ตรง | role มาจาก server-side mapping |
| `payments/audit.py` | FR-PAY-05/NFR-AUD-01 | ตรง | ไม่เก็บ bearer token |
| `PaymentTrackingPage.jsx` | FR-PAY-01 ถึง FR-PAY-03 | ตรงตามขอบเขต | UI ใช้ Mock Data ภายในตาม spec |

## 3. ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| - | - | - | - | ไม่มีข้อค้นพบใหม่ตามหลักฐานโค้ดและ test ที่ตรวจ | - |

## 4. แก้แล้ว
ไม่มี
